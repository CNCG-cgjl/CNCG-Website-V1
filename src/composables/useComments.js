import { isSupabaseReady } from '@/lib/supabase'

export function useComments() {
  async function fetchComments(pageId) {
    if (!isSupabaseReady) return []

    try {
      const response = await fetch(`/api/comments?page_id=${encodeURIComponent(pageId)}`)
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || '获取评论失败')
      return result.data || []
    } catch (error) {
      console.error('获取评论失败:', error)
      return []
    }
  }

  async function addComment(pageId, { authorName, authorEmail, content, parentId = null, website = '' }) {
    if (!isSupabaseReady) throw new Error('Supabase 未配置')

    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageId,
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim(),
        content: content.trim(),
        parentId,
        website
      })
    })

    const result = await response.json()
    if (!response.ok) throw new Error(result.error || '评论提交失败')

    return result.data
  }

  function organizeComments(comments) {
    const map = {}
    const roots = []

    comments.forEach(c => {
      map[c.id] = { ...c, children: [] }
    })

    comments.forEach(c => {
      if (c.parent_id && map[c.parent_id]) {
        map[c.parent_id].children.push(map[c.id])
      } else {
        roots.push(map[c.id])
      }
    })

    return roots
  }

  return { fetchComments, addComment, organizeComments }
}
