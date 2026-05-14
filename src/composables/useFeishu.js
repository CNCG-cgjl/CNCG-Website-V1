import { ref, computed } from 'vue'
import { feishuProxy, getWikiNodes, getDocument, getDocumentContent, getDocumentsList } from '@/utils/feishuProxy'

export function useFeishu() {
  const loading = ref(false)
  const error = ref(null)

  const getAccessToken = async () => {
    try {
      const result = await feishuProxy('token')
      return result.data?.token || ''
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const fetchDocuments = async (folderToken = '') => {
    loading.value = true
    error.value = null

    try {
      return await getDocumentsList(folderToken)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchDocumentContent = async (docToken) => {
    loading.value = true
    error.value = null

    try {
      return await getDocumentContent(docToken)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchKnowledgeBase = async (spaceId) => {
    loading.value = true
    error.value = null

    try {
      return await getWikiNodes(spaceId)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    getAccessToken,
    fetchDocuments,
    fetchDocumentContent,
    fetchKnowledgeBase
  }
}