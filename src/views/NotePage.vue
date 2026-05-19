<template>
  <main class="note-page">
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title fade-in-up">笔记</h1>
        <div class="title-underline"></div>
        <p class="page-subtitle fade-in-up" style="animation-delay:0.1s">
          用尽量轻的方式，记录开发过程里的想法、踩坑、结论和以后还能复用的东西。
        </p>
      </div>
    </section>

    <section class="section notes-section">
      <div class="container">
        <div class="notes-toolbar">
          <div class="search-box">
            <input
              v-model.trim="keyword"
              type="search"
              class="search-input"
              placeholder="搜索标题、摘要、标签"
            />
          </div>
          <div class="notes-meta">
            <span>{{ filteredNotes.length }} 篇笔记</span>
          </div>
        </div>

        <div v-if="filteredNotes.length" class="notes-grid">
          <article v-for="note in filteredNotes" :key="note.slug" class="note-card">
            <div class="note-topline">
              <span class="note-date">{{ note.dateLabel }}</span>
              <span class="note-reading">{{ note.readingTime }} 分钟阅读</span>
            </div>
            <h2 class="note-title">
              <RouterLink :to="`/note/${note.slug}`">{{ note.title }}</RouterLink>
            </h2>
            <p class="note-summary">{{ note.summary }}</p>
            <div class="note-tags">
              <span v-for="tag in note.tags" :key="tag" class="note-tag">{{ tag }}</span>
            </div>
            <RouterLink :to="`/note/${note.slug}`" class="note-link">阅读笔记</RouterLink>
          </article>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">MD</div>
          <h2 class="empty-title">还没有匹配的笔记</h2>
          <p class="empty-desc">
            你可以直接在仓库里的 <code>src/content/notes</code> 目录新增 Markdown 文件，页面会自动读取。
          </p>
          <RouterLink to="/doc" class="browse-docs-btn">先看看知识库</RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAllNotes } from '@/utils/notes.js'

const route = useRoute()
const router = useRouter()
const keyword = ref(typeof route.query.q === 'string' ? route.query.q : '')
const notes = getAllNotes()

const filteredNotes = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return notes

  return notes.filter(note => {
    const haystacks = [
      note.title,
      note.summary,
      note.tags.join(' '),
      note.content
    ]

    return haystacks.some(item => item.toLowerCase().includes(q))
  })
})

watch(keyword, (value) => {
  const q = value.trim()
  const nextQuery = { ...route.query }

  if (q) nextQuery.q = q
  else delete nextQuery.q

  router.replace({ query: nextQuery })
})
</script>

<style scoped>
.note-page {
  min-height: 100vh;
  padding-top: 64px;
  background:
    linear-gradient(180deg, rgba(6, 182, 212, 0.04), transparent 22%),
    var(--bg-secondary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.page-hero {
  text-align: center;
  padding: calc(64px + 3rem) 0 2rem;
}

.page-title {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.title-underline {
  width: 48px;
  height: 3px;
  background: var(--gradient-primary);
  border-radius: 2px;
  margin: 0 auto 1rem;
  transform: scaleX(0);
  animation: ulSlideIn 0.5s ease 0.1s forwards;
}

@keyframes ulSlideIn {
  to { transform: scaleX(1); }
}

.page-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  max-width: 620px;
  margin: 0 auto;
  line-height: 1.8;
}

.fade-in-up {
  animation: fadeInUp 0.5s ease both;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.section {
  padding: var(--space-16) 0 var(--space-20);
}

.notes-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-box {
  flex: 1;
  max-width: 440px;
}

.search-input {
  width: 100%;
  height: 48px;
  padding: 0 1rem;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.12);
}

.notes-meta {
  color: var(--text-secondary);
  font-size: 0.9rem;
  white-space: nowrap;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.note-card {
  display: flex;
  flex-direction: column;
  min-height: 280px;
  padding: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.04);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.note-card:hover {
  transform: translateY(-2px);
  border-color: rgba(6, 182, 212, 0.45);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
}

.note-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: var(--text-tertiary);
  font-size: 0.85rem;
}

.note-title {
  margin: 0 0 0.85rem;
  font-size: 1.2rem;
  line-height: 1.4;
}

.note-title a {
  color: var(--text-primary);
  text-decoration: none;
}

.note-title a:hover {
  color: var(--accent);
}

.note-summary {
  margin: 0 0 1.25rem;
  color: var(--text-secondary);
  line-height: 1.78;
  flex: 1;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.note-tag {
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: var(--accent-light);
  color: var(--accent);
  font-size: 0.82rem;
}

.note-link {
  display: inline-flex;
  align-items: center;
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
}

.empty-state {
  padding: 4rem 2rem;
  text-align: center;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
}

.empty-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 1rem;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: var(--accent-light);
  color: var(--accent);
  font-weight: 700;
}

.empty-title {
  margin-bottom: 0.75rem;
}

.empty-desc {
  max-width: 560px;
  margin: 0 auto 1.5rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

.browse-docs-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 1.25rem;
  border-radius: 999px;
  text-decoration: none;
  background: var(--accent);
  color: white;
  font-weight: 600;
}

[data-theme="dark"] .note-page {
  background:
    linear-gradient(180deg, rgba(34, 197, 94, 0.06), transparent 22%),
    var(--bg-secondary);
}

[data-theme="dark"] .search-input {
  background: rgba(15, 23, 42, 0.72);
}

[data-theme="dark"] .note-card {
  background: rgba(15, 23, 42, 0.82);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.26);
}

[data-theme="dark"] .note-card:hover {
  box-shadow: 0 20px 46px rgba(0, 0, 0, 0.34);
}

@media (max-width: 900px) {
  .notes-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-hero {
    padding-top: calc(64px + 2rem);
  }

  .section {
    padding: var(--space-12) 0;
  }

  .notes-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: none;
  }

  .notes-meta {
    white-space: normal;
  }
}
</style>
