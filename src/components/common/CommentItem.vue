<template>
  <div class="comment-item">
    <div class="comment-avatar">
      {{ comment.author_name?.charAt(0)?.toUpperCase() || '?' }}
    </div>
    <div class="comment-body">
      <div class="comment-header">
        <span class="comment-author">{{ comment.author_name }}</span>
        <span class="comment-time">{{ timeAgo }}</span>
      </div>
      <p class="comment-content">{{ comment.content }}</p>
      <button class="reply-btn" @click="$emit('reply', comment)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 00-4-4H4"/></svg>
        回复
      </button>

      <div v-if="comment.children?.length" class="replies">
        <CommentItem
          v-for="child in comment.children"
          :key="child.id"
          :comment="child"
          @reply="$emit('reply', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  comment: { type: Object, required: true }
})

defineEmits(['reply'])

const timeAgo = computed(() => {
  const date = new Date(props.comment.created_at)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`
  if (diff < 2592000) return `${Math.floor(diff / 86400)} 天前`

  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
})
</script>

<style scoped>
.comment-item { display: flex; gap: 0.75rem; padding: 0.85rem 0; }
.comment-avatar {
  flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%;
  background: var(--accent); color: white; display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem; font-weight: 700;
}
.comment-body { flex: 1; min-width: 0; }
.comment-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem; }
.comment-author { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); }
.comment-time { font-size: 0.72rem; color: var(--text-muted); }
.comment-content { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 0.35rem; word-break: break-word; }
.reply-btn {
  display: inline-flex; align-items: center; gap: 0.3rem;
  background: none; border: none; color: var(--text-muted);
  font-size: 0.75rem; cursor: pointer; transition: color 0.2s;
}
.reply-btn:hover { color: var(--accent); }
.replies { margin-left: 0.5rem; padding-left: 1rem; border-left: 2px solid var(--border); }
</style>