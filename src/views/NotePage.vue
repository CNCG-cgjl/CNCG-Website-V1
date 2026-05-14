<template>
  <main class="note-page">
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title fade-in-up">📝 笔记</h1>
        <div class="title-underline"></div>
        <p class="page-subtitle fade-in-up" style="animation-delay:0.1s">
          碎片化记录，知识的积累从这里开始
        </p>
        <a
          :href="editorUrl"
          target="_blank"
          rel="noopener"
          class="create-btn fade-in-up"
          style="animation-delay:0.2s"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          飞书编辑
        </a>
      </div>
    </section>

    <section class="section notes-section">
      <div class="container">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <div class="error-icon">⚠️</div>
          <p>{{ error }}</p>
          <button class="retry-btn" @click="loadNotes">重试</button>
        </div>

        <div v-else class="notes-grid">
          <div
            class="note-card"
            v-for="note in notes"
            :key="note.id"
            @click="openNote(note)"
          >
            <div class="note-date">{{ note.date }}</div>
            <h3 class="note-title">{{ note.title }}</h3>
            <p class="note-excerpt">{{ note.excerpt }}</p>
            <div class="note-tags" v-if="note.tags && note.tags.length">
              <span class="tag" v-for="tag in note.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </div>

        <div v-if="!loading && !error && notes.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>还没有笔记</h3>
          <p>点击上方「飞书编辑」在飞书中创建笔记</p>
        </div>
      </div>
    </section>

    <!-- 笔记详情弹窗 -->
    <transition name="fade">
      <div v-if="selectedNote" class="note-modal" @click.self="closeNote">
        <div class="modal-content">
          <button class="modal-close" @click="closeNote">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <div class="modal-header">
            <h2 class="modal-title">{{ selectedNote.title }}</h2>
            <div class="modal-meta">
              <span>{{ selectedNote.date }}</span>
              <div class="note-tags" v-if="selectedNote.tags && selectedNote.tags.length">
                <span class="tag" v-for="tag in selectedNote.tags" :key="tag">{{ tag }}</span>
              </div>
            </div>
          </div>

          <div class="modal-body" v-if="selectedNote.loading">
            <div class="spinner"></div>
            <p>加载内容中...</p>
          </div>

          <div class="modal-body" v-else>
            <FeishuRenderer :blocks="selectedNote.blocks" />
          </div>

          <div class="modal-footer">
            <a :href="selectedNote.editUrl" target="_blank" rel="noopener" class="edit-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              在飞书中编辑
            </a>
          </div>
        </div>
      </div>
    </transition>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FeishuRenderer from '@/components/FeishuRenderer.vue'
import { getWikiNodes, getDocument, getDocumentContent } from '@/utils/feishuApi.js'

const loading = ref(false)
const error = ref('')
const notes = ref([])
const selectedNote = ref(null)

const editorUrl = ref('')

const folderId = import.meta.env.VITE_FEISHU_NOTE_FOLDER_ID

onMounted(() => {
  if (folderId) {
    loadNotes()
  } else {
    error.value = '请配置飞书笔记文件夹 ID'
    notes.value = []
  }

  if (folderId) {
    editorUrl.value = `https://feishu.cn/docx/${folderId}`
  }
})

async function loadNotes() {
  loading.value = true
  error.value = ''

  try {
    const nodes = await getWikiNodes(folderId)

    notes.value = nodes
      .filter(node => node.doc_docx && node.doc_docx.doc_id)
      .map(node => ({
        id: node.doc_docx.doc_id,
        title: node.title || '未命名笔记',
        date: formatDate(node.time),
        excerpt: '点击查看完整内容...',
        editUrl: `https://feishu.cn/docx/${node.doc_docx.doc_id}`
      }))
  } catch (err) {
    console.error('加载笔记失败:', err)
    error.value = '加载失败，请检查飞书配置'
    notes.value = []
  } finally {
    loading.value = false
  }
}

async function openNote(note) {
  note.loading = true
  selectedNote.value = note

  try {
    const doc = await getDocument(note.id)
    const content = await getDocumentContent(note.id)

    selectedNote.value = {
      ...note,
      title: doc.title || note.title,
      blocks: content.items || [],
      loading: false
    }
  } catch (err) {
    console.error('加载笔记详情失败:', err)
    selectedNote.value = {
      ...note,
      excerpt: '加载失败，请直接在飞书中查看',
      loading: false
    }
  }
}

function closeNote() {
  selectedNote.value = null
}

function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<style scoped>
.note-page {
  padding-top: 64px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.page-hero {
  text-align: center;
  padding: calc(64px + 3rem) 0 2rem;
  background: var(--bg-secondary);
}

.page-title {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 700;
  letter-spacing: var(--letter-tight);
  margin-bottom: 0.75rem;
}

.title-underline {
  width: 48px;
  height: 3px;
  background: var(--gradient-primary);
  border-radius: 2px;
  margin: 0 auto 1rem;
  transform: scaleX(0);
  animation: ulSlideIn 0.5s var(--ease-out) 0.1s forwards;
}

@keyframes ulSlideIn {
  to { transform: scaleX(1); }
}

.page-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  max-width: 480px;
  margin: 0 auto 1.5rem;
}

.create-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--accent);
  color: white;
  border-radius: var(--radius-lg);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--duration-normal) ease;
}

.create-btn:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: var(--glow-accent-soft);
}

.fade-in-up {
  animation: fadeInUp 0.5s var(--ease-out) both;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.section {
  padding: var(--space-20) 0;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.note-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  cursor: pointer;
  transition: all var(--duration-normal) ease;
}

.note-card:hover {
  border-color: var(--accent);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(6, 182, 212, 0.15);
}

.note-date {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.note-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.note-excerpt {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  color: var(--accent);
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

/* Modal */
.note-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.modal-close:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.modal-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.modal-body {
  flex: 1;
  padding: 1.5rem 2rem;
  overflow-y: auto;
}

.modal-footer {
  padding: 1rem 2rem;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
}

.edit-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  text-decoration: none;
  transition: all 0.2s;
}

.edit-btn:hover {
  background: var(--accent);
  color: white;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .page-hero {
    padding-top: calc(64px + 2rem);
  }

  .section {
    padding: var(--space-12) 0;
  }

  .notes-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .note-modal {
    padding: 1rem;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
}
</style>
