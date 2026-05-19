import { notify, formatUpdateMessage } from './lib/notify.js'
import { createRateLimiter, getClientIp, isAllowedBrowserRequest, setCorsHeaders } from './lib/security.js'

const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis'

let cachedToken = null
let tokenExpiry = 0

async function getTenantAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken
  }

  const appId = process.env.FEISHU_APP_ID
  const appSecret = process.env.FEISHU_APP_SECRET

  if (!appId || !appSecret) return null

  const response = await fetch(`${FEISHU_API_BASE}/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret })
  })

  const data = await response.json()

  if (data.code === 0) {
    cachedToken = data.tenant_access_token
    tokenExpiry = Date.now() + (data.expire - 60) * 1000
    return cachedToken
  }

  console.error('获取飞书Token失败:', data.msg)
  return null
}

async function saveToFeishuBitable(name, email, subject, message) {
  const appToken = process.env.FEISHU_BITABLE_APP_TOKEN
  const tableId = process.env.FEISHU_BITABLE_TABLE_ID

  if (!appToken || !tableId) return null

  const token = await getTenantAccessToken()
  if (!token) return null

  const url = `${FEISHU_API_BASE}/bitable/v1/apps/${appToken}/tables/${tableId}/records`

  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })

  const body = {
    fields: {
      '姓名': name,
      '邮箱': email,
      '主题': subject || '未填写',
      '留言内容': message,
      '提交时间': now,
      '处理状态': '待处理'
    }
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    if (data.code !== 0) {
      console.error('飞书多维表格写入失败:', data.msg)
      return { error: data.msg }
    }
    return data
  } catch (err) {
    console.error('飞书多维表格写入异常:', err.message)
    return { error: err.message }
  }
}

const checkRateLimit = createRateLimiter()

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
  if (!checkRateLimit(clientIp, 3, 300000)) {
    return res.status(429).json({ error: '提交过于频繁，请5分钟后再试' })
  }

  const { name, email, subject, message, website } = req.body

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

  if (message.length > 2000) {
    return res.status(400).json({ error: '留言内容过长' })
  }

  try {
    const notifyResult = await notify(formatUpdateMessage('custom', {
      content: `📬 网站新咨询\n\n👤 姓名：${name}\n📧 邮箱：${email}\n📝 主题：${subject || '未填写'}\n💬 留言：\n${message}`
    }))

    const bitableResult = await saveToFeishuBitable(name, email, subject, message)
    const notifyFailed = Object.values(notifyResult || {}).some(result => result && result.error)
    const bitableFailed = Boolean(bitableResult?.error)

    if (notifyFailed || bitableFailed) {
      return res.status(502).json({
        error: '消息暂未成功送达，请稍后重试或使用其他方式联系我',
        notify: notifyResult,
        bitable: bitableResult
      })
    }

    return res.status(200).json({
      code: 0,
      message: '消息已发送',
      notify: notifyResult,
      bitable: bitableResult ? 'saved' : 'not_configured'
    })
  } catch (err) {
    console.error('推送失败:', err)
    return res.status(500).json({ error: '消息推送失败' })
  }
}
