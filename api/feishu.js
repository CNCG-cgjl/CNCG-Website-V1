const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis'
const DOC_ID_REGEX = /^[a-zA-Z0-9]{10,30}$/
const ALLOWED_ORIGINS = [
  'https://cncg.me',
  'https://www.cncg.me',
  'http://localhost:5173',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5175'
]

let cachedToken = null
let tokenExpiry = 0

async function getTenantAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken
  }

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
    throw new Error(data.msg || 'Failed to get Feishu tenant token')
  }

  cachedToken = data.tenant_access_token
  tokenExpiry = Date.now() + (data.expire - 60) * 1000
  return cachedToken
}

async function feishuProxy(path, options = {}) {
  const token = await getTenantAccessToken()

  const headers = {
    Authorization: `Bearer ${token}`,
    ...options.headers
  }

  let body = options.body
  if (body && typeof body === 'object' && !(body instanceof ArrayBuffer)) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(body)
  }

  const response = await fetch(`${FEISHU_API_BASE}${path}`, {
    ...options,
    headers,
    body
  })

  const data = await response.json()
  if (data.code !== 0) {
    throw new Error(data.msg || 'Feishu API request failed')
  }

  return data
}

function extractTitle(block) {
  const fields = {
    2: 'paragraph',
    3: 'heading1',
    4: 'heading2',
    5: 'heading3',
    6: 'heading4',
    7: 'heading5',
    8: 'heading6',
    9: 'bullet_list',
    10: 'ordered_list',
    16: 'callout'
  }

  const field = fields[block.block_type]
  if (!field || !block[field]) return null

  const elements = block[field].elements || []
  return elements.map(el => el.text_run?.content || '').join('')
}

function setCorsHeaders(req, res) {
  const origin = req.headers.origin || ''
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

async function getWikiMeta() {
  const wikiToken = process.env.FEISHU_WIKI_TOKEN
  if (!wikiToken) {
    throw new Error('FEISHU_WIKI_TOKEN is not configured')
  }

  const nodeInfo = await feishuProxy(`/wiki/v2/spaces/get_node?token=${wikiToken}`)
  return {
    wiki_token: wikiToken,
    space_id: nodeInfo.data?.node?.space_id || ''
  }
}

async function getWikiRoot() {
  const wikiToken = process.env.FEISHU_WIKI_TOKEN
  if (!wikiToken) {
    throw new Error('FEISHU_WIKI_TOKEN is not configured')
  }

  const docData = await feishuProxy(`/docx/v1/documents/${wikiToken}`)
  const blocksData = await feishuProxy(`/docx/v1/documents/${wikiToken}/blocks?page_size=50`)

  const children = blocksData.data?.items?.[0]?.children || []
  const childDocs = []

  for (const childId of children) {
    const childBlock = blocksData.data?.items?.find(block => block.block_id === childId)
    if (!childBlock) continue

    childDocs.push({
      id: childId,
      title: extractTitle(childBlock) || 'Untitled',
      type: childBlock.block_type,
      url: `https://rcn17b9k6gos.feishu.cn/wiki/${childId}`
    })
  }

  return {
    title: docData.data?.document?.title || 'Knowledge Base',
    document_id: wikiToken,
    children: childDocs
  }
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(req, res)
    return res.status(204).end()
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { action } = req.query

  try {
    let result

    switch (action) {
      case 'documents': {
        const folderToken = req.query.folder_token || process.env.FEISHU_BLOG_FOLDER_ID
        const queryParam = folderToken ? `?folder_token=${folderToken}` : ''
        result = await feishuProxy(`/drive/v1/files${queryParam}`)
        break
      }

      case 'blog_meta': {
        const folderToken = process.env.FEISHU_BLOG_FOLDER_ID
        result = {
          configured: !!folderToken,
          editor_url: folderToken ? `https://rcn17b9k6gos.feishu.cn/docx/${folderToken}` : ''
        }
        break
      }

      case 'token': {
        await getTenantAccessToken()
        result = {
          configured: true,
          auth_ok: true
        }
        break
      }

      case 'document': {
        const { doc_id: docId } = req.query
        if (!docId || !DOC_ID_REGEX.test(docId)) {
          return res.status(400).json({ error: 'Invalid doc_id parameter' })
        }
        result = await feishuProxy(`/docx/v1/documents/${docId}`)
        break
      }

      case 'document_content': {
        const { doc_id: docId } = req.query
        if (!docId || !DOC_ID_REGEX.test(docId)) {
          return res.status(400).json({ error: 'Invalid doc_id parameter' })
        }
        result = await feishuProxy(`/docx/v1/documents/${docId}/blocks`)
        break
      }

      case 'wiki_space_list':
        result = await feishuProxy('/wiki/v2/spaces?page_size=20')
        break

      case 'wiki_space_nodes': {
        const { space_id: spaceId, parent_node_token: parentNodeToken, page_size: pageSize, page_token: pageToken } = req.query
        if (!spaceId) {
          return res.status(400).json({ error: 'Missing space_id parameter' })
        }

        let queryParams = `?page_size=${pageSize || 50}`
        if (parentNodeToken) queryParams += `&parent_node_token=${parentNodeToken}`
        if (pageToken) queryParams += `&page_token=${pageToken}`

        result = await feishuProxy(`/wiki/v2/spaces/${spaceId}/nodes${queryParams}`)
        break
      }

      case 'wiki_node_info': {
        const { node_token: nodeToken } = req.query
        if (!nodeToken) {
          return res.status(400).json({ error: 'Missing node_token parameter' })
        }
        result = await feishuProxy(`/wiki/v2/spaces/get_node?token=${nodeToken}`)
        break
      }

      case 'wiki_nodes': {
        const { space_id: spaceId } = req.query
        if (!spaceId) {
          return res.status(400).json({ error: 'Missing space_id parameter' })
        }
        result = await feishuProxy(`/wiki/v2/spaces/${spaceId}/nodes`)
        break
      }

      case 'wiki_root':
        result = await getWikiRoot()
        break

      case 'wiki_meta':
        result = await getWikiMeta()
        break

      case 'image': {
        const { token: imageToken } = req.query
        if (!imageToken) {
          return res.status(400).json({ error: 'Missing token parameter' })
        }

        const feishuToken = await getTenantAccessToken()
        const imageResponse = await fetch(`https://open.feishu.cn/open-apis/drive/v1/medias/${imageToken}/binary`, {
          headers: { Authorization: `Bearer ${feishuToken}` }
        })

        if (!imageResponse.ok) {
          return res.status(502).json({ error: 'Failed to fetch image' })
        }

        const contentType = imageResponse.headers.get('content-type') || 'image/png'
        const buffer = Buffer.from(await imageResponse.arrayBuffer())
        res.setHeader('Content-Type', contentType)
        res.setHeader('Cache-Control', 'public, max-age=86400')
        res.setHeader('Access-Control-Allow-Origin', 'https://cncg.me')
        return res.status(200).send(buffer)
      }

      default:
        return res.status(400).json({
          error: 'Invalid action parameter',
          valid_actions: ['documents', 'blog_meta', 'token', 'document', 'document_content', 'wiki_space_list', 'wiki_space_nodes', 'wiki_node_info', 'wiki_nodes', 'wiki_root', 'wiki_meta', 'image']
        })
    }

    setCorsHeaders(req, res)
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    return res.status(200).json({ code: 0, data: result })
  } catch (err) {
    console.error('Feishu API proxy error:', err)
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
