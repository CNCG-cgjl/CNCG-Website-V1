<template>
  <section class="section" id="content">
    <div class="container">
      <div class="content-grid">
        <div class="content-col" ref="noteRef" :class="{ visible: noteVisible }">
          <div class="col-header">
            <h2 class="col-title">最新笔记</h2>
            <span class="col-badge">NOTE</span>
          </div>

          <div v-if="notes.length === 0" class="empty-state">
            <span class="coming-soon-badge">COMING SOON</span>
            <div class="empty-glow-bg"></div>
            <div class="empty-icon float">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <p class="empty-title">笔记内容即将上线</p>
            <p class="empty-desc">数据来源：Supabase 数据库<br />接入配置完成后将自动展示</p>
          </div>

          <div v-else class="note-list">
            <RouterLink
              v-for="note in notes"
              :key="note.id"
              :to="`/note/${note.slug}`"
              class="note-item"
            >
              <span class="note-left-bar"></span>
              <div class="note-icon">N</div>
              <div class="note-body">
                <p class="note-title">{{ note.title }}</p>
                <p class="note-meta">{{ note.date }} · {{ note.tag }}</p>
              </div>
              <svg class="note-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                   viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </RouterLink>
          </div>

          <RouterLink to="/note" class="col-more-btn">查看全部笔记 →</RouterLink>
        </div>

        <div class="content-divider" aria-hidden="true"></div>

        <div class="content-col" ref="docRef" :class="{ visible: docVisible }">
          <div class="col-header">
            <h2 class="col-title">知识库精选</h2>
            <span class="col-badge col-badge-purple">DOC</span>
          </div>

          <div v-if="docsLoading" class="empty-state">
            <div class="empty-glow-bg empty-glow-bg-purple"></div>
            <div class="empty-icon float" style="animation-delay: 0.5s">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <p class="empty-title">知识库内容加载中</p>
            <p class="empty-desc">正在同步飞书知识库入口</p>
          </div>

          <div v-else-if="docs.length === 0" class="empty-state">
            <span class="coming-soon-badge coming-soon-purple">COMING SOON</span>
            <div class="empty-glow-bg empty-glow-bg-purple"></div>
            <div class="empty-icon float" style="animation-delay: 0.5s">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <p class="empty-title">知识库内容即将上线</p>
            <p class="empty-desc">数据来源：飞书知识库<br />配置飞书集成后将自动同步</p>
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
              <span class="doc-btn">进入知识库</span>
            </RouterLink>
          </div>

          <RouterLink to="/doc" class="col-more-btn">探索全部知识库 →</RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver.js'
import { getFeaturedKnowledgeDocs, loadKnowledgeBaseIndex } from '@/utils/knowledgeBase.js'

const noteRef = ref(null)
const docRef = ref(null)
const { isVisible: noteVisible } = useIntersectionObserver(noteRef, { threshold: 0.15 })
const { isVisible: docVisible } = useIntersectionObserver(docRef, { threshold: 0.15 })

const notes = ref([])
const docs = ref([])
const docsLoading = ref(true)

onMounted(async () => {
  try {
    const result = await loadKnowledgeBaseIndex()
    docs.value = getFeaturedKnowledgeDocs(result.groups, 4)
  } catch (error) {
    console.error('Failed to load featured knowledge docs:', error)
    docs.value = []
  } finally {
    docsLoading.value = false
  }
})
</script>

<style scoped>
.content-grid {
  display: grid;
  grid-template-columns: 1fr 2px 1fr;
  gap: 0 2.5rem;
  align-items: start;
}

.content-divider {
  background: linear-gradient(180deg, transparent 0%, var(--border) 15%, var(--border) 85%, transparent 100%);
  width: 1px;
  min-height: 300px;
  align-self: stretch;
}

.content-col {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.55s var(--ease-out);
}

.content-col.visible {
  opacity: 1;
  transform: none;
}

.col-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.col-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.col-badge {
  padding: 0.2rem 0.625rem;
  background: var(--accent-light);
  border-radius: var(--radius-full);
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--accent-text);
  letter-spacing: 0.08em;
}

[data-theme="dark"] .col-badge { color: var(--accent); }

.col-badge-purple {
  background: #eeedfe;
  color: #534ab7;
}

[data-theme="dark"] .col-badge-purple {
  background: #1a1835;
  color: #a5b4fc;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  background: var(--bg-card);
  border: 1px dashed var(--border);
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1.25rem;
  gap: 0.625rem;
  position: relative;
  overflow: hidden;
}

.coming-soon-badge {
  position: absolute;
  top: 18px;
  right: -26px;
  padding: 0.2rem 2rem;
  background: var(--gradient-primary);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  transform: rotate(45deg);
  z-index: 1;
  line-height: 1.4;
}

.coming-soon-purple {
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
}

.empty-glow-bg {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.06) 0%, transparent 70%);
  pointer-events: none;
  animation: glowPulse 4s ease-in-out infinite;
}

.empty-glow-bg-purple {
  background: radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%);
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
}

.empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  margin-top: 1rem;
  position: relative;
  z-index: 1;
}

.empty-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  position: relative;
  z-index: 1;
}

.empty-desc {
  font-size: 0.8125rem;
  color: var(--text-muted);
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

.note-list,
.doc-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.note-item,
.doc-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.95rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  text-decoration: none;
  transition: all var(--duration-normal) var(--ease-out);
  position: relative;
  overflow: hidden;
}

.note-left-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--gradient-primary);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform var(--duration-slow) var(--ease-out);
  border-radius: 0 2px 2px 0;
}

.note-item:hover .note-left-bar {
  transform: scaleY(1);
}

.note-item:hover,
.doc-item:hover {
  border-color: var(--accent);
  transform: translateX(4px);
  box-shadow: var(--shadow-sm);
}

.note-icon,
.doc-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.875rem;
  font-weight: 700;
}

.note-icon {
  background: var(--accent-light);
  color: var(--accent-text);
}

[data-theme="dark"] .note-icon { color: var(--accent); }

.doc-icon {
  background: #eeedfe;
  color: #534ab7;
}

[data-theme="dark"] .doc-icon {
  background: #1a1835;
  color: #a5b4fc;
}

.note-body,
.doc-body {
  flex: 1;
  min-width: 0;
}

.note-title,
.doc-title {
  font-size: 0.9375rem;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.note-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.doc-title {
  font-weight: 600;
  line-height: 1.5;
}

.note-meta,
.doc-meta {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.doc-desc {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.55;
  margin-bottom: 0.4rem;
}

.note-arrow {
  color: var(--text-muted);
  flex-shrink: 0;
  transition: all var(--duration-normal) ease;
}

.note-item:hover .note-arrow {
  transform: translateX(4px);
  color: var(--accent);
}

.doc-btn {
  flex-shrink: 0;
  color: var(--accent);
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;
}

.col-more-btn {
  display: inline-flex;
  font-size: 0.875rem;
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  transition: all var(--duration-normal) ease;
  align-items: center;
  gap: 0.25rem;
}

.col-more-btn:hover {
  opacity: 0.75;
  translate: 2px 0;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem 0;
  }

  .content-divider {
    width: 100%;
    height: 1px;
    min-height: auto;
  }

  .coming-soon-badge {
    top: 14px;
    right: -28px;
    font-size: 0.6rem;
  }

  .empty-state {
    padding: 2.5rem 1rem;
  }

  .empty-icon {
    width: 60px;
    height: 60px;
  }

  .doc-item {
    align-items: flex-start;
  }

  .doc-btn {
    display: none;
  }
}
</style>
