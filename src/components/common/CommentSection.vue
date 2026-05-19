<template>
  <section class="comment-section">
    <h3 class="section-title">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      评论 ({{ flatCount }})
    </h3>

    <div v-if="!isSupabaseReady" class="not-configured">
      <p>评论功能配置中，敬请期待</p>
    </div>

    <template v-else>
      <form class="comment-form" @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-field">
            <input v-model="form.authorName" type="text" placeholder="昵称 *" required maxlength="30" class="field-input" />
          </div>
          <div class="form-field">
            <input v-model="form.authorEmail" type="email" placeholder="邮箱（不公开）" maxlength="100" class="field-input" />
          </div>
        </div>
        <input v-model="form.website" type="text" tabindex="-1" autocomplete="off" class="hp-field" aria-hidden="true" />
        <div class="form-field">
          <textarea v-model="form.content" placeholder="写下你的评论... *" required maxlength="1000" rows="3" class="field-textarea"></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="submit-btn" :disabled="submitting">
            {{ submitting ? '提交中...' : '发表评论' }}
          </button>
          <span v-if="form.content" class="char-count">{{ form.content.length }}/1000</span>
        </div>
      </form>

      <transition name="fade">
        <div v-if="successMsg" class="success-toast">{{ successMsg }}</div>
      </transition>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <span>加载评论中...</span>
      </div>

      <div v-else-if="organizedComments.length" class="comments-list">
        <CommentItem
          v-for="comment in organizedComments"
          :key="comment.id"
          :comment="comment"
          @reply="handleReply"
        />
      </div>

      <div v-else class="empty-state">
        <p>还没有评论，来抢沙发吧 🎉</p>
      </div>

      <transition name="fade">
        <div v-if="replyTo" class="reply-bar">
          <span>回复 {{ replyTo.author_name }}</span>
          <button class="cancel-reply" @click="replyTo = null">取消</button>
        </div>
      </transition>
    </template>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { isSupabaseReady } from '@/lib/supabase'
import { useComments } from '@/composables/useComments'
import CommentItem from './CommentItem.vue'

const props = defineProps({
  pageId: { type: String, required: true }
})

const { fetchComments, addComment, organizeComments } = useComments()

const loading = ref(false)
const submitting = ref(false)
const comments = ref([])
const replyTo = ref(null)
const successMsg = ref('')

const form = ref({
  authorName: '',
  authorEmail: '',
  content: '',
  website: ''
})

const organizedComments = computed(() => organizeComments(comments.value))

const flatCount = computed(() => comments.value.length)

async function loadComments() {
  loading.value = true
  comments.value = await fetchComments(props.pageId)
  loading.value = false
}

async function handleSubmit() {
  if (!form.value.authorName.trim() || !form.value.content.trim()) return

  submitting.value = true
  successMsg.value = ''

  try {
    const newComment = await addComment(props.pageId, {
      authorName: form.value.authorName,
      authorEmail: form.value.authorEmail,
      content: form.value.content,
      parentId: replyTo.value?.id || null,
      website: form.value.website
    })

    comments.value.push({
      ...newComment,
      is_approved: false
    })

    form.value.content = ''
    form.value.website = ''
    replyTo.value = null
    successMsg.value = '评论已提交，审核后将显示 ✨'
    setTimeout(() => { successMsg.value = '' }, 5000)
  } catch (err) {
    alert('评论失败: ' + err.message)
  } finally {
    submitting.value = false
  }
}

function handleReply(comment) {
  replyTo.value = comment
  form.value.content = `@${comment.author_name} `
}

onMounted(loadComments)
</script>

<style scoped>
.comment-section { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--border); }
.section-title { display: flex; align-items: center; gap: 0.5rem; font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 1.5rem; }
.not-configured { text-align: center; padding: 2rem; color: var(--text-muted); background: var(--bg-secondary); border-radius: var(--radius-lg); }

.comment-form { margin-bottom: 1.5rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem; }
@media (max-width: 560px) { .form-row { grid-template-columns: 1fr; } }
.form-field { margin-bottom: 0.5rem; }
.field-input, .field-textarea {
  width: 100%; padding: 0.6rem 0.85rem; background: var(--bg-secondary);
  border: 1.5px solid var(--border); border-radius: var(--radius-md);
  font-size: 0.85rem; color: var(--text-primary); outline: none;
  transition: border-color 0.2s, box-shadow 0.2s; font-family: inherit;
}
.hp-field {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
.field-input:focus, .field-textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(6,182,212,0.15); }
.field-input::placeholder, .field-textarea::placeholder { color: var(--text-muted); }
.field-textarea { resize: vertical; min-height: 80px; line-height: 1.6; }
.form-actions { display: flex; align-items: center; gap: 0.75rem; }
.submit-btn {
  padding: 0.55rem 1.25rem; background: var(--accent); color: white;
  border: none; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.submit-btn:hover:not(:disabled) { background: var(--accent-hover); transform: translateY(-1px); }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.char-count { font-size: 0.75rem; color: var(--text-muted); }

.success-toast {
  display: flex; align-items: center; gap: 0.5rem;
  margin-bottom: 1rem; padding: 0.7rem 1rem;
  background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.25);
  border-radius: var(--radius-md); color: #16a34a; font-size: 0.85rem;
}

.loading-state { display: flex; align-items: center; gap: 0.75rem; padding: 2rem; color: var(--text-muted); justify-content: center; }
.spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.comments-list { display: flex; flex-direction: column; gap: 0.25rem; }
.empty-state { text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.9rem; }

.reply-bar {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.5rem 0.85rem; background: var(--bg-secondary);
  border-radius: var(--radius-md); font-size: 0.82rem; color: var(--text-secondary);
  margin-bottom: 0.75rem;
}
.cancel-reply { background: none; border: none; color: var(--accent); cursor: pointer; font-size: 0.82rem; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
