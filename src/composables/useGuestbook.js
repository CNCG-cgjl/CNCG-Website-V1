import { supabase, isSupabaseReady } from '@/lib/supabase'

export function useGuestbook() {
  async function fetchMessages(limit = 50) {
    if (!isSupabaseReady) return []

    const { data, error } = await supabase
      .from('guestbook')
      .select('id, author_name, content, created_at')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('获取留言失败:', error)
      return []
    }

    return data || []
  }

  async function addMessage({ authorName, content }) {
    if (!isSupabaseReady) throw new Error('Supabase 未配置')

    const { data, error } = await supabase
      .from('guestbook')
      .insert({
        author_name: authorName.trim(),
        content: content.trim(),
        is_approved: false,
      })
      .select('id, author_name, content, created_at')
      .single()

    if (error) throw new Error(error.message)

    return data
  }

  return { fetchMessages, addMessage }
}