<template>
  <main class="blog-page">
    <!-- 页面标题区 -->
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title fade-in-up">博客文章</h1>
        <div class="title-underline"></div>
        <p class="page-subtitle fade-in-up" style="animation-delay:0.1s">
          深度技术文章，行业观察与开发心得
        </p>
        <a
          :href="editorUrl"
          target="_blank"
          rel="noopener"
          class="create-btn fade-in-up"
          style="animation-delay:0.15s"
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

    <!-- 标签过滤 -->
    <section class="filter-section">
      <div class="container">
        <div class="filter-tabs fade-in-up" style="animation-delay:0.15s">
          <button class="filter-tab" :class="{ active: activeTag === 'ALL' }" @click="activeTag = 'ALL'">全部</button>
          <button v-for="tag in allTags" :key="tag" class="filter-tab"
                  :class="{ active: activeTag === tag }" @click="activeTag = tag">{{ tag }}</button>
        </div>
      </div>
    </section>

    <!-- 文章列表 -->
    <section class="section blog-section">
      <div class="container">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <div class="error-icon">⚠️</div>
          <p>{{ error }}</p>
          <button class="retry-btn" @click="loadPosts">重试</button>
        </div>

        <div v-else-if="filteredPosts.length === 0" class="empty-state">
          <span class="coming-soon-badge coming-soon-green">COMING SOON</span>
          <div class="empty-glow-bg empty-glow-bg-green"></div>
          <div class="empty-icon float" style="animation-delay:0.5s">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
          <p class="empty-title">博客内容加载中</p>
          <p class="empty-desc">点击上方「飞书编辑」在飞书中创建文章</p>
        </div>

        <div v-else class="blog-grid" ref="postsRef">
          <div
            class="blog-card"
            v-for="post in filteredPosts"
            :key="post.id"
            @click="openPost(post)"
          >
            <div class="blog-cover" :style="{ background: post.color || 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.05)' }">
              <span class="blog-cover-icon" v-html="post.icon || defaultIcon"></span>
            </div>
            <div class="blog-body">
              <div class="blog-meta">
                <span class="blog-tag">{{ post.tag }}</span>
                <span class="blog-date">{{ post.date }}</span>
              </div>
              <h3 class="blog-title">{{ post.title }}</h3>
              <p class="blog-excerpt">{{ post.excerpt }}</p>
              <div class="blog-footer">
                <span class="blog-read-time">{{ post.readTime }} 分钟阅读</span>
                <span class="blog-arrow">&rarr;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 文章详情弹窗 -->
    <transition name="fade">
      <div v-if="selectedPost" class="post-modal" @click.self="closePost">
        <div class="modal-content">
          <button class="modal-close" @click="closePost">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <div class="modal-header">
            <h2 class="modal-title">{{ selectedPost.title }}</h2>
            <div class="modal-meta">
              <span>{{ selectedPost.date }}</span>
              <span class="blog-tag">{{ selectedPost.tag }}</span>
              <span>{{ selectedPost.readTime }} 分钟阅读</span>
            </div>
          </div>

          <div class="modal-body" v-if="selectedPost.loading">
            <div class="spinner"></div>
            <p>加载内容中...</p>
          </div>

          <div class="modal-body" v-else>
            <FeishuRenderer :blocks="selectedPost.blocks || []" />
          </div>

          <div class="modal-footer">
            <a :href="selectedPost.editUrl" target="_blank" rel="noopener" class="edit-btn">
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
import { ref, computed, onMounted } from 'vue'
import FeishuRenderer from '@/components/FeishuRenderer.vue'
import { getWikiNodes, getDocument, getDocumentContent } from '@/utils/feishuProxy.js'

const loading = ref(false)
const error = ref('')
const posts = ref([])
const selectedPost = ref(null)
const activeTag = ref('ALL')
const postsRef = ref(null)

const editorUrl = ref('')
const folderId = import.meta.env.VITE_FEISHU_BLOG_FOLDER_ID

const defaultIcon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>'

onMounted(() => {
  if (folderId) {
    loadPosts()
  } else {
    error.value = '请配置飞书博客文件夹 ID'
    posts.value = []
  }

  if (folderId) {
    editorUrl.value = `https://feishu.cn/docx/${folderId}`
  }
})

const allTags = computed(() => [...new Set(posts.value.map(p => p.tag))])

const filteredPosts = computed(() => {
  if (activeTag.value === 'ALL') return posts.value
  return posts.value.filter(p => p.tag === activeTag.value)
})

async function loadPosts() {
  loading.value = true
  error.value = ''

  try {
    const nodes = await getWikiNodes(folderId)

    posts.value = nodes
      .filter(node => node.doc_docx && node.doc_docx.doc_id)
      .map(node => ({
        id: node.doc_docx.doc_id,
        title: node.title || '未命名文章',
        date: formatDate(node.time),
        excerpt: '点击查看完整内容...',
        tag: '技术',
        readTime: 5,
        color: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.05)',
        editUrl: `https://feishu.cn/docx/${node.doc_docx.doc_id}`
      }))
  } catch (err) {
    console.error('加载文章失败:', err)
    error.value = '加载失败，请检查飞书配置'
    posts.value = []
  } finally {
    loading.value = false
  }
}

async function openPost(post) {
  post.loading = true
  selectedPost.value = post

  try {
    const doc = await getDocument(post.id)
    const content = await getDocumentContent(post.id)

    selectedPost.value = {
      ...post,
      title: doc.title || post.title,
      blocks: content.items || [],
      loading: false
    }
  } catch (err) {
    console.error('加载文章详情失败:', err)
    selectedPost.value = {
      ...post,
      excerpt: '加载失败，请直接在飞书中查看',
      loading: false
    }
  }
}

function closePost() {
  selectedPost.value = null
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
.blog-page { padding-top: 64px; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 var(--space-6); }
.section { padding: var(--space-20) 0; }
.fade-in-up { animation: fadeInUp 0.5s var(--ease-out) both; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

.page-hero { text-align: center; padding-top: calc(64px + 2rem); padding-bottom: 2rem; background: var(--bg-secondary); }
.page-title { font-size: clamp(1.75rem, 3vw, 2.25rem); font-weight: 700; letter-spacing: var(--letter-tight); color: var(--text-primary); margin-bottom: 0.75rem; }
.title-underline { width: 48px; height: 3px; background: var(--gradient-primary); border-radius: 2px; margin: 0 auto 1rem; transform: scaleX(0); animation: ulSlideIn 0.5s var(--ease-out) 0.15s forwards; }
@keyframes ulSlideIn { to { transform: scaleX(1); } }
.page-subtitle { font-size: 1rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto 1.5rem; }

.create-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: var(--accent); color: white; border-radius: var(--radius-lg); font-weight: 600; text-decoration: none; transition: all var(--duration-normal) ease; }
.create-btn:hover { background: var(--accent-hover); transform: translateY(-2px); box-shadow: var(--glow-accent-soft); }

.filter-section { padding: 0 0 var(--space-8); }
.filter-tabs { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem; justify-content: center; }
.filter-tab { padding: 0.35rem 1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-full); font-size: 0.8rem; color: var(--text-secondary); cursor: pointer; transition: all 0.3s ease; }
.filter-tab:hover { border-color: var(--accent); color: var(--accent); }
.filter-tab.active { background: var(--accent); border-color: var(--accent); color: white; }

.loading-state, .error-state { text-align: center; padding: 4rem 2rem; color: var(--text-secondary); }
.spinner { width: 32px; height: 32px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; margin: 0 auto 1rem; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.error-icon { font-size: 3rem; margin-bottom: 1rem; }
.retry-btn { margin-top: 1rem; padding: 0.5rem 1.5rem; background: var(--accent); color: white; border: none; border-radius: var(--radius-md); cursor: pointer; }

.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem 1.5rem; background: var(--bg-card); border: 1px dashed var(--border); border-radius: var(--radius-xl); text-align: center; gap: 0.625rem; position: relative; overflow: hidden; max-width: 560px; margin: 0 auto; }
.coming-soon-badge { position: absolute; top: 18px; right: -26px; padding: 0.2rem 2rem; background: linear-gradient(135deg, #22c55e, #16a34a); color: white; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; transform: rotate(45deg); z-index: 1; line-height: 1.4; }
.empty-glow-bg { position: absolute; width: 200px; height: 200px; border-radius: 50%; pointer-events: none; animation: glowPulse 4s ease-in-out infinite; }
.empty-glow-bg-green { background: radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%); }
@keyframes glowPulse { 0%,100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 1; transform: scale(1.15); } }
.empty-icon { width: 64px; height: 64px; border-radius: var(--radius-lg); background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; }
.empty-title { font-size: 0.9375rem; font-weight: 600; color: var(--text-primary); position: relative; z-index: 1; }
.empty-desc { font-size: 0.8125rem; color: var(--text-muted); line-height: 1.6; position: relative; z-index: 1; }

.blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.25rem; }
.blog-card { display: flex; flex-direction: column; position: relative; overflow: hidden; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-xl); cursor: pointer; transition: all var(--duration-slow) var(--ease-out); }
.blog-card:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: var(--shadow-card-hover); }
.blog-cover { height: 140px; display: flex; align-items: center; justify-content: center; color: var(--accent); transition: all var(--duration-slow) var(--ease-bounce); }
.blog-card:hover .blog-cover { transform: scale(1.03); }
.blog-cover-icon { width: 28px; height: 28px; }
.blog-body { padding: 1.25rem 1.25rem 1rem; flex: 1; display: flex; flex-direction: column; }
.blog-meta { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
.blog-tag { font-size: 0.7rem; padding: 0.15rem 0.5rem; background: var(--bg-secondary); border-radius: var(--radius-full); color: var(--accent); }
.blog-date { font-size: 0.75rem; color: var(--text-muted); }
.blog-title { font-size: 1.05rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem; line-height: 1.4; }
.blog-excerpt { font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 0.75rem; flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.blog-footer { display: flex; align-items: center; justify-content: space-between; }
.blog-read-time { font-size: 0.75rem; color: var(--text-muted); }
.blog-arrow { color: var(--text-muted); transition: all var(--duration-normal) ease; font-size: 1rem; }
.blog-card:hover .blog-arrow { color: var(--accent); transform: translateX(3px); }

/* Modal */
.post-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
.modal-content { background: var(--bg-card); border-radius: var(--radius-xl); max-width: 900px; width: 100%; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; position: relative; }
.modal-close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 0.5rem; border-radius: var(--radius-md); transition: all 0.2s; }
.modal-close:hover { background: var(--bg-secondary); color: var(--text-primary); }
.modal-header { padding: 1.5rem 2rem; border-bottom: 1px solid var(--border); }
.modal-title { font-size: 1.25rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem; }
.modal-meta { display: flex; align-items: center; gap: 1rem; font-size: 0.85rem; color: var(--text-muted); }
.modal-body { flex: 1; padding: 1.5rem 2rem; overflow-y: auto; }
.modal-footer { padding: 1rem 2rem; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; }
.edit-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--bg-secondary); color: var(--text-secondary); border-radius: var(--radius-md); font-size: 0.85rem; text-decoration: none; transition: all 0.2s; }
.edit-btn:hover { background: var(--accent); color: white; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .page-hero { padding-top: calc(64px + 1.5rem); }
  .section { padding: var(--space-12) 0; }
  .blog-grid { grid-template-columns: 1fr; gap: 1rem; }
  .empty-state, .loading-state, .error-state { padding: 2rem 1rem; }
  .modal-header, .modal-body, .modal-footer { padding: 1rem; }
  .post-modal { padding: 1rem; }
}
</style>
