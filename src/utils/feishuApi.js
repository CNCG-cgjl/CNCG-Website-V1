import axios from 'axios'

const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis'

let cachedToken = null
let tokenExpiry = 0

export async function getTenantAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken
  }

  const appId = import.meta.env.VITE_FEISHU_APP_ID
  const appSecret = import.meta.env.VITE_FEISHU_APP_SECRET

  if (!appId || !appSecret) {
    throw new Error('飞书应用凭证未配置')
  }

  try {
    const response = await axios.post(`${FEISHU_API_BASE}/auth/v3/tenant_access_token/internal`, {
      app_id: appId,
      app_secret: appSecret
    })

    if (response.data.code === 0) {
      cachedToken = response.data.tenant_access_token
      tokenExpiry = Date.now() + (response.data.expire - 60) * 1000
      return cachedToken
    } else {
      throw new Error(response.data.msg || '获取Token失败')
    }
  } catch (error) {
    console.error('飞书API错误:', error)
    throw error
  }
}

export async function getDocumentsList(folderToken) {
  const token = await getTenantAccessToken()

  try {
    const response = await axios.get(`${FEISHU_API_BASE}/drive/v1/files`, {
      params: { folder_token: folderToken },
      headers: { Authorization: `Bearer ${token}` }
    })

    if (response.data.code === 0) {
      return response.data.data.files || []
    } else {
      throw new Error(response.data.msg || '获取文档列表失败')
    }
  } catch (error) {
    console.error('获取文档列表失败:', error)
    throw error
  }
}

export async function getWikiNodes(spaceId) {
  const token = await getTenantAccessToken()

  try {
    const response = await axios.get(`${FEISHU_API_BASE}/wiki/v2/spaces/${spaceId}/nodes`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (response.data.code === 0) {
      return response.data.data.items || []
    } else {
      throw new Error(response.data.msg || '获取知识库节点失败')
    }
  } catch (error) {
    console.error('获取知识库节点失败:', error)
    throw error
  }
}

export async function getDocument(documentId) {
  const token = await getTenantAccessToken()

  try {
    const response = await axios.get(`${FEISHU_API_BASE}/docx/v1/documents/${documentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (response.data.code === 0) {
      return response.data.data
    } else {
      throw new Error(response.data.msg || '获取文档失败')
    }
  } catch (error) {
    console.error('获取文档失败:', error)
    throw error
  }
}

export async function getDocumentContent(documentId) {
  const token = await getTenantAccessToken()

  try {
    const response = await axios.get(`${FEISHU_API_BASE}/docx/v1/documents/${documentId}/blocks`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (response.data.code === 0) {
      return response.data.data
    } else {
      throw new Error(response.data.msg || '获取文档内容失败')
    }
  } catch (error) {
    console.error('获取文档内容失败:', error)
    throw error
  }
}

export function extractTextFromBlock(block) {
  if (!block) return ''

  const { block_type, text } = block

  switch (block_type) {
    case 2:
      return text?.elements?.map(el => el.text_run?.content || '').join('') || ''
    case 3:
      return text?.elements?.map(el => el.text_run?.content || '').join('') || ''
    case 4:
      return text?.elements?.map(el => el.text_run?.content || '').join('') || ''
    case 5:
      return text?.elements?.map(el => el.text_run?.content || '').join('') || ''
    case 6:
      return text?.elements?.map(el => el.text_run?.content || '').join('') || ''
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
