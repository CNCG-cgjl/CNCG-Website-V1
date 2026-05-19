import { notify, formatUpdateMessage } from '../lib/notify.js'

const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis'
const CRON_SCHEDULE_HOURS = 6

let cachedToken = null
let tokenExpiry = 0

async function getFeishuToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken

  const appId = process.env.FEISHU_APP_ID
  const appSecret = process.env.FEISHU_APP_SECRET
  if (!appId || !appSecret) {
    throw new Error('FEISHU_APP_ID or FEISHU_APP_SECRET is not configured')
  }

  const response = await fetch(`${FEISHU_API_BASE}/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret })
  })

  const data = await response.json()
  if (data.code !== 0) {
    throw new Error(data.msg || 'Failed to get Feishu token')
  }

  cachedToken = data.tenant_access_token
  tokenExpiry = Date.now() + (data.expire - 60) * 1000
  return cachedToken
}

async function getLatestDocs(token, folderToken) {
  const response = await fetch(
    `${FEISHU_API_BASE}/drive/v1/files?folder_token=${folderToken}&order_by=EditedTime&direction=DESC`,
    { headers: { Authorization: `Bearer ${token}` } }
  )

  const data = await response.json()
  return data.code === 0 ? data.data?.files || [] : []
}

async function getDocTitle(token, docId) {
  const response = await fetch(`${FEISHU_API_BASE}/docx/v1/documents/${docId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  const data = await response.json()
  return data.code === 0 ? data.data?.document?.title || 'Untitled' : 'Untitled'
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const cronToken = process.env.CRON_TOKEN
  if (cronToken) {
    const clientToken = req.headers['x-cron-token'] || req.query?.token
    if (clientToken !== cronToken) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }

  const folderToken = process.env.FEISHU_BLOG_FOLDER_ID
  if (!folderToken) {
    return res.status(400).json({ error: 'FEISHU_BLOG_FOLDER_ID is not configured' })
  }

  try {
    const token = await getFeishuToken()
    const docs = await getLatestDocs(token, folderToken)

    if (!docs.length) {
      return res.status(200).json({ code: 0, message: 'No documents found.', notified: 0 })
    }

    const now = Date.now()
    const checkWindow = CRON_SCHEDULE_HOURS * 60 * 60 * 1000
    const recentDocs = docs.filter(doc => {
      const editedTime = new Date(doc.last_edited_time || doc.modified_time || doc.created_time).getTime()
      return now - editedTime < checkWindow
    })

    if (!recentDocs.length) {
      return res.status(200).json({ code: 0, message: 'No recent updates found.', notified: 0 })
    }

    let notifiedCount = 0
    for (const doc of recentDocs) {
      const slug = doc.id || doc.token
      const title = await getDocTitle(token, slug)

      await notify(formatUpdateMessage('new_article', {
        title,
        summary: doc.type || '',
        slug
      }))

      notifiedCount += 1
    }

    return res.status(200).json({
      code: 0,
      message: `Checked successfully and pushed ${notifiedCount} updates.`,
      notified: notifiedCount,
      total: docs.length
    })
  } catch (err) {
    console.error('Scheduled update check failed:', err)
    return res.status(500).json({ error: err.message })
  }
}
