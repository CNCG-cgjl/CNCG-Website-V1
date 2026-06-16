<template>
  <section class="section" id="content">
    <div class="container">
      <div class="content-single" ref="docRef" :class="{ visible: docVisible }">
        <div class="col-header">
          <h2 class="col-title">教程与搭建记录</h2>
          <span class="col-badge col-badge-purple">知识库</span>
        </div>
        <p class="col-desc">
          免费阅读建站过程与工具笔记；需要定制开发或购买标品服务，请使用页面上方的服务与商店入口。
        </p>

        <div v-if="docsLoading" class="empty-state">
          <div class="empty-glow-bg empty-glow-bg-purple"></div>
          <div class="empty-icon float">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <p class="empty-title">知识库内容加载中</p>
          <p class="empty-desc">正在同步飞书知识库</p>
        </div>

        <div v-else-if="docs.length === 0" class="empty-state">
          <span class="coming-soon-badge coming-soon-purple">COMING SOON</span>
          <div class="empty-glow-bg empty-glow-bg-purple"></div>
          <p class="empty-title">知识库内容即将上线</p>
          <p class="empty-desc">在飞书 Wiki 发布文档后，刷新页面即可看到</p>
        </div>

        <div v-else class="doc-list">
          <RouterLink
            v-for="doc in docs"
            :key="doc.id"
            to="/doc"
            class="doc-item"
          >
            <div class="doc-icon">{{ doc.categoryLabel.slice(0, 1) }}</div>
            <div class="doc-body">
              <p class="doc-title">{{ doc.title }}</p>
              <p class="doc-desc">{{ doc.summary }}</p>
              <p class="doc-meta">{{ doc.categoryTitle }}<span v-if="doc.updatedAt"> · {{ doc.updatedAt }}</span></p>
            </div>
            <span class="doc-btn">阅读</span>
          </RouterLink>
        </div>

        <RouterLink to="/doc" class="col-more-btn">探索全部知识库 →</RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver.js'
import { getFeaturedKnowledgeDocs, loadKnowledgeBaseIndex } from '@/utils/knowledgeBase.js'

const docRef = ref(null)
const { isVisible: docVisible } = useIntersectionObserver(docRef, { threshold: 0.15 })

const docs = ref([])
const docsLoading = ref(true)

onMounted(async () => {
  try {
    const result = await loadKnowledgeBaseIndex()
    docs.value = getFeaturedKnowledgeDocs(result.groups, 6)
  } catch (error) {
    console.error('Failed to load featured knowledge docs:', error)
    docs.value = []
  } finally {
    docsLoading.value = false
  }
})
</script>

<style scoped>
.content-single {
  max-width: 880px;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.55s var(--ease-out);
}

.content-single.visible {
  opacity: 1;
  transform: none;
}

.col-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.col-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.col-desc {
  margin: 0 0 1.5rem;
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 0.95rem;
}

.col-badge {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.625rem;
  border-radius: 999px;
  background: var(--accent-light);
  color: var(--accent-text);
}

.col-badge-purple {
  background: rgba(139, 92, 246, 0.12);
  color: #7c3aed;
}

.doc-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.doc-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.doc-item:hover {
  border-color: var(--accent);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}

.doc-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 0.9rem;
  background: rgba(139, 92, 246, 0.1);
  color: #7c3aed;
}

.doc-title {
  margin: 0 0 0.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.doc-desc {
  margin: 0 0 0.35rem;
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.doc-meta {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.doc-btn {
  font-size: 0.82rem;
  color: var(--accent);
  white-space: nowrap;
}

.col-more-btn {
  display: inline-flex;
  margin-top: 1.25rem;
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
}

.col-more-btn:hover {
  text-decoration: underline;
}

.empty-state {
  position: relative;
  text-align: center;
  padding: 3rem 1.5rem;
  border-radius: var(--radius-xl);
  border: 1px dashed var(--border);
  background: var(--bg-secondary);
}

.empty-title {
  margin: 0.75rem 0 0.35rem;
  font-weight: 600;
}

.empty-desc {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.coming-soon-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 0.2rem 2rem;
  border-radius: 999px;
  background: var(--accent-light);
  color: var(--accent-text);
}

.coming-soon-purple {
  background: rgba(139, 92, 246, 0.12);
  color: #7c3aed;
}

@media (max-width: 640px) {
  .doc-item {
    grid-template-columns: auto 1fr;
  }
  .doc-btn {
    grid-column: 2;
    justify-self: start;
  }
}
</style>
