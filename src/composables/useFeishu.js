import { ref, computed } from 'vue'
import { feishuProxy, getDocument, getDocumentContent, getDocumentsList, getWikiRoot } from '@/utils/feishuProxy'

export function useFeishu() {
  const loading = ref(false)
  const error = ref(null)

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

  const fetchWikiRoot = async () => {
    loading.value = true
    error.value = null

    try {
      return await getWikiRoot()
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
    fetchDocuments,
    fetchDocumentContent,
    fetchWikiRoot
  }
}