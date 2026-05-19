const ALLOWED_ORIGINS = [
  'https://cncg.me',
  'https://www.cncg.me',
  'http://localhost:5173',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5175'
]

export function isAllowedOrigin(origin = '') {
  return ALLOWED_ORIGINS.includes(origin)
}

export function isAllowedReferer(referer = '') {
  return ALLOWED_ORIGINS.some(allowedOrigin => referer === allowedOrigin || referer.startsWith(`${allowedOrigin}/`))
}

export function isAllowedBrowserRequest(req) {
  const origin = req.headers.origin || ''
  if (origin && isAllowedOrigin(origin)) return true

  const referer = req.headers.referer || ''
  if (referer && isAllowedReferer(referer)) return true

  return false
}

export function setCorsHeaders(req, res, {
  methods = 'GET, POST, OPTIONS',
  headers = 'Content-Type'
} = {}) {
  const origin = req.headers.origin || ''
  if (isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', methods)
  res.setHeader('Access-Control-Allow-Headers', headers)
}

export function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown'
}

export function createRateLimiter() {
  const requestMap = new Map()

  return function checkRateLimit(key, maxRequests, windowMs) {
    const now = Date.now()
    const timestamps = requestMap.get(key) || []
    const recent = timestamps.filter(timestamp => now - timestamp < windowMs)

    if (recent.length >= maxRequests) return false

    recent.push(now)
    requestMap.set(key, recent)
    return true
  }
}

