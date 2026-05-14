<template>
  <div class="feishu-test-page">
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-4xl font-bold mb-8 text-center">飞书集成测试页面</h1>

      <div class="max-w-4xl mx-auto">
        <div class="card mb-6">
          <h2 class="text-2xl font-semibold mb-4">1. 连接状态</h2>

          <div v-if="connectionStatus === 'checking'" class="flex items-center text-blue-500">
            <div class="loading-spinner mr-3"></div>
            <span>正在检查连接...</span>
          </div>

          <div v-else-if="connectionStatus === 'success'" class="text-green-500 flex items-center">
            <span class="text-2xl mr-2">✓</span>
            <span>连接成功！</span>
          </div>

          <div v-else-if="connectionStatus === 'error'" class="text-red-500">
            <p class="mb-2">连接失败</p>
            <p class="text-sm">{{ errorMessage }}</p>
          </div>

          <button @click="testConnection" class="btn-primary mt-4">
            测试连接
          </button>
        </div>

        <div v-if="connectionStatus === 'success'" class="card mb-6">
          <h2 class="text-2xl font-semibold mb-4">2. 获取文档内容</h2>

          <div class="mb-4">
            <label class="block mb-2 font-medium">文档 Token</label>
            <input
              v-model="docToken"
              type="text"
              placeholder="输入文档 Token"
              class="input-field"
            />
          </div>

          <button @click="fetchDocContent" class="btn-primary" :disabled="loading">
            {{ loading ? '加载中...' : '获取文档内容' }}
          </button>

          <div v-if="documentBlocks.length" class="mt-6">
            <h3 class="text-xl font-medium mb-3">{{ documentTitle }}</h3>
            <div class="doc-preview">
              <FeishuRenderer :blocks="documentBlocks" />
            </div>
          </div>
        </div>

        <div class="card bg-blue-50 border-blue-200">
          <h2 class="text-2xl font-semibold mb-4">配置说明</h2>

          <div class="space-y-4 text-sm">
            <div>
              <h3 class="font-medium mb-2">环境变量配置</h3>
              <p class="text-gray-600">飞书凭证已通过后端代理安全配置，无需在前端暴露。</p>
              <p class="text-gray-600 mt-1">请在 Vercel 环境变量中设置：</p>
              <code class="block bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
FEISHU_APP_ID=你的App ID<br>
FEISHU_APP_SECRET=你的App Secret
              </code>
            </div>

            <div>
              <h3 class="font-medium mb-2">权限配置</h3>
              <p class="text-gray-600">在飞书开放平台确保开通了以下权限：</p>
              <ul class="list-disc list-inside mt-2 text-gray-600">
                <li>docx:document:readonly - 文档只读</li>
                <li>docx:document.meta:readonly - 文档元信息</li>
                <li>drive:file:readonly - 文件只读</li>
                <li>wiki:space:readonly - 知识库只读</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FeishuRenderer from '@/components/FeishuRenderer.vue'
import { feishuProxy } from '@/utils/feishuProxy'

const connectionStatus = ref('idle')
const errorMessage = ref('')
const docToken = ref('')
const documentTitle = ref('')
const documentBlocks = ref([])
const loading = ref(false)

const testConnection = async () => {
  connectionStatus.value = 'checking'
  errorMessage.value = ''

  try {
    await feishuProxy('token')
    connectionStatus.value = 'success'
  } catch (err) {
    connectionStatus.value = 'error'
    errorMessage.value = err.message
  }
}

const fetchDocContent = async () => {
  if (!docToken.value) {
    alert('请输入文档 Token')
    return
  }

  loading.value = true

  try {
    const docResult = await feishuProxy('document', { doc_id: docToken.value })
    const contentResult = await feishuProxy('document_content', { doc_id: docToken.value })

    documentTitle.value = docResult.data?.data?.document?.title || '未命名文档'
    documentBlocks.value = contentResult.data?.data?.items || []
  } catch (err) {
    alert('获取文档失败: ' + err.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  testConnection()
})
</script>

<style scoped>
.feishu-test-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f9fafb, #ffffff);
}

.card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 1.5rem;
}

.btn-primary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-primary:hover { background: #2563eb; }
.btn-primary:disabled { background: #9ca3af; cursor: not-allowed; }

.input-field {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
}

.loading-spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #3b82f6;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.doc-preview {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  max-height: 24rem;
  overflow-y: auto;
}
</style>