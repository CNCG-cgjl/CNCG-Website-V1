import { ref } from 'vue'

const API_BASE = '/api/notify'

const callTimestamps = new Map()

function checkRateLimit(key, maxCalls = 5, windowMs = 60000) {
  const now = Date.now()
  const calls = callTimestamps.get(key) || []
  const recent = calls.filter(t => now - t < windowMs)

  if (recent.length >= maxCalls) return false

  recent.push(now)
  callTimestamps.set(key, recent)
  return true
}

export function useNotify() {
  const loading = ref(false)
  const error = ref(null)

  async function sendNotification(type, data) {
    loading.value = true
    error.value = null

    if (!checkRateLimit('notify', 5, 60000)) {
      error.value = '操作过于频繁，请稍后再试'
      loading.value = false
      throw new Error(error.value)
    }

    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data })
      })

      const result = await response.json()

      if (!response.ok && response.status !== 207) {
        throw new Error(result.error || '推送失败')
      }

      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function notifyNewArticle(title, summary, slug) {
    return sendNotification('new_article', { title, summary, slug })
  }

  async function notifyNewNote(title, summary, slug) {
    return sendNotification('new_note', { title, summary, slug })
  }

  async function notifyNewComment(author, content, page, url) {
    return sendNotification('new_comment', { author, content, page, url })
  }

  async function notifyNewGuestbook(author, content) {
    return sendNotification('new_guestbook', { author, content })
  }

  async function notifySiteUpdate(content) {
    return sendNotification('site_update', { content })
  }

  async function notifyCustom(content) {
    return sendNotification('custom', { content })
  }

  return {
    loading,
    error,
    sendNotification,
    notifyNewArticle,
    notifyNewNote,
    notifyNewComment,
    notifyNewGuestbook,
    notifySiteUpdate,
    notifyCustom
  }
}