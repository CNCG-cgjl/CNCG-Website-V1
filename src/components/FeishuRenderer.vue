<template>
  <div class="feishu-content" v-html="renderedHtml"></div>
</template>

<script setup>
import { computed } from 'vue'
import { escapeHtml, escapeAttr } from '@/utils/sanitize'

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

  return props.blocks.map(block => renderBlock(block)).join('')
})

function renderBlock(block) {
  if (!block) return ''

  const type = block.block_type
  const children = block.children || []

  switch (type) {
    case 2:
      return renderParagraph(block)
    case 3:
      return renderHeading(block, 1)
    case 4:
      return renderHeading(block, 2)
    case 5:
      return renderHeading(block, 3)
    case 6:
      return renderHeading(block, 4)
    case 7:
      return renderHeading(block, 5)
    case 8:
      return renderHeading(block, 6)
    case 9:
      return renderBulletList(block, children)
    case 10:
      return renderOrderedList(block, children)
    case 11:
      return renderCode(block)
    case 12:
      return renderQuote(block)
    case 13:
      return renderDivider()
    case 14:
      return renderTable(block)
    case 15:
      return renderImage(block)
    case 16:
      return renderCallout(block)
    case 17:
      return renderTodoList(block, children)
    default:
      return renderText(block)
  }
}

function renderParagraph(block) {
  const elements = block.text?.elements || []
  const content = elements.map(el => renderTextElement(el)).join('')
  return content ? `<p>${content}</p>` : '<br>'
}

function renderHeading(block, level) {
  const elements = block.text?.elements || []
  const content = elements.map(el => renderTextElement(el)).join('')
  return content ? `<h${level}>${content}</h${level}>` : ''
}

function renderBulletList(block, children) {
  if (!children || !children.length) return ''

  const items = children
    .filter(child => child.block_type === 10)
    .map(child => {
      const elements = child.text?.elements || []
      const content = elements.map(el => renderTextElement(el)).join('')
      return `<li>${content}</li>`
    })
    .join('')

  return `<ul>${items}</ul>`
}

function renderOrderedList(block, children) {
  if (!children || !children.length) return ''

  const items = children
    .filter(child => child.block_type === 10)
    .map(child => {
      const elements = child.text?.elements || []
      const content = elements.map(el => renderTextElement(el)).join('')
      return `<li>${content}</li>`
    })
    .join('')

  return `<ol>${items}</ol>`
}

function renderTodoList(block, children) {
  if (!children || !children.length) return ''

  const items = children
    .filter(child => child.block_type === 18)
    .map(child => {
      const done = child.todo?.done || false
      const elements = child.text?.elements || []
      const content = elements.map(el => renderTextElement(el)).join('')
      const checkbox = done
        ? '<input type="checkbox" checked disabled>'
        : '<input type="checkbox" disabled>'
      const className = done ? 'checked' : ''
      return `<li class="${className}">${checkbox}${content}</li>`
    })
    .join('')

  return `<ul class="todo-list">${items}</ul>`
}

function renderCode(block) {
  const elements = block.text?.elements || []
  const content = elements.map(el => escapeHtml(el.text_run?.content || '')).join('')
  const language = escapeAttr(block.code?.language || 'plain')

  return `<pre><code class="language-${language}">${content}</code></pre>`
}

function renderQuote(block) {
  const elements = block.text?.elements || []
  const content = elements.map(el => renderTextElement(el)).join('')
  return content ? `<blockquote>${content}</blockquote>` : ''
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

function renderCallout(block) {
  const elements = block.text?.elements || []
  const content = elements.map(el => renderTextElement(el)).join('')
  const emojiId = escapeHtml(block.callout?.emoji_id || '')

  return `<div class="callout">${emojiId ? `<span class="emoji">${emojiId}</span>` : ''}<div class="callout-content">${content}</div></div>`
}

function renderText(block) {
  const elements = block.text?.elements || []
  return elements.map(el => renderTextElement(el)).join('')
}

function renderTextElement(element) {
  if (!element) return ''

  const { text_run, mention, text_link } = element

  let content = ''

  if (text_run) {
    content = escapeHtml(text_run.content || '')
    if (text_run.text_style?.bold) {
      content = `<strong>${content}</strong>`
    }
    if (text_run.text_style?.italic) {
      content = `<em>${content}</em>`
    }
    if (text_run.text_style?.code) {
      content = `<code>${content}</code>`
    }
    if (text_run.text_style?.strikethrough) {
      content = `<s>${content}</s>`
    }
    if (text_run.text_style?.underline) {
      content = `<u>${content}</u>`
    }
  } else if (mention) {
    content = `<span class="mention">@${escapeHtml(mention.mention_name || '用户')}</span>`
  } else if (text_link) {
    const url = escapeAttr(text_link.url || '')
    const text = escapeHtml(text_link.text || url)
    content = `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
  }

  return content
}
</script>

<style scoped>
.feishu-content {
  line-height: 1.8;
  color: var(--text-secondary);
}

.feishu-content :deep(h1) {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 2rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border);
}

.feishu-content :deep(h2) {
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 1.75rem 0 0.75rem;
}

.feishu-content :deep(h3) {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 1.5rem 0 0.5rem;
}

.feishu-content :deep(h4),
.feishu-content :deep(h5),
.feishu-content :deep(h6) {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 1.25rem 0 0.5rem;
}

.feishu-content :deep(p) {
  margin: 0.75rem 0;
  line-height: 1.8;
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
  margin: 1rem 0;
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
  margin: 0.75rem 0;
  padding-left: 1.5rem;
}

.feishu-content :deep(li) {
  margin: 0.35rem 0;
  line-height: 1.7;
}

.feishu-content :deep(.todo-list) {
  list-style: none;
  padding-left: 0;
}

.feishu-content :deep(.todo-list li) {
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
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  border-left: 4px solid var(--accent);
  background: var(--bg-secondary);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  color: var(--text-secondary);
}

.feishu-content :deep(hr) {
  margin: 2rem 0;
  border: none;
  border-top: 1px solid var(--border);
}

.feishu-content :deep(table) {
  width: 100%;
  margin: 1rem 0;
  border-collapse: collapse;
  font-size: 0.9rem;
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
  margin: 1rem 0;
  border-radius: var(--radius-md);
}

.feishu-content :deep(.callout) {
  display: flex;
  gap: 0.75rem;
  margin: 1rem 0;
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
</style>