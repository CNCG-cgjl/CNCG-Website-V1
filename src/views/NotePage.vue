<template>
  <main class="note-page">
    <section class="page-hero">
      <div class="container hero-inner">
        <div class="hero-copy">
          <p class="hero-eyebrow fade-in-up">Notes</p>
          <h1 class="page-title fade-in-up">笔记</h1>
          <div class="title-underline"></div>
          <p class="page-subtitle fade-in-up" style="animation-delay: 0.1s">
            把开发过程里值得留下来的判断、踩坑和阶段性结论沉淀下来，留给之后的自己，也留给后来者。
          </p>
        </div>
      </div>
    </section>

    <section class="section notes-section">
      <div class="container notes-shell">
        <div class="notes-toolbar">
          <label class="search-box" aria-label="搜索笔记">
            <svg class="toolbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              v-model.trim="keyword"
              type="search"
              class="search-input"
              placeholder="搜索标题、摘要、标签或正文"
            />
          </label>

          <div ref="filterWrap" class="filter-wrap">
            <button
              type="button"
              class="filter-button"
              :class="{ active: Boolean(activeRange) || Boolean(selectedMonth) }"
              @click="showDatePanel = !showDatePanel"
            >
              <svg class="toolbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <span>{{ dateFilterLabel }}</span>
            </button>

            <div v-if="showDatePanel" class="filter-panel">
              <div class="panel-header">
                <span class="panel-title">时间筛选</span>
                <button type="button" class="panel-clear" @click="resetDateFilter">清空</button>
              </div>

              <div class="quick-ranges">
                <button
                  v-for="option in quickRanges"
                  :key="option.value"
                  type="button"
                  class="quick-chip"
                  :class="{ active: activeRange === option.value }"
                  @click="applyQuickRange(option.value)"
                >
                  {{ option.label }}
                </button>
              </div>

              <label class="month-picker">
                <span class="month-label">按月份查看</span>
                <input v-model="selectedMonth" type="month" class="month-input" @input="activeRange = ''" />
              </label>
            </div>
          </div>
        </div>

        <div class="notes-headline">
          <div class="notes-count">
            <strong>{{ filteredNotes.length }}</strong>
            <span>篇笔记</span>
          </div>
          <p class="notes-hint">单列浏览更适合连续阅读，也方便先搜再筛。</p>
        </div>

        <div v-if="filteredNotes.length" class="notes-list">
          <article v-for="note in filteredNotes" :key="note.slug" class="note-card">
            <div class="note-main">
              <div class="note-topline">
                <span class="note-date">{{ note.dateLabel }}</span>
                <span class="note-reading">{{ note.readingTime }} 分钟阅读</span>
              </div>

              <h2 class="note-title">
                <RouterLink :to="`/note/${note.slug}`">{{ note.title }}</RouterLink>
              </h2>

              <p class="note-summary">{{ note.summary }}</p>

              <div v-if="note.tags.length" class="note-tags">
                <span v-for="tag in note.tags" :key="tag" class="note-tag">{{ tag }}</span>
              </div>
            </div>

            <div class="note-side">
              <RouterLink :to="`/note/${note.slug}`" class="note-link">阅读笔记</RouterLink>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">MD</div>
          <h2 class="empty-title">没有找到符合条件的笔记</h2>
          <p class="empty-desc">
            可以换个关键词，或者清空时间筛选再试试。笔记内容仍然来自 <code>src/content/notes</code>，新增 Markdown 文件后这里会自动更新。
          </p>
          <div class="empty-actions">
            <button type="button" class="empty-reset" @click="resetAllFilters">重置筛选</button>
            <RouterLink to="/doc" class="browse-docs-btn">先去看看知识库</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="section feedback-section">
      <div class="container feedback-layout">
        <div class="feedback-card">
          <p class="feedback-eyebrow">Feedback</p>
          <h2 class="feedback-title">这页也留个说话的地方</h2>
          <p class="feedback-desc">
            如果你对笔记分类、搜索方式，或者具体哪篇内容想补充想提问，都可以直接在这里留一句，或者去联系页发完整留言。
          </p>
          <div class="feedback-actions">
            <a href="#guestbook" class="feedback-primary">在下方留言</a>
            <RouterLink to="/contact" class="feedback-secondary">去联系页反馈</RouterLink>
          </div>
        </div>

        <div id="guestbook" class="guestbook-panel">
          <GuestbookSection />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GuestbookSection from '@/components/common/GuestbookSection.vue'
import { getAllNotes } from '@/utils/notes.js'

const route = useRoute()
const router = useRouter()

const quickRanges = [
  { label: '近 30 天', value: '30d' },
  { label: '近 90 天', value: '90d' },
  { label: '今年', value: 'year' }
]

const keyword = ref(typeof route.query.q === 'string' ? route.query.q : '')
const selectedMonth = ref(typeof route.query.month === 'string' ? route.query.month : '')
const activeRange = ref(typeof route.query.range === 'string' ? route.query.range : '')
const showDatePanel = ref(false)
const filterWrap = ref(null)
const notes = getAllNotes()

const filteredNotes = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  const now = new Date()

  return notes.filter((note) => {
    const matchesKeyword = !q || [note.title, note.summary, note.tags.join(' '), note.content]
      .some(item => item.toLowerCase().includes(q))

    const noteDate = note.date ? new Date(note.date) : null
    let matchesDate = true

    if (selectedMonth.value) {
      matchesDate = note.date?.startsWith(selectedMonth.value) ?? false
    } else if (activeRange.value && noteDate && !Number.isNaN(noteDate.getTime())) {
      const diff = now.getTime() - noteDate.getTime()
      const diffDays = diff / (1000 * 60 * 60 * 24)

      if (activeRange.value === '30d') matchesDate = diffDays <= 30
      if (activeRange.value === '90d') matchesDate = diffDays <= 90
      if (activeRange.value === 'year') matchesDate = noteDate.getFullYear() === now.getFullYear()
    } else if (activeRange.value && !noteDate) {
      matchesDate = false
    }

    return matchesKeyword && matchesDate
  })
})

const dateFilterLabel = computed(() => {
  if (selectedMonth.value) {
    const [year, month] = selectedMonth.value.split('-')
    return `${year} 年 ${month} 月`
  }

  const matched = quickRanges.find(option => option.value === activeRange.value)
  return matched ? matched.label : '时间筛选'
})

function applyQuickRange(value) {
  activeRange.value = value
  selectedMonth.value = ''
}

function resetDateFilter() {
  activeRange.value = ''
  selectedMonth.value = ''
}

function resetAllFilters() {
  keyword.value = ''
  resetDateFilter()
}

function handleClickOutside(event) {
  if (!filterWrap.value?.contains(event.target)) {
    showDatePanel.value = false
  }
}

watch([keyword, selectedMonth, activeRange], ([qValue, monthValue, rangeValue]) => {
  const nextQuery = { ...route.query }
  const q = qValue.trim()

  if (q) nextQuery.q = q
  else delete nextQuery.q

  if (monthValue) nextQuery.month = monthValue
  else delete nextQuery.month

  if (!monthValue && rangeValue) nextQuery.range = rangeValue
  else delete nextQuery.range

  router.replace({ query: nextQuery })
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.note-page {
  min-height: 100vh;
  padding-top: 64px;
  background:
    radial-gradient(circle at top, rgba(6, 182, 212, 0.08), transparent 32%),
    var(--bg-secondary);
}

.container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.page-hero {
  padding: calc(64px + 3.5rem) 0 2.5rem;
}

.hero-inner {
  display: flex;
  justify-content: center;
}

.hero-copy {
  max-width: 720px;
  text-align: center;
}

.hero-eyebrow {
  margin: 0 0 0.75rem;
  color: var(--accent);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.page-title {
  margin: 0 0 0.75rem;
  font-size: clamp(2rem, 3.4vw, 2.8rem);
  font-weight: 700;
}

.title-underline {
  width: 52px;
  height: 3px;
  margin: 0 auto 1rem;
  border-radius: 999px;
  background: var(--gradient-primary);
  transform: scaleX(0);
  animation: ulSlideIn 0.5s ease 0.1s forwards;
}

@keyframes ulSlideIn {
  to { transform: scaleX(1); }
}

.page-subtitle {
  margin: 0 auto;
  max-width: 640px;
  color: var(--text-secondary);
  line-height: 1.85;
}

.fade-in-up {
  animation: fadeInUp 0.5s ease both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section {
  padding: var(--space-12) 0 var(--space-20);
}

.notes-shell {
  display: grid;
  gap: 1.5rem;
}

.notes-toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: start;
}

.search-box,
.filter-button {
  height: 52px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--bg-card);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1rem;
}

.toolbar-icon {
  width: 18px;
  height: 18px;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  border: 0;
  background: transparent;
  color: var(--text-primary);
  font-size: 0.95rem;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.filter-wrap {
  position: relative;
}

.filter-button {
  min-width: 144px;
  padding: 0 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.filter-button.active,
.filter-button:hover {
  border-color: rgba(6, 182, 212, 0.4);
  transform: translateY(-1px);
}

.filter-panel {
  position: absolute;
  top: calc(100% + 0.75rem);
  right: 0;
  z-index: 20;
  width: min(320px, calc(100vw - 2rem));
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--bg-card);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.14);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.9rem;
}

.panel-title {
  font-size: 0.92rem;
  font-weight: 600;
}

.panel-clear {
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--accent);
  font-size: 0.85rem;
  cursor: pointer;
}

.quick-ranges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.quick-chip {
  height: 36px;
  padding: 0 0.85rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-chip.active,
.quick-chip:hover {
  border-color: rgba(6, 182, 212, 0.32);
  background: rgba(6, 182, 212, 0.1);
  color: var(--accent);
}

.month-picker {
  display: grid;
  gap: 0.55rem;
}

.month-label {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.month-input {
  width: 100%;
  height: 42px;
  padding: 0 0.75rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  outline: none;
}

.notes-headline {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
}

.notes-count {
  display: inline-flex;
  align-items: baseline;
  gap: 0.45rem;
  color: var(--text-secondary);
}

.notes-count strong {
  color: var(--text-primary);
  font-size: 1.35rem;
}

.notes-hint {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.notes-list {
  display: grid;
  gap: 1rem;
}

.note-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1.25rem;
  align-items: end;
  padding: 1.35rem 1.4rem;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--bg-card);
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.04);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.note-card:hover {
  transform: translateY(-2px);
  border-color: rgba(6, 182, 212, 0.38);
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.08);
}

.note-main {
  min-width: 0;
}

.note-topline {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-bottom: 0.9rem;
  color: var(--text-tertiary);
  font-size: 0.82rem;
}

.note-title {
  margin: 0 0 0.75rem;
  font-size: 1.24rem;
  line-height: 1.45;
}

.note-title a {
  color: var(--text-primary);
  text-decoration: none;
}

.note-title a:hover {
  color: var(--accent);
}

.note-summary {
  margin: 0 0 1rem;
  color: var(--text-secondary);
  line-height: 1.82;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.note-tag {
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: var(--accent-light);
  color: var(--accent);
  font-size: 0.8rem;
}

.note-side {
  display: flex;
  align-items: center;
}

.note-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 108px;
  height: 42px;
  padding: 0 1rem;
  border-radius: 999px;
  background: rgba(6, 182, 212, 0.12);
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
}

.note-link:hover {
  background: rgba(6, 182, 212, 0.18);
}

.empty-state {
  padding: 4rem 2rem;
  text-align: center;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: var(--bg-card);
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
  margin: 0 0 0.75rem;
}

.empty-desc {
  max-width: 620px;
  margin: 0 auto 1.5rem;
  color: var(--text-secondary);
  line-height: 1.8;
}

.empty-actions,
.feedback-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

.empty-reset,
.browse-docs-btn,
.feedback-primary,
.feedback-secondary {
  height: 44px;
  padding: 0 1.1rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-weight: 600;
}

.empty-reset {
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
}

.browse-docs-btn,
.feedback-primary {
  background: var(--accent);
  color: #fff;
}

.feedback-section {
  padding-top: 0;
}

.feedback-layout {
  display: grid;
  gap: 1.25rem;
}

.feedback-card,
.guestbook-panel {
  padding: 1.4rem;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: var(--bg-card);
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.04);
}

.feedback-eyebrow {
  margin: 0 0 0.6rem;
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
}

.feedback-title {
  margin: 0 0 0.75rem;
  font-size: 1.4rem;
}

.feedback-desc {
  margin: 0 0 1.2rem;
  color: var(--text-secondary);
  line-height: 1.8;
}

.feedback-secondary {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-primary);
}

[data-theme="dark"] .note-page {
  background:
    radial-gradient(circle at top, rgba(34, 197, 94, 0.08), transparent 32%),
    var(--bg-secondary);
}

[data-theme="dark"] .search-box,
[data-theme="dark"] .filter-button,
[data-theme="dark"] .filter-panel,
[data-theme="dark"] .note-card,
[data-theme="dark"] .feedback-card,
[data-theme="dark"] .guestbook-panel,
[data-theme="dark"] .empty-state {
  box-shadow: none;
}

[data-theme="dark"] .search-box,
[data-theme="dark"] .filter-button,
[data-theme="dark"] .filter-panel,
[data-theme="dark"] .note-card,
[data-theme="dark"] .feedback-card,
[data-theme="dark"] .guestbook-panel {
  background: rgba(15, 23, 42, 0.72);
}

@media (max-width: 820px) {
  .notes-toolbar,
  .notes-headline,
  .note-card {
    grid-template-columns: 1fr;
  }

  .notes-headline {
    align-items: start;
  }

  .filter-button {
    width: 100%;
  }

  .filter-panel {
    left: 0;
    right: auto;
  }

  .note-side {
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  .container {
    padding: 0 1rem;
  }

  .page-hero {
    padding: calc(64px + 2.5rem) 0 1.5rem;
  }

  .section {
    padding: 2.5rem 0 4rem;
  }

  .search-box,
  .filter-button {
    height: 48px;
  }

  .note-card,
  .feedback-card,
  .guestbook-panel {
    padding: 1.1rem;
  }

  .note-title {
    font-size: 1.08rem;
  }
}
</style>
