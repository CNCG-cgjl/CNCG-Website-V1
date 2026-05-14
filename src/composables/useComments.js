import { supabase, isSupabaseReady } from '@/lib/supabase'

export function useComments() {
  async function fetchComments(pageId) {
    if (!isSupabaseReady) return []

    const { data, error } = await supabase
      .from('comments')
      .select('id, author_name, author_email, content, created_at, parent_id')
      .eq('page_id', pageId)
      .eq('is_approved', true)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('获取评论失败:', error)
      return []
    }

    return data || []
  }

  async function addComment(pageId, { authorName, authorEmail, content, parentId = null }) {
    if (!isSupabaseReady) throw new Error('Supabase 未配置')

    const { data, error } = await supabase
      .from('comments')
      .insert({
        page_id: pageId,
        author_name: authorName.trim(),
        author_email: authorEmail.trim(),
        content: content.trim(),
        parent_id: parentId,
        is_approved: false,
      })
      .select('id, author_name, content, created_at, parent_id')
      .single()

    if (error) throw new Error(error.message)

    return data
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