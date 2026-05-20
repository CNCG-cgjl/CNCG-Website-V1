import { getServiceSupabase } from './lib/supabase.js'
import { setCorsHeaders } from './lib/security.js'

// Simple admin token validation (should be environment variable)
function validateAdminToken(token) {
  const adminToken = process.env.ADMIN_REVIEW_TOKEN
  if (!adminToken) {
    console.warn('ADMIN_REVIEW_TOKEN not configured')
    return false
  }
  return token === adminToken
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(req, res)
    return res.status(204).end()
  }

  setCorsHeaders(req, res)

  // Validate admin token
  const token = req.headers['x-admin-token'] || req.query.token
  if (!validateAdminToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // GET: Fetch pending items for review
  if (req.method === 'GET') {
    const type = String(req.query.type || 'all').toLowerCase()
    const status = String(req.query.status || 'pending').toLowerCase()

    const validTypes = ['comments', 'guestbook', 'all']
    const validStatuses = ['pending', 'approved', 'rejected', 'spam']

    if (!validTypes.includes(type) || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid parameters' })
    }

    try {
      const supabase = getServiceSupabase()
      const results = {}

      if (type === 'comments' || type === 'all') {
        const { data: comments, error: commentsError } = await supabase
          .from('comments')
          .select('id, page_id, author_name, author_email, content, created_at, review_status, parent_id')
          .eq('review_status', status)
          .order('created_at', { ascending: false })

        if (commentsError) throw commentsError
        results.comments = comments || []
      }

      if (type === 'guestbook' || type === 'all') {
        const { data: guestbook, error: guestbookError } = await supabase
          .from('guestbook')
          .select('id, author_name, content, created_at, review_status')
          .eq('review_status', status)
          .order('created_at', { ascending: false })

        if (guestbookError) throw guestbookError
        results.guestbook = guestbook || []
      }

      return res.status(200).json({ code: 0, data: results })
    } catch (err) {
      console.error('Failed to fetch review items:', err)
      return res.status(500).json({ error: '加载失败' })
    }
  }

  // PATCH: Update review status
  if (req.method === 'PATCH') {
    const { type, id, status, reason } = req.body

    const validTypes = ['comments', 'guestbook']
    const validStatuses = ['approved', 'rejected', 'spam']

    if (!validTypes.includes(type) || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid parameters' })
    }

    if (!id) {
      return res.status(400).json({ error: 'Missing id' })
    }

    try {
      const supabase = getServiceSupabase()
      const table = type === 'comments' ? 'comments' : 'guestbook'

      const updateData = {
        review_status: status,
        reviewed_at: new Date().toISOString()
      }

      if (reason) {
        updateData.review_reason = reason
      }

      const { data, error } = await supabase
        .from(table)
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return res.status(200).json({ code: 0, data })
    } catch (err) {
      console.error('Failed to update review status:', err)
      return res.status(500).json({ error: '更新失败' })
    }
  }

  // DELETE: Permanently delete a submission
  if (req.method === 'DELETE') {
    const { type, id } = req.body

    const validTypes = ['comments', 'guestbook']

    if (!validTypes.includes(type) || !id) {
      return res.status(400).json({ error: 'Invalid parameters' })
    }

    try {
      const supabase = getServiceSupabase()
      const table = type === 'comments' ? 'comments' : 'guestbook'

      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) throw error

      return res.status(200).json({ code: 0, message: '已删除' })
    } catch (err) {
      console.error('Failed to delete submission:', err)
      return res.status(500).json({ error: '删除失败' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
