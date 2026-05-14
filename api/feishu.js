const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis'

let cachedToken = null
let tokenExpiry = 0

async function getTenantAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken
  }

  const appId = process.env.FEISHU_APP_ID
  const appSecret = process.env.FEISHU_APP_SECRET

  if (!appId || !appSecret) {
    throw new Error('飞书应用凭证未配置')
  }

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
  } else {
    throw new Error(data.msg || '获取Token失败')
  }
}

async function feishuProxy(path, options = {}) {
  const token = await getTenantAccessToken()

  const url = `${FEISHU_API_BASE}${path}`
  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options.headers
  }

  if (options.body && typeof options.body === 'object') {
    headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(options.body)
  }

  const response = await fetch(url, { ...options, headers })
  const data = await response.json()

  if (data.code !== 0) {
    throw new Error(data.msg || '飞书API请求失败')
  }

  return data
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(204).end()
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { action } = req.query

  try {
    let result

    switch (action) {
      case 'token': {
        const token = await getTenantAccessToken()
        result = { token }
        break
      }

      case 'documents': {
        const { folder_token } = req.query
        const queryParam = folder_token ? `?folder_token=${folder_token}` : ''
        result = await feishuProxy(`/drive/v1/files${queryParam}`)
        break
      }

      case 'document': {
        const { doc_id } = req.query
        if (!doc_id) return res.status(400).json({ error: '缺少 doc_id 参数' })
        result = await feishuProxy(`/docx/v1/documents/${doc_id}`)
        break
      }

      case 'document_content': {
        const { doc_id } = req.query
        if (!doc_id) return res.status(400).json({ error: '缺少 doc_id 参数' })
        result = await feishuProxy(`/docx/v1/documents/${doc_id}/blocks`)
        break
      }

      case 'wiki_nodes': {
        const { space_id } = req.query
        if (!space_id) return res.status(400).json({ error: '缺少 space_id 参数' })
        result = await feishuProxy(`/wiki/v2/spaces/${space_id}/nodes`)
        break
      }

      case 'image': {
        const { token: imageToken } = req.query
        if (!imageToken) return res.status(400).json({ error: '缺少 token 参数' })

        const feishuToken = await getTenantAccessToken()
        const imageUrl = `https://open.feishu.cn/open-apis/drive/v1/medias/${imageToken}/binary`

        const imageResponse = await fetch(imageUrl, {
          headers: { 'Authorization': `Bearer ${feishuToken}` }
        })

        if (!imageResponse.ok) {
          return res.status(502).json({ error: '图片获取失败' })
        }

        const contentType = imageResponse.headers.get('content-type') || 'image/png'
        const buffer = Buffer.from(await imageResponse.arrayBuffer())

        res.setHeader('Content-Type', contentType)
        res.setHeader('Cache-Control', 'public, max-age=86400')
        res.setHeader('Access-Control-Allow-Origin', '*')
        return res.status(200).send(buffer)
      }

      default:
        return res.status(400).json({ error: '无效的 action 参数', valid_actions: ['token', 'documents', 'document', 'document_content', 'wiki_nodes', 'image'] })
    }

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    return res.status(200).json({ code: 0, data: result })
  } catch (err) {
    console.error('飞书API代理错误:', err)
    return res.status(500).json({ error: err.message || '服务器内部错误' })
  }
}
