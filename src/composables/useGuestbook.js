import { isSupabaseReady } from '@/lib/supabase'

async function readApiResult(response) {
  const text = await response.text()
  if (!text) return {}

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`API returned non-JSON response (${response.status})`)
  }
}

export function useGuestbook() {
  async function fetchMessages(limit = 50) {
    if (!isSupabaseReady) return []

    try {
      const response = await fetch(`/api/guestbook?limit=${encodeURIComponent(limit)}`)
      const result = await readApiResult(response)
      if (!response.ok) throw new Error(result.error || '获取留言失败')
      return result.data || []
    } catch (error) {
      console.error('获取留言失败:', error)
      return []
    }
  }

  async function addMessage({ authorName, content, website = '' }) {
    if (!isSupabaseReady) throw new Error('Supabase 未配置')

    const response = await fetch('/api/guestbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        authorName: authorName.trim(),
        content: content.trim(),
        website
      })
    })

    const result = await readApiResult(response)
    if (!response.ok) throw new Error(result.error || '留言提交失败')

    return result.data
  }

  return { fetchMessages, addMessage }
}
