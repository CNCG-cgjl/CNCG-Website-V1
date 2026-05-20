import { notify, formatUpdateMessage } from './lib/notify.js'
import { createRateLimiter, getClientIp, isAllowedBrowserRequest, setCorsHeaders } from './lib/security.js'
import { getServiceSupabase } from './lib/supabase.js'

const checkRateLimit = createRateLimiter()

function normalizeMessage(row) {
  return {
    id: row.id,
    author_name: row.author_name,
    content: row.content,
    created_at: row.created_at,
    review_status: row.review_status || 'pending'
  }
}

function validatePayload(body = {}) {
  const authorName = String(body.authorName || '').trim()
  const content = String(body.content || '').trim()
  const website = String(body.website || '').trim()

  if (website) {
    throw new Error('Invalid submission')
  }
  if (!authorName || authorName.length > 30) {
    throw new Error('昵称长度应为 1-30 个字符')
  }
  if (!content || content.length > 500) {
    throw new Error('留言内容长度应为 1-500 个字符')
  }

  return { authorName, content }
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(req, res)
    return res.status(204).end()
  }

  setCorsHeaders(req, res)

  if (req.method === 'GET') {
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100)
    const status = String(req.query.status || 'approved').toLowerCase()

    // Validate status parameter
    const validStatuses = ['approved', 'pending', 'rejected', 'spam', 'all']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status parameter' })
    }

    try {
      const supabase = getServiceSupabase()
      let query = supabase
        .from('guestbook')
        .select('id, author_name, content, created_at, review_status')
        .order('created_at', { ascending: false })
        .limit(limit)

      // Filter by review_status if specified
      if (status !== 'all') {
        query = query.eq('review_status', status)
      } else {
        // For 'all', only show approved and pending (not rejected/spam)
        query = query.in('review_status', ['approved', 'pending'])
      }

      const { data, error } = await query

      if (error) throw error
      return res.status(200).json({ code: 0, data: data || [] })
    } catch (err) {
      console.error('Failed to fetch guestbook messages:', err)
      return res.status(500).json({ error: '留言加载失败' })
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!isAllowedBrowserRequest(req)) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const clientIp = getClientIp(req)
  if (!checkRateLimit(clientIp, 6, 10 * 60 * 1000)) {
    return res.status(429).json({ error: '提交过于频繁，请稍后再试' })
  }

  let payload
  try {
    payload = validatePayload(req.body)
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }

  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('guestbook')
      .insert({
        author_name: payload.authorName,
        content: payload.content,
        review_status: 'pending'
      })
      .select('id, author_name, content, created_at, review_status')
      .single()

    if (error) throw error

    const message = formatUpdateMessage('new_guestbook', {
      author: payload.authorName,
      content: payload.content,
      status: 'pending'
    })
    notify(message).catch(err => console.error('Guestbook notification failed:', err))

    return res.status(200).json({ code: 0, data: normalizeMessage(data) })
  } catch (err) {
    console.error('Failed to add guestbook message:', err)
    return res.status(500).json({ error: '留言提交失败' })
  }
}
