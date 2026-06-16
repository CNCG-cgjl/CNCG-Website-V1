<template>
  <main class="checklist-page">
    <section class="page-hero">
      <div class="container">
        <RouterLink to="/tools" class="back-link">← 全部工具</RouterLink>
        <h1 class="page-title">网站上线检查清单</h1>
        <p class="page-subtitle">
          发布前自检，勾选进度保存在本机（{{ checkedCount }}/{{ totalCount }}，{{ progressPercent }}%）
        </p>
        <div class="progress-bar" role="progressbar" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100">
          <span class="progress-fill" :style="{ width: progressPercent + '%' }"></span>
        </div>
        <button type="button" class="reset-btn" @click="resetAll">重置全部勾选</button>
      </div>
    </section>

    <section class="section">
      <div class="container checklist-layout">
        <article v-for="group in groups" :key="group.id" class="check-group">
          <h2 class="group-title">{{ group.title }}</h2>
          <ul class="check-list">
            <li v-for="item in group.items" :key="item.id" class="check-item">
              <label class="check-label">
                <input
                  type="checkbox"
                  :checked="isChecked(item.id)"
                  @change="toggle(item.id)"
                />
                <span class="check-text">
                  <strong>{{ item.label }}</strong>
                  <span v-if="item.hint" class="check-hint">{{ item.hint }}</span>
                </span>
              </label>
            </li>
          </ul>
        </article>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container upsell-box">
        <h2 class="upsell-title">清单都过了，还需要人手？</h2>
        <p class="upsell-desc">可提供 Vue 站点搭建、飞书知识库同步、VPS + Vercel 混合部署与表单接入。</p>
        <div class="upsell-actions">
          <RouterLink to="/services" class="btn-primary">查看服务报价</RouterLink>
          <RouterLink to="/contact" class="btn-secondary">联系咨询</RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const STORAGE_KEY = 'cncg-site-checklist-v1'

const groups = [
  {
    id: 'domain',
    title: '域名与访问',
    items: [
      { id: 'domain-dns', label: '域名 DNS 已指向正确服务器', hint: 'A/CNAME 记录生效，www 与非 www 策略明确' },
      { id: 'domain-https', label: 'HTTPS 证书有效', hint: '浏览器无 mixed content 警告' },
      { id: 'domain-www', label: 'www / 非 www 重定向一致', hint: '避免重复收录' },
    ],
  },
  {
    id: 'mobile',
    title: '移动端体验',
    items: [
      { id: 'mobile-layout', label: '手机竖屏无横向滚动', hint: '重点看首页、长文、表格' },
      { id: 'mobile-safe', label: '左右留白正常（含刘海屏）', hint: 'safe-area 不被内容贴边' },
      { id: 'mobile-cta', label: '主按钮可点、导航菜单可用', hint: '联系/购买路径 ≤3 步' },
    ],
  },
  {
    id: 'content',
    title: '内容与 SEO',
    items: [
      { id: 'seo-title', label: '各页 title / description 已设置', hint: '分享链接预览正常' },
      { id: 'seo-sitemap', label: 'sitemap.xml / robots.txt 可访问', hint: '' },
      { id: 'content-404', label: '404 页友好，无死链', hint: '' },
    ],
  },
  {
    id: 'form',
    title: '表单与数据',
    items: [
      { id: 'form-contact', label: '联系表单提交成功', hint: '飞书 Bitable 或邮箱能收到' },
      { id: 'form-spam', label: '蜜罐 / 限流已开启', hint: '避免垃圾提交' },
      { id: 'form-privacy', label: '不展示用户私密信息', hint: '评论/留言审核策略明确' },
    ],
  },
  {
    id: 'ops',
    title: '部署与运维',
    items: [
      { id: 'ops-build', label: '生产构建无报错，dist 体积正常', hint: '避免空包覆盖线上' },
      { id: 'ops-env', label: 'API 环境变量已在 Vercel 配置', hint: '变更后已 Redeploy' },
      { id: 'ops-backup', label: '有关键数据备份方案', hint: 'Supabase / 飞书表' },
    ],
  },
]

const checked = ref(new Set())

const allIds = computed(() =>
  groups.flatMap(g => g.items.map(i => i.id))
)

const totalCount = computed(() => allIds.value.length)
const checkedCount = computed(() => checked.value.size)
const progressPercent = computed(() =>
  totalCount.value ? Math.round((checkedCount.value / totalCount.value) * 100) : 0
)

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const list = JSON.parse(raw)
    if (Array.isArray(list)) checked.value = new Set(list)
  } catch {
    checked.value = new Set()
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked.value]))
}

function isChecked(id) {
  return checked.value.has(id)
}

function toggle(id) {
  const next = new Set(checked.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  checked.value = next
  save()
}

function resetAll() {
  if (!confirm('确定清空所有勾选？')) return
  checked.value = new Set()
  save()
}

onMounted(load)
</script>

<style scoped>
.checklist-page { padding-top: 64px; }
.page-hero {
  padding: var(--space-12) 0 var(--space-8);
  text-align: center;
}
.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--text-muted);
  text-decoration: none;
}
.back-link:hover { color: var(--accent); }
.page-title {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}
.page-subtitle {
  color: var(--text-secondary);
  margin-bottom: 1.25rem;
}
.progress-bar {
  max-width: 400px;
  height: 8px;
  margin: 0 auto 1rem;
  background: var(--bg-secondary);
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid var(--border);
}
.progress-fill {
  display: block;
  height: 100%;
  background: var(--gradient-primary);
  border-radius: 999px;
  transition: width 0.35s var(--ease-out);
}
.reset-btn {
  font-size: 0.8125rem;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
}
.reset-btn:hover { color: var(--accent); }
.checklist-layout {
  display: grid;
  gap: 1.5rem;
  max-width: 720px;
  margin: 0 auto;
}
.check-group {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 1.25rem 1.35rem;
}
.group-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: var(--text-primary);
}
.check-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.check-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
}
.check-label input {
  width: 18px;
  height: 18px;
  margin-top: 0.15rem;
  flex-shrink: 0;
  accent-color: var(--accent);
}
.check-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.9375rem;
  color: var(--text-primary);
  line-height: 1.45;
}
.check-hint {
  font-size: 0.8125rem;
  color: var(--text-muted);
  font-weight: 400;
}
.section-alt { background: var(--bg-secondary); }
.upsell-box { text-align: center; max-width: 520px; margin: 0 auto; }
.upsell-title { font-size: 1.25rem; margin: 0 0 0.5rem; color: var(--text-primary); }
.upsell-desc { color: var(--text-secondary); margin: 0 0 1.25rem; line-height: 1.6; }
.upsell-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}
.btn-primary {
  display: inline-flex;
  padding: 0.65rem 1.35rem;
  background: var(--accent);
  color: #fff;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
}
.btn-secondary {
  display: inline-flex;
  padding: 0.65rem 1.35rem;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  color: var(--text-primary);
  text-decoration: none;
}
.btn-secondary:hover { border-color: var(--accent); color: var(--accent); }

@media (max-width: 640px) {
  .check-group { padding: 1rem; }
  .upsell-actions { flex-direction: column; }
  .btn-primary,
  .btn-secondary { width: 100%; justify-content: center; }
}
</style>
