import { notify, formatUpdateMessage } from './lib/notify.js'
import { createRateLimiter, getClientIp, isAllowedBrowserRequest, setCorsHeaders } from './lib/security.js'
import { getServiceSupabase } from './lib/supabase.js'

const checkRateLimit = createRateLimiter()
const PAGE_ID_RE = /^(note|blog)-[a-z0-9][a-z0-9.-]*$/i
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function normalizeComment(row) {
  return {
    id: row.id,
    author_name: row.author_name,
    content: row.content,
    created_at: row.created_at,
    parent_id: row.parent_id,
    review_status: row.review_status || 'pending'
  }
}

function getCommentPath(pageId) {
  if (pageId.startsWith('note-')) return `/note/${pageId.slice(5)}`
  if (pageId.startsWith('blog-')) return `/blog/${pageId.slice(5)}`
  return '/'
}

function validatePayload(body = {}) {
  const pageId = String(body.pageId || '').trim()
  const authorName = String(body.authorName || '').trim()
  const authorEmail = String(body.authorEmail || '').trim()
  const content = String(body.content || '').trim()
  const parentId = body.parentId ? String(body.parentId).trim() : null
  const website = String(body.website || '').trim()

  if (website) {
    throw new Error('Invalid submission')
  }
  if (!PAGE_ID_RE.test(pageId)) {
    throw new Error('无效的页面标识')
  }
  if (!authorName || authorName.length > 30) {
    throw new Error('昵称长度应为 1-30 个字符')
  }
  if (authorEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(authorEmail) || authorEmail.length > 100) {
      throw new Error('邮箱格式不正确')
    }
  }
  if (!content || content.length > 1000) {
    throw new Error('评论内容长度应为 1-1000 个字符')
  }
  if (parentId && !UUID_RE.test(parentId)) {
    throw new Error('无效的回复目标')
  }

  return { pageId, authorName, authorEmail, content, parentId }
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(req, res)
    return res.status(204).end()
  }

  setCorsHeaders(req, res)

  if (req.method === 'GET') {
    const pageId = String(req.query.page_id || '').trim()
    const status = String(req.query.status || 'approved').toLowerCase()

    if (!PAGE_ID_RE.test(pageId)) {
      return res.status(400).json({ error: 'Invalid page_id parameter' })
    }

    // Validate status parameter
    const validStatuses = ['approved', 'pending', 'rejected', 'spam', 'all']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status parameter' })
    }

    try {
      const supabase = getServiceSupabase()
      let query = supabase
        .from('comments')
        .select('id, author_name, content, created_at, parent_id, review_status')
        .eq('page_id', pageId)
        .order('created_at', { ascending: true })

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
      console.error('Failed to fetch comments:', err)
      return res.status(500).json({ error: '评论加载失败' })
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
      .from('comments')
      .insert({
        page_id: payload.pageId,
        author_name: payload.authorName,
        author_email: payload.authorEmail,
        content: payload.content,
        parent_id: payload.parentId,
        review_status: 'pending'
      })
      .select('id, author_name, content, created_at, parent_id, review_status')
      .single()

    if (error) throw error

    const message = formatUpdateMessage('new_comment', {
      author: payload.authorName,
      content: payload.content,
      page: payload.pageId,
      url: getCommentPath(payload.pageId),
      status: 'pending'
    })
    notify(message).catch(err => console.error('Comment notification failed:', err))

    return res.status(200).json({ code: 0, data: normalizeComment(data) })
  } catch (err) {
    console.error('Failed to add comment:', err)
    return res.status(500).json({ error: '评论提交失败' })
  }
}

