<template>
  <section class="guestbook-section">
    <h3 class="section-title">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 3a2.85 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
      留言板
    </h3>

    <div v-if="!isSupabaseReady" class="not-configured">
      <p>留言功能配置中，敬请期待</p>
    </div>

    <template v-else>
      <form class="guestbook-form" @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-field">
            <input v-model="form.authorName" type="text" placeholder="你的昵称 *" required maxlength="30" class="field-input" />
          </div>
          <div class="form-field">
            <button type="submit" class="submit-btn" :disabled="submitting">
              {{ submitting ? '发送中...' : '留下足迹 ✨' }}
            </button>
          </div>
        </div>
        <input v-model="form.website" type="text" tabindex="-1" autocomplete="off" class="hp-field" aria-hidden="true" />
        <div class="form-field">
          <textarea v-model="form.content" placeholder="写点什么吧... *" required maxlength="500" rows="2" class="field-textarea"></textarea>
          <span v-if="form.content" class="char-count">{{ form.content.length }}/500</span>
        </div>
      </form>

      <transition name="fade">
        <div v-if="successMsg" class="success-toast">{{ successMsg }}</div>
      </transition>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <span>加载留言中...</span>
      </div>

      <div v-else-if="messages.length" class="messages-grid">
        <div v-for="msg in messages" :key="msg.id" class="message-card">
          <div class="message-avatar">{{ msg.author_name?.charAt(0)?.toUpperCase() || '?' }}</div>
          <div class="message-body">
            <div class="message-header">
              <span class="message-author">{{ msg.author_name }}</span>
              <span class="message-time">{{ formatTime(msg.created_at) }}</span>
            </div>
            <p class="message-content">{{ msg.content }}</p>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>还没有留言，成为第一个留言的人吧 🎉</p>
      </div>
    </template>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { isSupabaseReady } from '@/lib/supabase'
import { useGuestbook } from '@/composables/useGuestbook'

const { fetchMessages, addMessage } = useGuestbook()

const loading = ref(false)
const submitting = ref(false)
const messages = ref([])
const successMsg = ref('')

const form = ref({ authorName: '', content: '', website: '' })

async function loadMessages() {
  loading.value = true
  messages.value = await fetchMessages()
  loading.value = false
}

async function handleSubmit() {
  if (!form.value.authorName.trim() || !form.value.content.trim()) return

  submitting.value = true
  successMsg.value = ''

  try {
    const newMsg = await addMessage({
      authorName: form.value.authorName,
      content: form.value.content,
      website: form.value.website
    })

    messages.value.unshift({ ...newMsg, is_approved: false })
    form.value.content = ''
    form.value.website = ''
    successMsg.value = '留言已提交，审核后将显示 ✨'
    setTimeout(() => { successMsg.value = '' }, 5000)
  } catch (err) {
    alert('留言失败: ' + err.message)
  } finally {
    submitting.value = false
  }
}

function formatTime(ts) {
  const date = new Date(ts)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`
  if (diff < 2592000) return `${Math.floor(diff / 86400)} 天前`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

onMounted(loadMessages)
</script>

<style scoped>
.guestbook-section { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--border); }
.section-title { display: flex; align-items: center; gap: 0.5rem; font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 1.5rem; }
.not-configured { text-align: center; padding: 2rem; color: var(--text-muted); background: var(--bg-secondary); border-radius: var(--radius-lg); }

.guestbook-form { margin-bottom: 1.5rem; }
.form-row { display: flex; gap: 0.75rem; align-items: flex-end; margin-bottom: 0.5rem; }
.form-field { flex: 1; position: relative; margin-bottom: 0.5rem; }
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
.field-textarea { resize: vertical; min-height: 60px; line-height: 1.6; }
.char-count { position: absolute; right: 0.5rem; bottom: 0.5rem; font-size: 0.7rem; color: var(--text-muted); }
.submit-btn {
  padding: 0.55rem 1.25rem; background: var(--accent); color: white;
  border: none; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.submit-btn:hover:not(:disabled) { background: var(--accent-hover); transform: translateY(-1px); }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.success-toast {
  display: flex; align-items: center; gap: 0.5rem;
  margin-bottom: 1rem; padding: 0.7rem 1rem;
  background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.25);
  border-radius: var(--radius-md); color: #16a34a; font-size: 0.85rem;
}

.loading-state { display: flex; align-items: center; gap: 0.75rem; padding: 2rem; color: var(--text-muted); justify-content: center; }
.spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.messages-grid { display: grid; gap: 0.75rem; }
.message-card {
  display: flex; gap: 0.75rem; padding: 1rem;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-lg); transition: border-color 0.2s;
}
.message-card:hover { border-color: var(--accent); }
.message-avatar {
  flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), #8b5cf6);
  color: white; display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem; font-weight: 700;
}
.message-body { flex: 1; min-width: 0; }
.message-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; }
.message-author { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); }
.message-time { font-size: 0.72rem; color: var(--text-muted); }
.message-content { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.7; word-break: break-word; }

.empty-state { text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.9rem; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
