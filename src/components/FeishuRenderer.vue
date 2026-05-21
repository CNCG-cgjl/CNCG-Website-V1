<template>
  <div class="feishu-content" v-html="renderedHtml"></div>
</template>

<script setup>
import { computed } from 'vue'
import { escapeAttr, escapeHtml } from '@/utils/sanitize'

const props = defineProps({
  blocks: {
    type: Array,
    default: () => []
  }
})

const renderedHtml = computed(() => {
  if (!props.blocks || !props.blocks.length) {
    return '<p class="empty">暂无内容</p>'
  }

  const blockMap = buildBlockMap(props.blocks)
  const root = props.blocks.find(block => block?.block_type === 1)
  const rootIds = Array.isArray(root?.children) ? root.children : []
  const topLevelBlocks = rootIds.length
    ? rootIds.map(id => blockMap.get(id)).filter(Boolean)
    : props.blocks.filter(block => block?.block_type !== 1)

  return renderSequence(topLevelBlocks, blockMap)
})

function buildBlockMap(blocks) {
  const map = new Map()
  blocks.forEach(block => {
    if (block?.block_id) {
      map.set(block.block_id, block)
    }
  })
  return map
}

function renderBlocks(blocks, blockMap) {
  return blocks.map(block => renderBlock(block, blockMap)).join('')
}

function renderSequence(blocks, blockMap) {
  let html = ''

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index]
    if (!block) continue

    if (isListType(block.block_type)) {
      const listType = block.block_type
      const grouped = [block]
      while (index + 1 < blocks.length && blocks[index + 1]?.block_type === listType) {
        grouped.push(blocks[index + 1])
        index += 1
      }
      html += renderGroupedList(grouped, blockMap)
      continue
    }

    html += renderBlock(block, blockMap)
  }

  return html
}

function renderBlock(block, blockMap) {
  if (!block) return ''

  const type = block.block_type
  const children = resolveChildren(block, blockMap)

  switch (type) {
    case 2:
      return renderParagraph(block)
    case 3:
      return renderHeading(block, 1, children, blockMap)
    case 4:
      return renderHeading(block, 2, children, blockMap)
    case 5:
      return renderHeading(block, 3, children, blockMap)
    case 6:
      return renderHeading(block, 4, children, blockMap)
    case 7:
      return renderHeading(block, 5, children, blockMap)
    case 8:
      return renderHeading(block, 6, children, blockMap)
    case 12:
      return renderGroupedList([block], blockMap)
    case 13:
      return renderGroupedList([block], blockMap)
    case 14:
      return renderCode(block)
    case 15:
      return renderQuote(block, children, blockMap)
    case 19:
      return renderCallout(block, children, blockMap)
    case 22:
      return renderDivider()
    case 27:
      return renderImage(block)
    case 31:
      return renderTable(block)
    case 17:
      return renderGroupedList([block], blockMap)
    case 34:
      return renderQuote(block, children, blockMap)
    default:
      return renderFallback(block, children, blockMap)
  }
}

function resolveChildren(block, blockMap) {
  if (!Array.isArray(block?.children)) return []
  return block.children
    .map(child => (typeof child === 'string' ? blockMap.get(child) : child))
    .filter(Boolean)
}

function renderParagraph(block) {
  const content = renderInlineText(block)
  return content ? `<p>${content}</p>` : '<p class="spacer" aria-hidden="true"></p>'
}

function renderHeading(block, level, children, blockMap) {
  const content = renderInlineText(block)
  const title = content ? `<h${level}>${content}</h${level}>` : ''
  return `${title}${renderSequence(children, blockMap)}`
}

function renderGroupedList(blocks, blockMap) {
  if (!blocks.length) return ''

  const firstType = blocks[0].block_type
  if (firstType === 17) {
    return renderTodoList(blocks, blockMap)
  }

  const tag = firstType === 13 ? 'ol' : 'ul'
  const items = blocks.map(block => renderListItem(block, blockMap)).filter(Boolean).join('')
  return items ? `<${tag}>${items}</${tag}>` : ''
}

function renderListItem(block, blockMap) {
  if (!block) return ''

  const content = renderInlineText(block)
  const children = resolveChildren(block, blockMap)
  const nested = renderSequence(children, blockMap)

  if (!content && !nested) return ''
  return `<li>${content}${nested}</li>`
}

function renderTodoList(blocks, blockMap) {
  const items = blocks
    .map(child => {
      const done = child.todo?.done || false
      const content = renderInlineText(child)
      const nested = renderSequence(resolveChildren(child, blockMap), blockMap)

      if (!content && !nested) return ''

      const checkbox = done
        ? '<input type="checkbox" checked disabled>'
        : '<input type="checkbox" disabled>'
      const className = done ? 'checked' : ''

      return `<li class="${className}"><span class="todo-row">${checkbox}<span>${content}</span></span>${nested}</li>`
    })
    .filter(Boolean)
    .join('')

  return items ? `<ul class="todo-list">${items}</ul>` : ''
}

function renderCode(block) {
  const content = (block.text?.elements || [])
    .map(el => escapeHtml(el.text_run?.content || ''))
    .join('')
  const language = escapeAttr(block.code?.language || 'plain')

  return `<pre><code class="language-${language}">${content}</code></pre>`
}

function renderQuote(block, children, blockMap) {
  const content = renderInlineText(block)
  const body = renderSequence(children, blockMap)
  return content || body ? `<blockquote>${content}${body}</blockquote>` : ''
}

function renderDivider() {
  return '<hr>'
}

function renderTable(block) {
  const rows = block.table?.rows || []
  if (!rows.length) return ''

  let html = '<table><tbody>'

  rows.forEach((row, index) => {
    const cells = row?.cells || []
    const tag = index === 0 ? 'th' : 'td'
    html += '<tr>'
    cells.forEach(cell => {
      const elements = cell?.text?.elements || []
      const content = elements.map(el => renderTextElement(el)).join('')
      html += `<${tag}>${content}</${tag}>`
    })
    html += '</tr>'
  })

  html += '</tbody></table>'
  return html
}

function renderImage(block) {
  const token = block.image?.token
  if (!token) return ''

  return `<img src="/api/feishu?action=image&token=${encodeURIComponent(token)}" alt="图片" class="content-image" loading="lazy" referrerpolicy="no-referrer" />`
}

function renderCallout(block, children, blockMap) {
  const content = renderInlineText(block)
  const emojiId = escapeHtml(block.callout?.emoji_id || '')
  const body = renderSequence(children, blockMap)

  if (!content && !body) return ''

  return `<div class="callout">${emojiId ? `<span class="emoji">${emojiId}</span>` : ''}<div class="callout-content">${content}${body}</div></div>`
}

function renderFallback(block, children, blockMap) {
  const content = renderInlineText(block)
  const body = renderSequence(children, blockMap)

  if (content && body) return `<div class="block-group"><p>${content}</p>${body}</div>`
  if (content) return `<p>${content}</p>`
  return body
}

function renderInlineText(block) {
  const elements =
    block?.text?.elements ||
    block?.bullet?.elements ||
    block?.ordered?.elements ||
    block?.heading1?.elements ||
    block?.heading2?.elements ||
    block?.heading3?.elements ||
    block?.heading4?.elements ||
    block?.heading5?.elements ||
    block?.heading6?.elements ||
    block?.heading7?.elements ||
    block?.heading8?.elements ||
    block?.heading9?.elements ||
    block?.quote?.elements ||
    block?.callout?.elements ||
    block?.todo?.elements ||
    []
  return elements.map(el => renderTextElement(el)).join('')
}

function isListType(type) {
  return type === 12 || type === 13 || type === 17
}

function renderTextElement(element) {
  if (!element) return ''

  const { text_run, mention, text_link } = element

  let content = ''

  if (text_run) {
    content = escapeHtml(text_run.content || '')
    if (text_run.text_style?.bold) content = `<strong>${content}</strong>`
    if (text_run.text_style?.italic) content = `<em>${content}</em>`
    if (text_run.text_style?.code) content = `<code>${content}</code>`
    if (text_run.text_style?.strikethrough) content = `<s>${content}</s>`
    if (text_run.text_style?.underline) content = `<u>${content}</u>`
    return content
  }

  if (mention) {
    return `<span class="mention">@${escapeHtml(mention.mention_name || '用户')}</span>`
  }

  if (text_link) {
    const url = escapeAttr(text_link.url || '')
    const text = escapeHtml(text_link.text || url)
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
  }

  return ''
}
</script>

<style scoped>
.feishu-content {
  line-height: 1.72;
  color: var(--text-secondary);
  font-size: 0.98rem;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  overflow-wrap: anywhere;
  word-break: break-word;
  max-width: 100%;
}

.feishu-content :deep(h1) {
  font-size: 1.62rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1rem;
  padding-bottom: 0.65rem;
  border-bottom: 1px solid var(--border);
}

.feishu-content :deep(h2) {
  font-size: 1.24rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 1.35rem 0 0.65rem;
}

.feishu-content :deep(h3) {
  font-size: 1.06rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 1.1rem 0 0.45rem;
}

.feishu-content :deep(h4),
.feishu-content :deep(h5),
.feishu-content :deep(h6) {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 1rem 0 0.4rem;
}

.feishu-content :deep(p) {
  margin: 0.55rem 0;
  line-height: 1.72;
  color: inherit;
}

.feishu-content :deep(.block-group) {
  display: grid;
  gap: 0.2rem;
}

.feishu-content :deep(p.spacer) {
  min-height: 0.75rem;
  margin: 0;
}

.feishu-content :deep(a) {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.2s;
}

.feishu-content :deep(a:hover) {
  text-decoration: underline;
}

.feishu-content :deep(code) {
  padding: 0.15rem 0.4rem;
  background: var(--bg-secondary);
  border-radius: 4px;
  font-family: 'Fira Code', 'Monaco', monospace;
  font-size: 0.85em;
  color: var(--accent);
}

.feishu-content :deep(pre) {
  margin: 0.85rem 0;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  overflow-x: auto;
}

.feishu-content :deep(pre code) {
  padding: 0;
  background: none;
  font-size: 0.875rem;
  line-height: 1.6;
}

.feishu-content :deep(ul),
.feishu-content :deep(ol) {
  margin: 0.6rem 0 0.85rem;
  padding-left: 1.35rem;
}

.feishu-content :deep(li) {
  margin: 0.28rem 0;
  line-height: 1.65;
  color: inherit;
}

.feishu-content :deep(li > ul),
.feishu-content :deep(li > ol) {
  margin-top: 0.45rem;
}

.feishu-content :deep(.todo-list) {
  list-style: none;
  padding-left: 0;
}

.feishu-content :deep(.todo-list li) {
  display: grid;
  gap: 0.45rem;
}

.feishu-content :deep(.todo-row) {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.feishu-content :deep(.todo-list li input) {
  margin-top: 0.3rem;
  accent-color: var(--accent);
}

.feishu-content :deep(.todo-list li.checked) {
  color: var(--text-muted);
  text-decoration: line-through;
}

.feishu-content :deep(blockquote) {
  margin: 0.9rem 0;
  padding: 0.75rem 1rem;
  border-left: 4px solid var(--accent);
  background: var(--bg-secondary);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  color: var(--text-secondary);
}

.feishu-content :deep(hr) {
  margin: 1.4rem 0;
  border: none;
  border-top: 1px solid var(--border);
}

.feishu-content :deep(table) {
  display: block;
  width: 100%;
  max-width: 100%;
  margin: 1rem 0;
  border-collapse: collapse;
  font-size: 0.9rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.feishu-content :deep(th),
.feishu-content :deep(td) {
  padding: 0.65rem 0.85rem;
  border: 1px solid var(--border);
  text-align: left;
}

.feishu-content :deep(th) {
  background: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-primary);
}

.feishu-content :deep(img.content-image) {
  max-width: 100%;
  margin: 0.9rem 0;
  border-radius: var(--radius-md);
}

.feishu-content :deep(.callout) {
  display: flex;
  gap: 0.75rem;
  margin: 0.9rem 0;
  padding: 0.85rem 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

.feishu-content :deep(.callout .emoji) {
  font-size: 1.25rem;
}

.feishu-content :deep(.callout .callout-content) {
  flex: 1;
}

.feishu-content :deep(.mention) {
  color: var(--accent);
  background: var(--bg-secondary);
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
  font-size: 0.9em;
}

.feishu-content :deep(.empty) {
  text-align: center;
  color: var(--text-muted);
  padding: 3rem 0;
}

[data-theme="dark"] .feishu-content {
  color: rgba(224, 232, 241, 0.88);
}

[data-theme="dark"] .feishu-content :deep(h1),
[data-theme="dark"] .feishu-content :deep(h2),
[data-theme="dark"] .feishu-content :deep(h3),
[data-theme="dark"] .feishu-content :deep(h4),
[data-theme="dark"] .feishu-content :deep(h5),
[data-theme="dark"] .feishu-content :deep(h6) {
  color: rgba(246, 248, 251, 0.97);
}

[data-theme="dark"] .feishu-content :deep(blockquote),
[data-theme="dark"] .feishu-content :deep(pre),
[data-theme="dark"] .feishu-content :deep(.callout),
[data-theme="dark"] .feishu-content :deep(th) {
  background: rgba(54, 67, 87, 0.38);
  border-color: rgba(163, 177, 198, 0.14);
}

[data-theme="dark"] .feishu-content :deep(code) {
  background: rgba(54, 67, 87, 0.42);
  color: rgba(134, 239, 172, 0.95);
}
</style>
