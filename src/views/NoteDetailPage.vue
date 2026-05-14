<template>
  <main class="note-detail-page">
    <div class="developing-state">
      <div class="developing-content">
        <span class="developing-badge">开发中</span>
        <div class="developing-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
          </svg>
        </div>
        <h1 class="developing-title">笔记详情</h1>
        <p class="developing-desc">
          笔记详情页正在开发中<br/>
          敬请期待
        </p>
        <RouterLink to="/note" class="back-link">
          ← 返回笔记列表
        </RouterLink>
      </div>
    </div>

    <div class="container">
      <CommentSection :page-id="`note-${$route.params.slug}`" />
    </div>
  </main>
</template>

<script setup>
import CommentSection from '@/components/common/CommentSection.vue'
</script>

<style scoped>
.note-detail-page {
  min-height: 100vh;
  padding-top: 64px;
  background: var(--bg-secondary);
}
.container { max-width: 800px; margin: 0 auto; padding: 0 var(--space-6); }
</style>