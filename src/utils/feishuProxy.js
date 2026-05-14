const API_BASE = '/api/feishu'

export async function feishuProxy(action, params = {}) {
  const query = new URLSearchParams({ action })

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      query.set(key, value)
    }
  }

  const url = `${API_BASE}?${query.toString()}`

  const response = await fetch(url)

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }))
    throw new Error(err.error || `飞书API请求失败: ${response.status}`)
  }

  return response.json()
}

export async function getWikiNodes(spaceId) {
  const result = await feishuProxy('wiki_nodes', { space_id: spaceId })
  return result.data?.data?.items || result.data?.items || []
}

export async function getDocument(documentId) {
  const result = await feishuProxy('document', { doc_id: documentId })
  return result.data?.data || result.data || {}
}

export async function getDocumentContent(documentId) {
  const result = await feishuProxy('document_content', { doc_id: documentId })
  return result.data?.data || result.data || {}
}

export async function getDocumentsList(folderToken) {
  const params = {}
  if (folderToken) params.folder_token = folderToken
  const result = await feishuProxy('documents', params)
  return result.data?.data?.files || result.data?.files || []
}

export function extractTextFromBlock(block) {
  if (!block) return ''

  const { block_type, text } = block

  switch (block_type) {
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
      return text?.elements?.map(el => el.text_run?.content || '').join('') || ''
    default:
      return ''
  }
}

export function formatDocumentDate(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}