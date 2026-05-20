import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis'
const DOC_ID_REGEX = /^[a-zA-Z0-9]{10,30}$/

let cachedToken = null
let tokenExpiry = 0

async function getTenantAccessToken(env) {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken
  }

  const appId = env.FEISHU_APP_ID
  const appSecret = env.FEISHU_APP_SECRET
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

async function feishuApiRequest(path, env) {
  const token = await getTenantAccessToken(env)
  const response = await fetch(`${FEISHU_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` }
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
  return elements.map(element => element.text_run?.content || '').join('')
}

function createJsonResponder(res) {
  res.status = function status(code) {
    res.statusCode = code
    return res
  }

  res.json = function json(payload) {
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json')
    }
    res.end(JSON.stringify(payload))
    return res
  }

  return res
}

async function readRequestBody(req) {
  return await new Promise((resolve, reject) => {
    let raw = ''

    req.on('data', (chunk) => {
      raw += chunk
    })

    req.on('end', () => {
      if (!raw) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(raw))
      } catch {
        reject(new Error('Invalid JSON body'))
      }
    })

    req.on('error', reject)
  })
}

function localApiDevPlugin() {
  return {
    name: 'local-api-dev-adapter',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/') || req.url.startsWith('/api/feishu')) {
          return next()
        }

        const url = new URL(req.url, 'http://localhost')
        const route = url.pathname
        const handlers = {
          '/api/contact': () => import('./api/contact.js'),
          '/api/guestbook': () => import('./api/guestbook.js')
        }

        const loadHandler = handlers[route]
        if (!loadHandler) {
          return next()
        }

        createJsonResponder(res)

        try {
          req.query = Object.fromEntries(url.searchParams.entries())
          req.body = ['POST', 'PUT', 'PATCH'].includes(req.method || '')
            ? await readRequestBody(req)
            : {}

          const mod = await loadHandler()
          await mod.default(req, res)

          if (!res.writableEnded) {
            res.end()
          }
        } catch (err) {
          console.error('Local API dev adapter error:', err)

          if (!res.writableEnded) {
            res.statusCode = err.message === 'Invalid JSON body' ? 400 : 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err.message || 'Internal server error' }))
          }
        }
      })
    }
  }
}

function feishuDevServerPlugin(env) {
  return {
    name: 'feishu-dev-proxy',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/feishu')) return next()

        const url = new URL(req.url, 'http://localhost')
        const action = url.searchParams.get('action')

        if (!action) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Missing action parameter' }))
          return
        }

        try {
          let result

          switch (action) {
            case 'documents': {
              const folderToken = url.searchParams.get('folder_token') || env.FEISHU_BLOG_FOLDER_ID
              const queryParam = folderToken ? `?folder_token=${folderToken}` : ''
              result = await feishuApiRequest(`/drive/v1/files${queryParam}`, env)
              break
            }

            case 'blog_meta': {
              const folderToken = env.FEISHU_BLOG_FOLDER_ID || ''
              result = {
                configured: !!folderToken,
                editor_url: folderToken ? `https://rcn17b9k6gos.feishu.cn/docx/${folderToken}` : ''
              }
              break
            }

            case 'token': {
              await getTenantAccessToken(env)
              result = {
                configured: true,
                auth_ok: true
              }
              break
            }

            case 'document': {
              const docId = url.searchParams.get('doc_id')
              if (!docId || !DOC_ID_REGEX.test(docId)) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Invalid doc_id parameter' }))
                return
              }
              result = await feishuApiRequest(`/docx/v1/documents/${docId}`, env)
              break
            }

            case 'document_content': {
              const docId = url.searchParams.get('doc_id')
              if (!docId || !DOC_ID_REGEX.test(docId)) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Invalid doc_id parameter' }))
                return
              }
              result = await feishuApiRequest(`/docx/v1/documents/${docId}/blocks`, env)
              break
            }

            case 'wiki_space_list':
              result = await feishuApiRequest('/wiki/v2/spaces?page_size=20', env)
              break

            case 'wiki_space_nodes': {
              const spaceId = url.searchParams.get('space_id')
              if (!spaceId) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Missing space_id parameter' }))
                return
              }

              let queryParams = `?page_size=${url.searchParams.get('page_size') || 50}`
              const parentNodeToken = url.searchParams.get('parent_node_token')
              const pageToken = url.searchParams.get('page_token')
              if (parentNodeToken) queryParams += `&parent_node_token=${parentNodeToken}`
              if (pageToken) queryParams += `&page_token=${pageToken}`

              result = await feishuApiRequest(`/wiki/v2/spaces/${spaceId}/nodes${queryParams}`, env)
              break
            }

            case 'wiki_node_info': {
              const nodeToken = url.searchParams.get('node_token')
              if (!nodeToken) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Missing node_token parameter' }))
                return
              }
              result = await feishuApiRequest(`/wiki/v2/spaces/get_node?token=${nodeToken}`, env)
              break
            }

            case 'wiki_nodes': {
              const spaceId = url.searchParams.get('space_id')
              if (!spaceId) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Missing space_id parameter' }))
                return
              }
              result = await feishuApiRequest(`/wiki/v2/spaces/${spaceId}/nodes`, env)
              break
            }

            case 'wiki_root': {
              const wikiToken = env.FEISHU_WIKI_TOKEN
              if (!wikiToken) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'FEISHU_WIKI_TOKEN is not configured' }))
                return
              }

              const docData = await feishuApiRequest(`/docx/v1/documents/${wikiToken}`, env)
              const blocksData = await feishuApiRequest(`/docx/v1/documents/${wikiToken}/blocks?page_size=50`, env)
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

              result = {
                title: docData.data?.document?.title || 'Knowledge Base',
                document_id: wikiToken,
                children: childDocs
              }
              break
            }

            case 'wiki_meta': {
              const wikiToken = env.FEISHU_WIKI_TOKEN
              if (!wikiToken) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'FEISHU_WIKI_TOKEN is not configured' }))
                return
              }

              const nodeInfo = await feishuApiRequest(`/wiki/v2/spaces/get_node?token=${wikiToken}`, env)
              result = {
                wiki_token: wikiToken,
                space_id: nodeInfo.data?.node?.space_id || ''
              }
              break
            }

            case 'image': {
              const imageToken = url.searchParams.get('token')
              if (!imageToken) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Missing token parameter' }))
                return
              }

              const feishuToken = await getTenantAccessToken(env)
              const imageResponse = await fetch(`https://open.feishu.cn/open-apis/drive/v1/medias/${imageToken}/binary`, {
                headers: { Authorization: `Bearer ${feishuToken}` }
              })

              if (!imageResponse.ok) {
                res.statusCode = 502
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Failed to fetch image' }))
                return
              }

              const contentType = imageResponse.headers.get('content-type') || 'image/png'
              const buffer = Buffer.from(await imageResponse.arrayBuffer())
              res.statusCode = 200
              res.setHeader('Content-Type', contentType)
              res.setHeader('Cache-Control', 'public, max-age=86400')
              res.end(buffer)
              return
            }

            default:
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Invalid action parameter' }))
              return
          }

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ code: 0, data: result }))
        } catch (err) {
          console.error('Feishu dev proxy error:', err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err.message || 'Internal server error' }))
        }
      })
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [
      vue(),
      tailwindcss(),
      localApiDevPlugin(),
      feishuDevServerPlugin(env)
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
