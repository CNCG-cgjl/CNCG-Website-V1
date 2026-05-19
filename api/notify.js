import { notify, formatUpdateMessage } from './lib/notify.js'
import { createRateLimiter, getClientIp, setCorsHeaders } from './lib/security.js'

const checkRateLimit = createRateLimiter()

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(req, res)
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  setCorsHeaders(req, res)

  const clientIp = getClientIp(req)
  if (!checkRateLimit(clientIp, 10, 60000)) {
    return res.status(429).json({ error: 'Too many requests, please try again later.' })
  }

  const notifyToken = process.env.NOTIFY_TOKEN
  if (notifyToken) {
    const clientToken = req.headers['x-notify-token']
    if (clientToken !== notifyToken) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }

  const { type, data } = req.body || {}
  if (!type) {
    return res.status(400).json({ error: 'Missing type parameter' })
  }

  const validTypes = ['new_article', 'new_note', 'new_comment', 'new_guestbook', 'site_update', 'custom']
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: `Invalid type parameter. Valid types: ${validTypes.join(', ')}` })
  }

  if (!data) {
    return res.status(400).json({ error: 'Missing data parameter' })
  }

  try {
    const message = formatUpdateMessage(type, data)
    const results = await notify(message)
    const hasError = Object.values(results).some(result => result && result.error)

    if (hasError) {
      return res.status(207).json({
        code: 1,
        message: 'Notification partially failed.',
        results
      })
    }

    return res.status(200).json({
      code: 0,
      message: 'Notification sent successfully.',
      results
    })
  } catch (err) {
    console.error('Notification delivery failed:', err)
    return res.status(500).json({ error: err.message })
  }
}
