<template>
  <main class="blog-page">
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title fade-in-up">博客</h1>
        <div class="title-underline"></div>
        <p class="page-subtitle fade-in-up" style="animation-delay:0.1s">
          这里展示从飞书同步过来的文章、随笔和阶段性输出，适合对外阅读与归档。
        </p>
        <a
          v-if="editorUrl"
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
          在飞书中编辑博客
        </a>
      </div>
    </section>

    <section class="filter-section">
      <div class="container">
        <div class="filter-tabs fade-in-up" style="animation-delay:0.15s">
          <button class="filter-tab" :class="{ active: activeTag === 'ALL' }" @click="activeTag = 'ALL'">全部</button>
          <button
            v-for="tag in allTags"
            :key="tag"
            class="filter-tab"
            :class="{ active: activeTag === tag }"
            @click="activeTag = tag"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </section>

    <section class="section blog-section">
      <div class="container">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>正在加载博客内容...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <div class="error-icon">!</div>
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
          <p class="empty-title">博客内容还在同步中</p>
          <p class="empty-desc">可以先通过上方入口在飞书中创建或整理文章。</p>
        </div>

        <div v-else class="blog-grid">
          <div
            v-for="post in filteredPosts"
            :key="post.id"
            class="blog-card"
            @click="openPost(post)"
          >
            <div class="blog-cover" :style="{ background: post.color }">
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

          <div v-if="selectedPost.loading" class="modal-body">
            <div class="spinner"></div>
            <p>正在加载文章正文...</p>
          </div>

          <div v-else class="modal-body">
            <FeishuRenderer :blocks="selectedPost.blocks || []" />
          </div>

          <div class="modal-footer">
            <a :href="selectedPost.editUrl" target="_blank" rel="noopener" class="edit-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              在飞书中打开
            </a>
          </div>
        </div>
      </div>
    </transition>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import FeishuRenderer from '@/components/FeishuRenderer.vue'
import { getBlogMeta, getDocument, getDocumentContent, getDocumentsList } from '@/utils/feishuProxy.js'

const loading = ref(false)
const error = ref('')
const posts = ref([])
const selectedPost = ref(null)
const activeTag = ref('ALL')
const editorUrl = ref('')

const defaultIcon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>'

onMounted(() => {
  loadPosts()
})

const allTags = computed(() => [...new Set(posts.value.map(post => post.tag))])

const filteredPosts = computed(() => {
  if (activeTag.value === 'ALL') return posts.value
  return posts.value.filter(post => post.tag === activeTag.value)
})

async function loadPosts() {
  loading.value = true
  error.value = ''

  try {
    const meta = await getBlogMeta()
    editorUrl.value = meta.editor_url || ''

    if (!meta.configured) {
      error.value = '博客目录尚未在服务端配置。'
      posts.value = []
      return
    }

    const files = await getDocumentsList()
    posts.value = files
      .filter(file => file.type === 'docx' && (file.id || file.token))
      .map(file => ({
        id: file.id || file.token,
        title: file.name || file.title || '未命名文章',
        date: formatDate(file.modified_time || file.edit_time || file.time || file.created_time),
        excerpt: '点击查看完整内容。',
        tag: inferTag(file),
        readTime: 5,
        color: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.05))',
        editUrl: `https://rcn17b9k6gos.feishu.cn/docx/${file.id || file.token}`
      }))
  } catch (err) {
    console.error('Failed to load blog posts:', err)
    error.value = '无法加载博客内容，请检查服务端配置。'
    posts.value = []
  } finally {
    loading.value = false
  }
}

async function openPost(post) {
  selectedPost.value = {
    ...post,
    loading: true
  }

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
    console.error('Failed to load blog post details:', err)
    selectedPost.value = {
      ...post,
      excerpt: '正文加载失败，请前往飞书查看。',
      blocks: [],
      loading: false
    }
  }
}

function closePost() {
  selectedPost.value = null
}

function formatDate(value) {
  const date = value ? new Date(value) : null
  if (!date || Number.isNaN(date.getTime())) return '未标注日期'
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

function inferTag(file) {
  const source = `${file.name || ''} ${file.title || ''}`.toLowerCase()
  if (source.includes('vue')) return 'Vue'
  if (source.includes('feishu')) return '飞书'
  if (source.includes('note')) return '随笔'
  return '技术'
}
</script>

<style scoped>
.blog-page { padding-top: 64px; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 var(--space-6); }
.page-hero { text-align: center; padding: calc(64px + 3rem) 0 2rem; background: var(--bg-secondary); }
.page-title { font-size: clamp(1.75rem, 3vw, 2.25rem); font-weight: 700; margin-bottom: 0.75rem; }
.title-underline { width: 48px; height: 3px; background: var(--gradient-primary); border-radius: 2px; margin: 0 auto 1rem; transform: scaleX(0); animation: ulSlideIn 0.5s ease 0.1s forwards; }
@keyframes ulSlideIn { to { transform: scaleX(1); } }
.page-subtitle { font-size: 1rem; color: var(--text-secondary); max-width: 640px; margin: 0 auto 1.2rem; line-height: 1.7; }
.fade-in-up { animation: fadeInUp 0.5s ease both; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

.create-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.8rem 1.15rem;
  border-radius: 999px;
  text-decoration: none;
  color: white;
  background: var(--accent);
}

.filter-section { padding: 1rem 0 0; }
.filter-tabs { display: flex; gap: 0.6rem; flex-wrap: wrap; }
.filter-tab {
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-secondary);
  border-radius: 999px;
  padding: 0.55rem 0.95rem;
  cursor: pointer;
}
.filter-tab.active {
  color: white;
  background: var(--accent);
  border-color: var(--accent);
}

.section { padding: var(--space-16) 0; }
.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}
.blog-card {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--bg-card);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.blog-card:hover {
  transform: translateY(-3px);
  border-color: var(--accent);
  box-shadow: 0 10px 24px rgba(6, 182, 212, 0.12);
}
.blog-cover {
  height: 108px;
  display: grid;
  place-items: center;
}
.blog-cover-icon { color: var(--accent); }
.blog-body { padding: 1rem; }
.blog-meta,
.modal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}
.blog-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.16rem 0.55rem;
  border-radius: 999px;
  background: rgba(6, 182, 212, 0.1);
  color: var(--accent);
}
.blog-title { margin: 0.8rem 0 0.55rem; color: var(--text-primary); font-size: 1.08rem; }
.blog-excerpt { margin: 0; color: var(--text-secondary); line-height: 1.7; min-height: 3.4em; }
.blog-footer {
  margin-top: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--text-muted);
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}
.spinner { width: 32px; height: 32px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; margin: 0 auto 1rem; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.retry-btn { margin-top: 1rem; padding: 0.6rem 1.4rem; border: none; border-radius: 999px; background: var(--accent); color: white; cursor: pointer; }
.coming-soon-badge { display: inline-block; margin-bottom: 0.9rem; padding: 0.3rem 0.7rem; border-radius: 999px; background: rgba(34,197,94,0.1); color: #16a34a; font-size: 0.8rem; }
.empty-title { margin: 0.85rem 0 0.35rem; color: var(--text-primary); font-size: 1.2rem; }

.post-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.5);
}
.modal-content {
  width: min(900px, 100%);
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 18px;
  background: var(--bg-card);
}
.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 999px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
}
.modal-header, .modal-footer { padding: 1.2rem 1.4rem; border-bottom: 1px solid var(--border); }
.modal-footer { border-bottom: none; border-top: 1px solid var(--border); }
.modal-title { margin: 0 0 0.7rem; color: var(--text-primary); }
.modal-body { padding: 1.4rem; overflow-y: auto; }
.edit-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--accent);
  text-decoration: none;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 960px) {
  .blog-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 640px) {
  .section { padding: var(--space-12) 0; }
  .blog-grid { grid-template-columns: 1fr; }
  .post-modal { padding: 1rem; }
}
</style>
