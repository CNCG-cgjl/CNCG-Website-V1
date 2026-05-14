<template>
  <div class="feishu-doc-viewer">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <button @click="retry" class="retry-btn">重试</button>
    </div>

    <div v-else class="doc-content">
      <FeishuRenderer :blocks="blocks" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import FeishuRenderer from '@/components/FeishuRenderer.vue'
import { feishuProxy } from '@/utils/feishuProxy'

const props = defineProps({
  docId: {
    type: String,
    required: true
  }
})

const loading = ref(false)
const error = ref(null)
const blocks = ref([])

const loadDocument = async () => {
  loading.value = true
  error.value = null

  try {
    const data = await feishuProxy('document_content', { doc_id: props.docId })
    blocks.value = data.data?.items || data.items || []
  } catch (err) {
    error.value = err.message || '加载文档失败'
    console.error('加载文档失败:', err)
  } finally {
    loading.value = false
  }
}

const retry = () => {
  loadDocument()
}

onMounted(() => {
  loadDocument()
})

watch(() => props.docId, () => {
  loadDocument()
})
</script>

<style scoped>
.feishu-doc-viewer {
  max-width: 56rem;
  margin: 0 auto;
  padding: 1.5rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: #6b7280;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 4px solid #3b82f6;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

.error-state {
  text-align: center;
  padding: 3rem 0;
}

.error-message {
  color: #ef4444;
  margin-bottom: 1rem;
}

.retry-btn {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.retry-btn:hover { background: #2563eb; }

.doc-content {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 2rem;
}
</style>