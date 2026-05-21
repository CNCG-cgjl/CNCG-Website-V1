<template>
  <main class="doc-page">
    <section class="page-hero">
      <div class="container hero-inner">
        <p class="eyebrow fade-in-up">Knowledge Base V1</p>
        <h1 class="page-title fade-in-up">知识库</h1>
        <p class="page-subtitle fade-in-up" style="animation-delay: 0.08s">
          这里收录工具、资料、项目经验、副业记录、自由随笔和建站过程中的长期内容，支持站内阅读，也保留飞书原文入口。
        </p>

        <div class="hero-stats fade-in-up" style="animation-delay: 0.14s">
          <div class="stat-item">
            <span class="stat-value">{{ totalDocs }}</span>
            <span class="stat-label">篇内容</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ groups.length }}</span>
            <span class="stat-label">个分类</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ populatedGroups.length }}</span>
            <span class="stat-label">个分类已同步内容</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section docs-section">
      <div class="container docs-layout">
        <div class="category-rail">
          <div class="rail-card">
            <p class="rail-title">分类浏览</p>
            <p class="rail-summary">先看已同步内容，待补充的分类会统一收在下方卡片区。</p>
            <div class="rail-links">
              <button
                v-for="group in groups"
                :key="group.key"
                class="rail-link"
                type="button"
                :disabled="!group.items.length"
                @click="scrollToGroup(group.key)"
              >
                <span>{{ group.title }}</span>
                <span class="rail-count">{{ group.items.length }}</span>
              </button>
            </div>
          </div>

          <div class="feedback-card">
            <p class="feedback-eyebrow">Feedback</p>
            <h2 class="feedback-title">有建议想补充？</h2>
            <p class="feedback-desc">知识库的分类、排版和内容收录会持续优化，欢迎把阅读体验或想补充的话题直接告诉我。</p>
            <div class="feedback-actions">
              <RouterLink to="/contact" class="feedback-primary">
                联系反馈
              </RouterLink>
              <RouterLink to="/contact" class="feedback-secondary">飞书/留言反馈</RouterLink>
            </div>
            <p class="feedback-note">如果你更习惯一对一沟通，也可以从联系页直接留言。</p>
          </div>
        </div>

        <div class="docs-main">
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>正在加载知识库内容...</p>
          </div>

          <div v-else-if="error" class="error-state">
            <div class="error-icon">!</div>
            <h3 class="state-title">{{ errorTitle }}</h3>
            <p>{{ error }}</p>
            <button class="retry-btn" type="button" @click="loadDocs">重新加载</button>
          </div>

          <div v-else class="group-list">
            <section class="guide-panel">
              <div class="guide-header">
                <div>
                  <p class="panel-eyebrow">Collab Guide</p>
                  <h2 class="panel-title">协作编写入口 ✍️</h2>
                </div>
                <p class="panel-subtitle">如果你也想一起补充知识库内容，这里放一个简单入口。网页端先说明方向，具体规范和模板放在飞书里更方便维护。</p>
              </div>

              <div class="guide-grid">
                <article class="guide-card">
                  <h3 class="guide-card-title">📚 适合补什么内容</h3>
                  <ul class="guide-list">
                    <li>工具分享：某个工具怎么用、适合谁</li>
                    <li>资料整理：教程、入口、说明、参考资料</li>
                    <li>项目经验：过程、踩坑、解决办法</li>
                    <li>建站记录：更新、调整、上线记录</li>
                  </ul>
                </article>

                <article class="guide-card">
                  <h3 class="guide-card-title">🧩 写的时候记住这几点</h3>
                  <ul class="guide-list">
                    <li>一篇内容尽量只讲一个主题</li>
                    <li>先写清楚它在讲什么</li>
                    <li>能用列表就尽量别堆大段文字</li>
                    <li>写得清楚比写得正式更重要</li>
                  </ul>
                </article>
              </div>

              <article class="template-card collab-link-card">
                <div class="template-top">
                  <h3 class="template-title">🔗 去飞书查看协作规范 / 模板</h3>
                  <span class="template-chip">保持最新</span>
                </div>
                <p class="template-lines">网页端先保留轻量说明，具体的编写须知、模板示例和后续补充建议统一放在飞书文档里，方便多人一起维护。</p>
                <p class="permission-note">🔓 当前知识库内容已公开可见；协作入口会单独控制编辑权限。</p>
                <div class="guide-actions">
                  <a
                    :href="COLLAB_GUIDE_URL"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="guide-primary-link"
                  >
                    查看协作说明
                  </a>
                  <button type="button" class="guide-secondary-link" @click="openCollabLink">
                    进入协作入口
                  </button>
                </div>
              </article>
            </section>

            <section
              v-for="group in populatedGroups"
              :key="group.key"
              :id="`kb-${group.key}`"
              class="group-section"
            >
              <div class="group-header">
                <div>
                  <div class="group-badge">{{ group.shortLabel }}</div>
                  <h2 class="group-title">{{ group.title }}</h2>
                  <p class="group-desc">{{ group.description }}</p>
                </div>
                <div class="group-total">{{ group.items.length }} 篇</div>
              </div>

              <div v-if="group.items.length" class="doc-grid">
                <article
                  v-for="doc in group.items"
                  :key="doc.id"
                  class="doc-card"
                  @click="openDoc(doc)"
                >
                  <div class="doc-card-top">
                    <span class="doc-chip">{{ doc.typeName }}</span>
                    <span v-if="doc.updatedAt" class="doc-date">更新于 {{ doc.updatedAt }}</span>
                  </div>

                  <h3 class="doc-title">{{ doc.title }}</h3>
                  <p class="doc-summary">{{ doc.summary }}</p>

                  <div class="doc-footer">
                    <button class="doc-action" type="button">
                      站内阅读
                    </button>
                    <a
                      class="doc-link"
                      :href="doc.editUrl"
                      target="_blank"
                      rel="noopener"
                      @click.stop
                    >
                      飞书原文
                    </a>
                  </div>
                </article>
              </div>
            </section>

            <section v-if="emptyGroups.length" class="empty-groups-panel">
              <div class="panel-header">
                <div>
                  <p class="panel-eyebrow">Queued Categories</p>
                  <h2 class="panel-title">待补充的分类</h2>
                </div>
                <p class="panel-subtitle">先把结构立住，后续飞书里补上第一篇内容后，这里会自动亮起来。</p>
              </div>

              <div class="empty-groups-grid">
                <article
                  v-for="group in emptyGroups"
                  :key="group.key"
                  :id="`kb-${group.key}`"
                  class="empty-group-card"
                >
                  <div class="empty-group-top">
                    <span class="group-badge">{{ group.shortLabel }}</span>
                    <span class="empty-group-count">0 篇</span>
                  </div>
                  <h3 class="empty-group-title">{{ group.title }}</h3>
                  <p class="empty-group-desc">{{ group.description }}</p>
                  <div class="empty-group-tip">
                    <span class="group-empty-icon">{{ group.shortLabel.slice(0, 1) }}</span>
                    <span>等你在飞书里补上第一篇内容后，这里会自动同步展示。</span>
                  </div>
                </article>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>

    <transition name="fade">
      <div v-if="selectedDoc" class="doc-modal" @click.self="closeDoc">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-header-top">
              <div class="modal-meta">
                <span class="doc-chip">{{ selectedDoc.typeName }}</span>
                <span v-if="selectedDoc.updatedAt" class="modal-date">{{ selectedDoc.updatedAt }}</span>
              </div>
              <div class="modal-top-actions">
                <div class="modal-nav">
                  <button class="modal-nav-btn" type="button" :disabled="!prevDoc" @click="openAdjacentDoc('prev')">
                    上一篇
                  </button>
                  <button class="modal-nav-btn" type="button" :disabled="!nextDoc" @click="openAdjacentDoc('next')">
                    下一篇
                  </button>
                </div>
                <button class="modal-close" type="button" @click="closeDoc" aria-label="关闭">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
            <h2 class="modal-title">{{ selectedDoc.title }}</h2>
            <p class="modal-desc">{{ selectedDoc.summary }}</p>
          </div>

          <div v-if="selectedDoc.loading" class="modal-body loading-state">
            <div class="spinner"></div>
            <p>正在加载文档内容...</p>
          </div>
          <div v-else class="modal-body">
            <div class="modal-article">
              <FeishuRenderer :blocks="selectedDoc.blocks" />
            </div>
          </div>

          <div class="modal-footer">
            <div class="service-cta-inline">
              <span class="cta-inline-text">需要把这些内容整理成项目页面或交付文档？</span>
              <RouterLink to="/shop" class="cta-inline-link">查看远程协助服务</RouterLink>
            </div>
            <div class="modal-footer-actions">
              <button class="modal-nav-btn" type="button" :disabled="!prevDoc" @click="openAdjacentDoc('prev')">
                上一篇
              </button>
              <button class="modal-nav-btn" type="button" :disabled="!nextDoc" @click="openAdjacentDoc('next')">
                下一篇
              </button>
              <a :href="selectedDoc.editUrl" target="_blank" rel="noopener" class="edit-btn">
                在飞书中打开
              </a>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import FeishuRenderer from '@/components/FeishuRenderer.vue'
import { getDocumentContent } from '@/utils/feishuProxy.js'
import { loadKnowledgeBaseIndex } from '@/utils/knowledgeBase.js'

const COLLAB_GUIDE_URL = 'https://rcn17b9k6gos.feishu.cn/wiki/H3W7w9BFcifAmGkt8bRcnEm7nGg?from=from_copylink'
const COLLAB_ENTRY_URL = 'https://rcn17b9k6gos.feishu.cn/wiki/QMKnwK6j5i6D3MkOU3AcjcNgn1d'

const loading = ref(false)
const error = ref('')
const errorType = ref('')
const groups = ref([])
const selectedDoc = ref(null)
let lockedScrollY = 0

const errorTitle = computed(() => {
  if (errorType.value === 'unconfigured') return '知识库尚未配置'
  return '知识库暂时不可用'
})

const populatedGroups = computed(() => groups.value.filter(group => group.items.length))
const emptyGroups = computed(() => groups.value.filter(group => !group.items.length))
const totalDocs = computed(() => groups.value.reduce((sum, group) => sum + group.items.length, 0))
const flatDocs = computed(() => groups.value.flatMap(group => group.items))
const currentDocIndex = computed(() => {
  if (!selectedDoc.value) return -1
  return flatDocs.value.findIndex(doc => doc.id === selectedDoc.value.id)
})
const prevDoc = computed(() => {
  const index = currentDocIndex.value
  return index > 0 ? flatDocs.value[index - 1] : null
})
const nextDoc = computed(() => {
  const index = currentDocIndex.value
  return index >= 0 && index < flatDocs.value.length - 1 ? flatDocs.value[index + 1] : null
})

onMounted(() => {
  loadDocs()
})

watch(selectedDoc, value => {
  if (typeof document === 'undefined') return

  if (value) {
    lockedScrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${lockedScrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return
  }

  unlockPageScroll()
})

onUnmounted(() => {
  unlockPageScroll()
})

async function loadDocs() {
  loading.value = true
  error.value = ''
  errorType.value = ''

  try {
    const result = await loadKnowledgeBaseIndex()
    groups.value = result.groups

    if (!result.configured) {
      errorType.value = 'unconfigured'
      error.value = '当前环境还没有配置飞书知识库。等上线并补齐服务端环境变量后，这里就会正常显示。'
    }
  } catch (err) {
    console.error('Failed to load wiki documents:', err)
    errorType.value = 'request_failed'
    error.value = '无法加载飞书知识库内容，请检查服务端配置、接口权限或网络连接。'
    groups.value = []
  } finally {
    loading.value = false
  }
}

async function openDoc(doc) {
  selectedDoc.value = {
    ...doc,
    loading: true,
    blocks: []
  }

  try {
    const content = await getDocumentContent(doc.objToken)
    selectedDoc.value = {
      ...selectedDoc.value,
      blocks: content.items || [],
      loading: false
    }
  } catch (err) {
    console.error('Failed to load wiki document details:', err)
    selectedDoc.value = {
      ...selectedDoc.value,
      blocks: [],
      loading: false
    }
  }
}

function closeDoc() {
  selectedDoc.value = null
}

function unlockPageScroll() {
  if (typeof document === 'undefined') return

  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.left = ''
  document.body.style.right = ''
  document.body.style.width = ''
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''

  if (lockedScrollY) {
    window.scrollTo({ top: lockedScrollY })
    lockedScrollY = 0
  }
}

function scrollToGroup(groupKey) {
  const target = document.getElementById(`kb-${groupKey}`)
  if (!target) return
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function openAdjacentDoc(direction) {
  const target = direction === 'prev' ? prevDoc.value : nextDoc.value
  if (!target) return
  openDoc(target)
}

function openCollabLink() {
  const confirmed = window.confirm('进入协作入口前，建议先看一遍编写说明和模板。确认已经看过了吗？')
  if (!confirmed) return
  window.open(COLLAB_ENTRY_URL, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped>
.doc-page { padding-top: 64px; }
.container { max-width: 1280px; margin: 0 auto; padding: 0 var(--space-6); }
.section { padding: var(--space-20) 0; }

.page-hero {
  padding: calc(64px + 3.75rem) 0 2.5rem;
  background:
    linear-gradient(180deg, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0) 34%),
    var(--bg-secondary);
  border-bottom: 1px solid var(--border-subtle);
}

.hero-inner {
  display: grid;
  gap: 1.25rem;
}

.eyebrow {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 700;
}

.page-title {
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.1;
  font-weight: 700;
}

.page-subtitle {
  max-width: 820px;
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.75;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1.15rem;
}

.stat-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1rem 1.125rem;
  display: grid;
  gap: 0.25rem;
  box-shadow: var(--shadow-card);
}

.stat-item,
.rail-card,
.feedback-card,
.group-section,
.empty-groups-panel,
.doc-card,
.empty-group-card,
.modal-content {
  position: relative;
  isolation: isolate;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.docs-layout {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 1.75rem;
  align-items: start;
}

.category-rail {
  position: sticky;
  top: 96px;
}

.rail-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 0.9rem;
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.rail-title {
  font-size: 0.86rem;
  font-weight: 600;
  margin-bottom: 0.375rem;
}

.rail-summary {
  color: var(--text-muted);
  font-size: 0.76rem;
  line-height: 1.6;
  margin-bottom: 0.8rem;
}

.rail-links {
  display: grid;
  gap: 0.55rem;
}

.rail-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  border: 1px solid var(--border);
  background: var(--bg-primary);
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  padding: 0.72rem 0.8rem;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all var(--duration-normal) ease;
  text-align: left;
}

.rail-link:hover:enabled {
  border-color: var(--accent);
  color: var(--text-primary);
  background: var(--bg-card);
  transform: translateX(2px);
  box-shadow: var(--shadow-card);
}

.rail-link:disabled {
  cursor: default;
  opacity: 0.5;
}

.rail-count {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.feedback-card {
  margin-top: 0.9rem;
  background: linear-gradient(180deg, var(--bg-card) 0%, var(--bg-primary) 100%);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1rem;
  box-shadow: var(--shadow-card);
  display: grid;
  gap: 0.75rem;
}

.feedback-eyebrow {
  font-size: 0.75rem;
  color: var(--accent);
  font-weight: 700;
  text-transform: uppercase;
}

.feedback-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.feedback-desc {
  color: var(--text-secondary);
  font-size: 0.82rem;
  line-height: 1.7;
}

.feedback-actions {
  display: grid;
  gap: 0.625rem;
}

.feedback-primary,
.feedback-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-size: 0.82rem;
  transition: all var(--duration-normal) ease;
}

.feedback-primary {
  background: var(--accent);
  color: white;
  box-shadow: var(--glow-accent-soft);
}

.feedback-primary:hover {
  transform: translateY(-1px);
  filter: brightness(1.04);
}

.feedback-secondary {
  border: 1px solid var(--border);
  color: var(--text-secondary);
  background: var(--bg-primary);
}

.feedback-secondary:hover {
  border-color: var(--accent);
  color: var(--text-primary);
  background: var(--bg-card);
}

.feedback-note {
  color: var(--text-muted);
  font-size: 0.75rem;
  line-height: 1.6;
}

.page-title,
.page-subtitle,
.rail-title,
.rail-summary,
.feedback-title,
.feedback-desc,
.feedback-note,
.group-title,
.group-desc,
.group-total,
.doc-title,
.doc-summary,
.doc-date,
.modal-title,
.modal-desc,
.modal-date,
.panel-title,
.panel-subtitle,
.empty-group-title,
.empty-group-desc,
.empty-group-tip,
.cta-inline-text {
  transition: color var(--duration-normal) ease;
}

.docs-main {
  min-width: 0;
}

.group-list {
  display: grid;
  gap: 1.25rem;
}

.guide-panel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.25rem 1.35rem;
  box-shadow: var(--shadow-card);
  display: grid;
  gap: 1rem;
}

.guide-header {
  display: flex;
  justify-content: space-between;
  gap: 1.25rem;
  align-items: end;
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
}

.guide-card,
.template-card {
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--bg-primary);
  padding: 1rem;
}

.guide-card {
  display: grid;
  gap: 0.75rem;
}

.guide-card-title,
.template-title {
  font-size: 0.98rem;
  font-weight: 700;
  color: var(--text-primary);
}

.guide-list {
  display: grid;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.84rem;
  line-height: 1.65;
  padding-left: 1.1rem;
}

.template-card {
  display: grid;
  gap: 0.9rem;
}

.template-top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.template-chip {
  display: inline-flex;
  align-items: center;
  border-radius: var(--radius-full);
  background: var(--accent-light);
  color: var(--accent-text);
  padding: 0.25rem 0.625rem;
  font-size: 0.74rem;
  font-weight: 700;
}

.template-lines {
  display: grid;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.84rem;
  line-height: 1.7;
}

.collab-link-card {
  gap: 0.85rem;
}

.guide-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.guide-primary-link,
.guide-secondary-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  border-radius: var(--radius-md);
  padding: 0.625rem 0.95rem;
  font-size: 0.82rem;
  transition: all var(--duration-normal) ease;
}

.guide-primary-link {
  background: var(--accent);
  color: white;
  text-decoration: none;
  box-shadow: var(--glow-accent-soft);
}

.guide-primary-link:hover {
  transform: translateY(-1px);
  filter: brightness(1.04);
}

.guide-secondary-link {
  border: 1px solid var(--border);
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  box-shadow: var(--shadow-xs);
}

.guide-secondary-link:hover {
  border-color: var(--accent);
  color: var(--text-primary);
  background: var(--bg-card);
}

.permission-note {
  color: var(--text-muted);
  font-size: 0.8rem;
  line-height: 1.65;
}

.template-lines strong {
  color: var(--text-primary);
}

.group-section {
  scroll-margin-top: 100px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.3rem 1.35rem;
  box-shadow: var(--shadow-card);
  transition: border-color var(--duration-normal) ease, box-shadow var(--duration-normal) ease, background var(--duration-normal) ease;
}

.group-section:hover {
  border-color: var(--border-subtle);
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.05);
}

.group-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: start;
  margin-bottom: 1rem;
}

.group-badge {
  display: inline-flex;
  align-items: center;
  border-radius: var(--radius-full);
  background: var(--accent-light);
  color: var(--accent-text);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.625rem;
  margin-bottom: 0.75rem;
}

.group-title {
  font-size: 1.18rem;
  font-weight: 700;
  margin-bottom: 0.375rem;
}

.group-desc {
  color: var(--text-secondary);
  font-size: 0.86rem;
  line-height: 1.65;
}

.group-total {
  color: var(--text-muted);
  font-size: 0.875rem;
  white-space: nowrap;
}

.empty-groups-panel {
  scroll-margin-top: 100px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.25rem 1.35rem;
  box-shadow: var(--shadow-card);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 1.25rem;
  align-items: end;
  margin-bottom: 1rem;
}

.panel-eyebrow {
  font-size: 0.76rem;
  color: var(--accent);
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 0.375rem;
}

.panel-title {
  font-size: 1.08rem;
  font-weight: 700;
}

.panel-subtitle {
  max-width: 400px;
  color: var(--text-muted);
  font-size: 0.82rem;
  line-height: 1.65;
}

.empty-groups-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
}

.empty-group-card {
  border: 1px dashed var(--border);
  border-radius: 14px;
  padding: 0.95rem 1rem;
  background: var(--bg-primary);
  display: grid;
  gap: 0.65rem;
  transition: border-color var(--duration-normal) ease, background var(--duration-normal) ease;
}

.empty-group-card:hover {
  border-color: var(--accent);
  background: var(--bg-card);
}

.empty-group-top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.empty-group-count {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.empty-group-title {
  font-size: 0.96rem;
  font-weight: 600;
}

.empty-group-desc {
  color: var(--text-secondary);
  font-size: 0.82rem;
  line-height: 1.6;
}

.empty-group-tip {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-muted);
  font-size: 0.78rem;
  line-height: 1.55;
}

.doc-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.85rem;
}

.group-empty {
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px dashed var(--border);
  border-radius: 12px;
  padding: 1rem;
  background: var(--bg-primary);
}

.group-empty-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  flex-shrink: 0;
}

.group-empty-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.group-empty-text {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.doc-card {
  display: grid;
  gap: 0.875rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg-primary);
  padding: 1rem 1.05rem;
  cursor: pointer;
  transition: all var(--duration-normal) ease;
  max-width: 880px;
}

.doc-card:hover {
  border-color: var(--accent);
  box-shadow: 0 16px 40px rgba(34, 197, 94, 0.12);
  transform: translateY(-2px);
}

.doc-card-top,
.doc-footer,
.modal-meta,
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.doc-chip {
  display: inline-flex;
  align-items: center;
  border-radius: var(--radius-full);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 0.75rem;
  padding: 0.25rem 0.625rem;
}

.doc-date,
.modal-date {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.doc-title {
  font-size: 1.06rem;
  font-weight: 600;
  line-height: 1.5;
}

.doc-summary,
.modal-desc {
  color: var(--text-secondary);
  font-size: 0.88rem;
  line-height: 1.68;
}

.doc-action,
.doc-link,
.edit-btn,
.retry-btn {
  border-radius: var(--radius-md);
  padding: 0.625rem 0.875rem;
  font-size: 0.8125rem;
  text-decoration: none;
  transition: all var(--duration-normal) ease;
}

.doc-action,
.retry-btn {
  border: none;
  background: var(--accent);
  color: white;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(34, 197, 94, 0.16);
}

.doc-link,
.edit-btn {
  border: 1px solid var(--border);
  color: var(--text-secondary);
  background: transparent;
}

.doc-link:hover,
.edit-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--bg-secondary);
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.state-title {
  font-size: 1.25rem;
  margin: 0 0 0.6rem;
  color: var(--text-primary);
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

.error-icon { font-size: 3rem; margin-bottom: 1rem; }
.empty-icon { font-size: 3rem; margin-bottom: 1rem; }

.doc-modal {
  position: fixed;
  inset: 0;
  background: rgba(8, 12, 20, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  backdrop-filter: blur(10px);
  overscroll-behavior: contain;
}

.modal-content {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  max-width: 1120px;
  width: 100%;
  max-height: min(92vh, 980px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid var(--border);
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.24);
  isolation: isolate;
}

.modal-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--duration-normal) ease;
}

.modal-close:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.modal-header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.modal-top-actions,
.modal-nav,
.modal-footer-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.modal-header,
.modal-body,
.modal-footer {
  padding: 1.15rem 1.35rem;
}

.modal-header {
  border-bottom: 1px solid var(--border);
  display: grid;
  gap: 0.7rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%);
}

.modal-title {
  font-size: 1.28rem;
  font-weight: 700;
  line-height: 1.35;
  color: var(--text-primary);
  text-wrap: balance;
}

.modal-body {
  overflow-y: auto;
  flex: 1;
  background: linear-gradient(180deg, rgba(2, 6, 23, 0.03) 0%, rgba(2, 6, 23, 0) 100%);
  overscroll-behavior: contain;
  scrollbar-width: thin;
}

.modal-article {
  max-width: 920px;
  margin: 0 auto;
  padding: 0.45rem 0 0.65rem;
}

.modal-meta {
  align-items: center;
}

.modal-date {
  font-size: 0.78rem;
  font-weight: 500;
}

.modal-desc {
  max-width: 62ch;
  font-size: 0.94rem;
  line-height: 1.76;
}

.modal-footer {
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.02);
  justify-content: space-between;
}

.service-cta-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.cta-inline-text {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.cta-inline-link {
  font-size: 0.85rem;
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
}

.cta-inline-link:hover {
  text-decoration: underline;
}

.modal-nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 0.5rem 0.85rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.8rem;
  transition: all var(--duration-normal) ease;
}

.modal-nav-btn:hover:enabled {
  border-color: var(--accent);
  color: var(--text-primary);
  background: var(--bg-card);
}

.modal-nav-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

[data-theme="dark"] .page-hero {
  background:
    radial-gradient(circle at 16% 10%, rgba(74, 222, 128, 0.12) 0%, transparent 24%),
    radial-gradient(circle at 85% 18%, rgba(34, 211, 238, 0.07) 0%, transparent 22%),
    linear-gradient(180deg, rgba(36, 46, 66, 0.68) 0%, rgba(36, 46, 66, 0.2) 100%),
    var(--bg-secondary);
}

[data-theme="dark"] .doc-page {
  background:
    linear-gradient(180deg, #151c28 0%, #1b2432 28%, #202938 100%);
}

[data-theme="dark"] .stat-item,
[data-theme="dark"] .rail-card,
[data-theme="dark"] .feedback-card,
[data-theme="dark"] .guide-panel,
[data-theme="dark"] .group-section,
[data-theme="dark"] .empty-groups-panel {
  background: linear-gradient(180deg, rgba(40, 50, 68, 0.78) 0%, rgba(31, 41, 55, 0.72) 100%);
  border-color: rgba(163, 177, 198, 0.14);
  box-shadow: 0 14px 38px rgba(8, 15, 30, 0.22);
  backdrop-filter: blur(14px);
}

[data-theme="dark"] .rail-link,
[data-theme="dark"] .doc-card,
[data-theme="dark"] .guide-card,
[data-theme="dark"] .template-card,
[data-theme="dark"] .empty-group-card,
[data-theme="dark"] .feedback-secondary,
[data-theme="dark"] .guide-secondary-link {
  background: linear-gradient(180deg, rgba(47, 58, 77, 0.72) 0%, rgba(36, 46, 62, 0.64) 100%);
  border-color: rgba(163, 177, 198, 0.12);
}

[data-theme="dark"] .rail-link:hover:enabled,
[data-theme="dark"] .feedback-secondary:hover,
[data-theme="dark"] .guide-secondary-link:hover,
[data-theme="dark"] .empty-group-card:hover {
  background: linear-gradient(180deg, rgba(58, 71, 92, 0.84) 0%, rgba(41, 52, 70, 0.76) 100%);
  border-color: rgba(74, 222, 128, 0.24);
}

[data-theme="dark"] .stat-item::before,
[data-theme="dark"] .rail-card::before,
[data-theme="dark"] .feedback-card::before,
[data-theme="dark"] .guide-panel::before,
[data-theme="dark"] .group-section::before,
[data-theme="dark"] .empty-groups-panel::before,
[data-theme="dark"] .doc-card::before,
[data-theme="dark"] .guide-card::before,
[data-theme="dark"] .template-card::before,
[data-theme="dark"] .empty-group-card::before,
[data-theme="dark"] .modal-content::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 22%),
    radial-gradient(circle at top right, rgba(74, 222, 128, 0.08) 0%, transparent 34%);
  z-index: 0;
}

[data-theme="dark"] .stat-item > *,
[data-theme="dark"] .rail-card > *,
[data-theme="dark"] .feedback-card > *,
[data-theme="dark"] .guide-panel > *,
[data-theme="dark"] .group-section > *,
[data-theme="dark"] .empty-groups-panel > *,
[data-theme="dark"] .doc-card > *,
[data-theme="dark"] .guide-card > *,
[data-theme="dark"] .template-card > *,
[data-theme="dark"] .empty-group-card > *,
[data-theme="dark"] .modal-content > * {
  position: relative;
  z-index: 1;
}

[data-theme="dark"] .page-subtitle,
[data-theme="dark"] .rail-summary,
[data-theme="dark"] .feedback-desc,
[data-theme="dark"] .group-desc,
[data-theme="dark"] .doc-summary,
[data-theme="dark"] .panel-subtitle,
[data-theme="dark"] .empty-group-desc,
[data-theme="dark"] .feedback-note,
[data-theme="dark"] .empty-group-tip,
[data-theme="dark"] .guide-list,
[data-theme="dark"] .template-lines,
[data-theme="dark"] .permission-note,
[data-theme="dark"] .cta-inline-text {
  color: rgba(222, 230, 240, 0.78);
}

[data-theme="dark"] .modal-desc {
  color: rgba(224, 232, 241, 0.84);
}

[data-theme="dark"] .doc-date,
[data-theme="dark"] .modal-date,
[data-theme="dark"] .group-total,
[data-theme="dark"] .rail-count,
[data-theme="dark"] .empty-group-count {
  color: rgba(188, 198, 214, 0.76);
}

[data-theme="dark"] .page-title,
[data-theme="dark"] .group-title,
[data-theme="dark"] .doc-title,
[data-theme="dark"] .guide-card-title,
[data-theme="dark"] .template-title,
[data-theme="dark"] .feedback-title,
[data-theme="dark"] .panel-title,
[data-theme="dark"] .modal-title {
  color: rgba(245, 247, 250, 0.96);
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.12);
}

[data-theme="dark"] .doc-card:hover {
  border-color: rgba(74, 222, 128, 0.3);
  background: linear-gradient(180deg, rgba(64, 78, 99, 0.88) 0%, rgba(45, 57, 75, 0.8) 100%);
  box-shadow: 0 16px 34px rgba(12, 20, 36, 0.24), 0 0 0 1px rgba(74, 222, 128, 0.08) inset;
}

[data-theme="dark"] .doc-modal {
  background:
    radial-gradient(circle at top, rgba(125, 211, 252, 0.08) 0%, transparent 30%),
    radial-gradient(circle at 82% 18%, rgba(74, 222, 128, 0.06) 0%, transparent 22%),
    rgba(7, 10, 18, 0.8);
}

[data-theme="dark"] .modal-content {
  background:
    linear-gradient(180deg, rgba(34, 43, 58, 0.97) 0%, rgba(26, 34, 48, 0.99) 100%);
  border-color: rgba(186, 199, 218, 0.14);
  box-shadow:
    0 28px 80px rgba(3, 8, 20, 0.46),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

[data-theme="dark"] .modal-header {
  border-bottom-color: rgba(186, 199, 218, 0.12);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0) 100%),
    radial-gradient(circle at top right, rgba(125, 211, 252, 0.08) 0%, transparent 28%);
}

[data-theme="dark"] .modal-body {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.018) 0%, rgba(255, 255, 255, 0) 100%);
}

[data-theme="dark"] .modal-footer {
  border-top-color: rgba(186, 199, 218, 0.12);
  background: rgba(255, 255, 255, 0.025);
}

[data-theme="dark"] .modal-close {
  border-color: rgba(186, 199, 218, 0.12);
  background: rgba(66, 79, 100, 0.36);
  color: rgba(229, 236, 244, 0.82);
}

[data-theme="dark"] .modal-nav-btn {
  border-color: rgba(186, 199, 218, 0.12);
  background: rgba(66, 79, 100, 0.28);
  color: rgba(224, 232, 241, 0.78);
}

[data-theme="dark"] .modal-nav-btn:hover:enabled {
  border-color: rgba(125, 211, 252, 0.26);
  background: rgba(79, 94, 118, 0.4);
  color: rgba(246, 248, 251, 0.96);
}

[data-theme="dark"] .modal-body::-webkit-scrollbar {
  width: 10px;
}

[data-theme="dark"] .modal-body::-webkit-scrollbar-track {
  background: rgba(20, 27, 39, 0.42);
}

[data-theme="dark"] .modal-body::-webkit-scrollbar-thumb {
  background: rgba(111, 130, 156, 0.5);
  border-radius: 999px;
  border: 2px solid rgba(20, 27, 39, 0.42);
}

[data-theme="dark"] .modal-body::-webkit-scrollbar-thumb:hover {
  background: rgba(134, 156, 186, 0.62);
}

[data-theme="dark"] .group-section:hover,
[data-theme="dark"] .empty-groups-panel:hover {
  border-color: rgba(74, 222, 128, 0.18);
  box-shadow: 0 18px 38px rgba(12, 20, 36, 0.22);
}

[data-theme="dark"] .rail-link:hover:enabled {
  color: rgba(248, 250, 252, 0.98);
  box-shadow: 0 10px 20px rgba(12, 20, 36, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transform: translateX(3px);
}

[data-theme="dark"] .doc-action,
[data-theme="dark"] .feedback-primary {
  background: linear-gradient(180deg, #4ade80 0%, #22c55e 100%);
  color: #04130a;
  box-shadow: 0 12px 28px rgba(34, 197, 94, 0.2);
}

[data-theme="dark"] .guide-primary-link {
  background: linear-gradient(180deg, #4ade80 0%, #22c55e 100%);
  color: #04130a;
  box-shadow: 0 12px 28px rgba(34, 197, 94, 0.2);
}

[data-theme="dark"] .doc-action:hover,
[data-theme="dark"] .feedback-primary:hover,
[data-theme="dark"] .guide-primary-link:hover {
  filter: brightness(1.03);
  box-shadow: 0 16px 30px rgba(34, 197, 94, 0.22);
}

[data-theme="dark"] .doc-link:hover,
[data-theme="dark"] .edit-btn:hover {
  background: linear-gradient(180deg, rgba(58, 71, 92, 0.76) 0%, rgba(41, 52, 70, 0.72) 100%);
}

[data-theme="dark"] .doc-chip,
[data-theme="dark"] .group-badge,
[data-theme="dark"] .template-chip {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

[data-theme="dark"] .doc-chip {
  background: rgba(70, 84, 106, 0.6);
  color: rgba(228, 234, 242, 0.88);
  letter-spacing: 0.01em;
}

[data-theme="dark"] .modal-close:hover {
  background: rgba(63, 76, 96, 0.82);
  border-color: rgba(74, 222, 128, 0.2);
  color: rgba(245, 247, 250, 0.96);
}

.fade-in-up { animation: fadeInUp 0.5s ease both; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 960px) {
  .docs-layout,
  .hero-stats,
  .doc-grid,
  .guide-grid,
  .empty-groups-grid {
    grid-template-columns: 1fr;
  }

  .category-rail {
    position: static;
  }

  .guide-header,
  .panel-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .doc-card {
    max-width: none;
  }
}

@media (max-width: 768px) {
  .page-hero { padding-top: calc(64px + 3rem); }
  .section { padding: var(--space-12) 0; }
  .group-header,
  .doc-card-top,
  .doc-footer,
  .modal-header-top,
  .modal-top-actions,
  .modal-nav,
  .modal-meta,
  .modal-footer,
  .modal-footer-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .doc-modal { padding: 1rem; }
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }

  .group-empty {
    align-items: flex-start;
  }

  .empty-group-tip {
    align-items: flex-start;
  }

  .group-section,
  .guide-panel,
  .empty-groups-panel {
    padding: 1rem;
  }

  .template-top {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 640px) {
  .doc-modal {
    padding: 0;
    align-items: stretch;
  }

  .modal-content {
    max-height: 100dvh;
    max-height: 100vh;
    height: 100%;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }

  .modal-header-top {
    gap: 0.5rem;
  }

  .modal-nav-btn {
    flex: 1;
    min-width: 0;
    justify-content: center;
  }
}
</style>
