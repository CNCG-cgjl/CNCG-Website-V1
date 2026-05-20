import { notify, formatUpdateMessage } from './lib/notify.js'
import { createRateLimiter, getClientIp, isAllowedBrowserRequest, setCorsHeaders } from './lib/security.js'

const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis'
const checkRateLimit = createRateLimiter()

let cachedToken = null
let tokenExpiry = 0

function isLocalDevRequest(req) {
  const origin = req.headers.origin || ''
  const referer = req.headers.referer || ''

  return (
    origin.startsWith('http://localhost:') ||
    origin.startsWith('http://127.0.0.1:') ||
    referer.startsWith('http://localhost:') ||
    referer.startsWith('http://127.0.0.1:')
  )
}

function buildContactError(req, message, extras = {}) {
  if (isLocalDevRequest(req)) {
    return { error: message, ...extras }
  }

  return { error: message }
}

async function getTenantAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken
  }

  const appId = process.env.FEISHU_APP_ID
  const appSecret = process.env.FEISHU_APP_SECRET

  if (!appId || !appSecret) {
    return null
  }

  const response = await fetch(`${FEISHU_API_BASE}/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret })
  })

  const data = await response.json()
  if (data.code !== 0) {
    console.error('Failed to get Feishu tenant token:', data.msg)
    return null
  }

  cachedToken = data.tenant_access_token
  tokenExpiry = Date.now() + (data.expire - 60) * 1000
  return cachedToken
}

async function saveToFeishuBitable(name, email, subject, message) {
  const appToken = process.env.FEISHU_BITABLE_APP_TOKEN
  const tableId = process.env.FEISHU_BITABLE_TABLE_ID

  if (!appToken || !tableId) {
    return null
  }

  try {
    const token = await getTenantAccessToken()
    if (!token) {
      return { error: 'missing_feishu_token' }
    }

    const response = await fetch(`${FEISHU_API_BASE}/bitable/v1/apps/${appToken}/tables/${tableId}/records`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          姓名: name,
          邮箱: email,
          主题: subject || '未填写',
          留言内容: message,
          提交时间: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
          处理状态: '待处理'
        }
      })
    })

    const data = await response.json()
    if (data.code !== 0) {
      console.error('Failed to write Feishu Bitable record:', data.msg)
      return { error: data.msg || 'bitable_write_failed', details: data }
    }

    return data
  } catch (err) {
    console.error('Feishu Bitable request failed:', err)
    return { error: err.message || 'bitable_request_failed' }
  }
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(req, res, { methods: 'POST, OPTIONS' })
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  setCorsHeaders(req, res, { methods: 'POST, OPTIONS' })

  if (!isAllowedBrowserRequest(req)) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const clientIp = getClientIp(req)
  if (!isLocalDevRequest(req) && !checkRateLimit(clientIp, 3, 300000)) {
    return res.status(429).json({ error: '提交过于频繁，请5分钟后再试' })
  }

  const { name, email, subject, message, website } = req.body || {}

  if (website) {
    return res.status(400).json({ error: '提交无效' })
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: '缺少必填字段' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: '邮箱格式不正确' })
  }

  if (String(message).length > 2000) {
    return res.status(400).json({ error: '留言内容过长' })
  }

  const notifyResult = await notify(formatUpdateMessage('custom', {
    content: `Website contact\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject || 'No subject'}\nMessage:\n${message}`
  }))

  const notifyFailed = Object.values(notifyResult || {}).some(result => result && result.error)
  const bitableResult = await saveToFeishuBitable(name, email, subject, message)
  const bitableFailed = Boolean(bitableResult?.error)

  if (bitableFailed) {
    return res.status(502).json(buildContactError(req, '消息暂未成功保存，请稍后重试', {
      notify: notifyResult,
      notify_status: notifyFailed ? 'failed' : 'sent',
      bitable: bitableResult
    }))
  }

  return res.status(200).json({
    code: 0,
    message: '消息已提交',
    notify: notifyResult,
    notify_status: notifyFailed ? 'failed' : 'sent',
    bitable: bitableResult ? 'saved' : 'not_configured'
  })
}
