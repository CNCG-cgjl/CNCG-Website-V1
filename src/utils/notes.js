const noteModules = import.meta.glob('../content/notes/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
})

function parseFrontmatter(raw) {
  const normalized = raw.replace(/\r\n/g, '\n')
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)

  if (!match) {
    return { meta: {}, body: normalized.trim() }
  }

  const [, frontmatter, body] = match
  const meta = {}

  for (const line of frontmatter.split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue

    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    meta[key] = value
  }

  return { meta, body: body.trim() }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function sanitizeUrl(url) {
  const value = String(url || '').trim()
  if (!value) return '#'

  if (
    value.startsWith('/') ||
    value.startsWith('./') ||
    value.startsWith('../') ||
    value.startsWith('#')
  ) {
    return escapeHtml(value)
  }

  try {
    const parsed = new URL(value, 'https://cncg.me')
    if (['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)) {
      return escapeHtml(value)
    }
  } catch {
    return '#'
  }

  return '#'
}

function renderInline(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => `<a href="${sanitizeUrl(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const html = []
  let inCodeBlock = false
  let inUl = false
  let inOl = false
  let paragraph = []

  const flushParagraph = () => {
    if (!paragraph.length) return
    html.push(`<p>${renderInline(paragraph.join(' '))}</p>`)
    paragraph = []
  }

  const closeLists = () => {
    if (inUl) {
      html.push('</ul>')
      inUl = false
    }
    if (inOl) {
      html.push('</ol>')
      inOl = false
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith('```')) {
      flushParagraph()
      closeLists()

      if (inCodeBlock) {
        html.push('</code></pre>')
      } else {
        html.push('<pre><code>')
      }

      inCodeBlock = !inCodeBlock
      continue
    }

    if (inCodeBlock) {
      html.push(`${escapeHtml(line)}\n`)
      continue
    }

    if (!trimmed) {
      flushParagraph()
      closeLists()
      continue
    }

    if (trimmed === '---') {
      flushParagraph()
      closeLists()
      html.push('<hr />')
      continue
    }

    const image = trimmed.match(/^!\[([^\]]*)\]\((.+)\)$/)
    if (image) {
      flushParagraph()
      closeLists()
      const alt = escapeHtml(image[1])
      const src = escapeHtml(image[2])
      html.push(`<p><img src="${src}" alt="${alt}" loading="lazy" /></p>`)
      continue
    }

    const heading = trimmed.match(/^(#{1,4})\s+(.*)$/)
    if (heading) {
      flushParagraph()
      closeLists()
      const level = heading[1].length
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`)
      continue
    }

    if (trimmed.startsWith('> ')) {
      flushParagraph()
      closeLists()
      html.push(`<blockquote>${renderInline(trimmed.slice(2))}</blockquote>`)
      continue
    }

    const unordered = trimmed.match(/^[-*]\s+(.*)$/)
    if (unordered) {
      flushParagraph()
      if (inOl) {
        html.push('</ol>')
        inOl = false
      }
      if (!inUl) {
        html.push('<ul>')
        inUl = true
      }
      html.push(`<li>${renderInline(unordered[1])}</li>`)
      continue
    }

    const ordered = trimmed.match(/^\d+\.\s+(.*)$/)
    if (ordered) {
      flushParagraph()
      if (inUl) {
        html.push('</ul>')
        inUl = false
      }
      if (!inOl) {
        html.push('<ol>')
        inOl = true
      }
      html.push(`<li>${renderInline(ordered[1])}</li>`)
      continue
    }

    paragraph.push(trimmed)
  }

  flushParagraph()
  closeLists()
  if (inCodeBlock) html.push('</code></pre>')

  return html.join('\n')
}

function normalizeTags(rawTags) {
  if (!rawTags) return []
  return rawTags
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)
}

function formatDate(dateString) {
  if (!dateString) return '未标注日期'
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

function estimateReadingTime(content) {
  const words = content.replace(/\s+/g, '').length
  return Math.max(1, Math.round(words / 320))
}

function createExcerpt(content) {
  const text = content
    .replace(/!\[([^\]]*)\]\((.+)\)/g, '$1')
    .replace(/[#>*`\-\n]/g, ' ')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()

  return text.length > 96 ? `${text.slice(0, 96)}...` : text
}

const notes = Object.entries(noteModules)
  .map(([path, raw]) => {
    const slug = path.split('/').pop().replace(/\.md$/, '')
    const { meta, body } = parseFrontmatter(raw)

    return {
      slug,
      title: meta.title || slug,
      date: meta.date || '',
      dateLabel: formatDate(meta.date || ''),
      summary: meta.summary || createExcerpt(body),
      tags: normalizeTags(meta.tags),
      content: body,
      html: renderMarkdown(body),
      readingTime: estimateReadingTime(body)
    }
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export function getAllNotes() {
  return notes
}

export function getNoteBySlug(slug) {
  return notes.find(note => note.slug === slug) || null
}
