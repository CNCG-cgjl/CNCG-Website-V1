<template>
  <main class="note-detail-page">
    <section v-if="note" class="note-shell">
      <div class="container">
        <div class="note-head">
          <RouterLink to="/note" class="back-link">返回笔记列表</RouterLink>
          <div class="note-meta">
            <span>{{ note.dateLabel }}</span>
            <span>{{ note.readingTime }} 分钟阅读</span>
          </div>
          <h1 class="note-title">{{ note.title }}</h1>
          <p class="note-summary">{{ note.summary }}</p>
          <div class="note-tags">
            <span v-for="tag in note.tags" :key="tag" class="note-tag">{{ tag }}</span>
          </div>
        </div>

        <article class="note-body markdown-body" v-html="note.html"></article>

        <div class="note-bottom">
          <CommentSection :page-id="`note-${note.slug}`" />
        </div>
      </div>
    </section>

    <section v-else class="missing-shell">
      <div class="container">
        <div class="missing-card">
          <div class="missing-badge">未找到</div>
          <h1 class="missing-title">这篇笔记不存在</h1>
          <p class="missing-desc">
            可能是链接已经变更，或者对应的 Markdown 文件还没有加入仓库。
          </p>
          <RouterLink to="/note" class="back-link primary">回到笔记页</RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import CommentSection from '@/components/common/CommentSection.vue'
import { getNoteBySlug } from '@/utils/notes.js'

const route = useRoute()
const note = computed(() => getNoteBySlug(route.params.slug))

watchEffect(() => {
  if (!note.value) return
  document.title = `${note.value.title} | 笔记 | CNCG`
})
</script>

<style scoped>
.note-detail-page {
  min-height: 100vh;
  padding-top: 64px;
  background:
    radial-gradient(circle at top, rgba(6, 182, 212, 0.07), transparent 32%),
    var(--bg-secondary);
}

.container {
  max-width: 920px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.note-shell {
  padding: calc(64px + 2.5rem) 0 var(--space-16);
}

.note-head {
  margin-bottom: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  margin-bottom: 1.25rem;
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
}

.note-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  color: var(--text-tertiary);
  font-size: 0.9rem;
  margin-bottom: 0.9rem;
}

.note-title {
  margin: 0 0 0.85rem;
  font-size: clamp(2rem, 4vw, 2.8rem);
  line-height: 1.2;
}

.note-summary {
  margin: 0 0 1rem;
  color: var(--text-secondary);
  line-height: 1.85;
  font-size: 1rem;
  max-width: 760px;
}

.note-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.note-tag {
  padding: 0.38rem 0.75rem;
  border-radius: 999px;
  background: var(--accent-light);
  color: var(--accent);
  font-size: 0.82rem;
}

.note-body {
  padding: clamp(1.3rem, 3vw, 2.2rem);
  background: color-mix(in srgb, var(--bg-card) 92%, white 8%);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.06);
}

.markdown-body :deep(> *:first-child) {
  margin-top: 0;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  color: var(--text-primary);
  margin: 2.2rem 0 0.95rem;
  line-height: 1.35;
}

.markdown-body :deep(h1) { font-size: 2rem; }
.markdown-body :deep(h2) { font-size: 1.5rem; }
.markdown-body :deep(h3) { font-size: 1.2rem; }

.markdown-body :deep(p),
.markdown-body :deep(li) {
  color: var(--text-secondary);
  line-height: 1.95;
  font-size: 1rem;
}

.markdown-body :deep(p) {
  margin: 0 0 1.1rem;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 0 0 1.2rem 1.4rem;
  padding: 0;
}

.markdown-body :deep(li + li) {
  margin-top: 0.45rem;
}

.markdown-body :deep(blockquote) {
  margin: 1.4rem 0;
  padding: 1rem 1.1rem;
  border-left: 3px solid var(--accent);
  border-radius: 0 12px 12px 0;
  background: color-mix(in srgb, var(--accent-light) 55%, var(--bg-secondary) 45%);
  color: var(--text-secondary);
}

.markdown-body :deep(code) {
  padding: 0.16rem 0.42rem;
  border-radius: 6px;
  background: rgba(148, 163, 184, 0.14);
  font-size: 0.92em;
}

.markdown-body :deep(pre) {
  overflow: auto;
  margin: 1.35rem 0;
  padding: 1rem 1.1rem;
  border-radius: 14px;
  background: #0f172a;
  color: #e2e8f0;
}

.markdown-body :deep(pre code) {
  padding: 0;
  background: transparent;
  color: inherit;
}

.markdown-body :deep(a) {
  color: var(--accent);
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

.markdown-body :deep(hr) {
  border: 0;
  border-top: 1px solid var(--border);
  margin: 2rem 0;
}

.markdown-body :deep(img) {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  margin: 1.25rem auto 1.5rem;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--bg-secondary);
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
}

.note-bottom {
  margin-top: 2rem;
}

.missing-shell {
  padding: calc(64px + 3rem) 0 var(--space-16);
}

.missing-card {
  padding: 3rem 2rem;
  text-align: center;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
}

.missing-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 0.8rem;
  border-radius: 999px;
  margin-bottom: 1rem;
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
  font-size: 0.85rem;
}

.missing-title {
  margin-bottom: 0.8rem;
}

.missing-desc {
  margin: 0 auto 1.5rem;
  max-width: 480px;
  color: var(--text-secondary);
  line-height: 1.8;
}

.primary {
  justify-content: center;
  height: 44px;
  padding: 0 1.2rem;
  margin-bottom: 0;
  border-radius: 999px;
  background: var(--accent);
  color: white;
}

[data-theme="dark"] .note-detail-page {
  background:
    radial-gradient(circle at top, rgba(34, 197, 94, 0.09), transparent 34%),
    #07111b;
}

[data-theme="dark"] .note-body {
  background: rgba(10, 18, 28, 0.92);
  border-color: rgba(148, 163, 184, 0.18);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.34);
}

[data-theme="dark"] .markdown-body :deep(p),
[data-theme="dark"] .markdown-body :deep(li) {
  color: rgba(226, 232, 240, 0.88);
}

[data-theme="dark"] .markdown-body :deep(blockquote) {
  background: rgba(15, 23, 42, 0.88);
  color: rgba(226, 232, 240, 0.78);
}

[data-theme="dark"] .markdown-body :deep(code) {
  background: rgba(148, 163, 184, 0.16);
  color: #dbeafe;
}

[data-theme="dark"] .markdown-body :deep(img) {
  background: rgba(15, 23, 42, 0.88);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
}

@media (max-width: 768px) {
  .note-shell,
  .missing-shell {
    padding-top: calc(64px + 2rem);
  }

  .note-body {
    padding: 1.25rem;
    border-radius: 16px;
  }
}
</style>
