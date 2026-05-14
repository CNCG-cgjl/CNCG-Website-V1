const ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
}

const ESCAPE_RE = /[&<>"']/g

export function escapeHtml(text) {
  if (!text) return ''
  return String(text).replace(ESCAPE_RE, ch => ESCAPE_MAP[ch])
}

export function escapeAttr(text) {
  if (!text) return ''
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const DANGEROUS_RE = /<(script|iframe|object|embed|form|input|textarea|button|meta|link|base|svg\s)/gi
const ON_EVENT_RE = /\bon\w+\s*=/gi

export function sanitizeHtml(html) {
  if (!html) return ''
  return html
    .replace(DANGEROUS_RE, '&lt;$1')
    .replace(ON_EVENT_RE, 'data-sanitized=')
}
