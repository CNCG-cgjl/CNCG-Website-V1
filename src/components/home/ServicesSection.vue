<template>
  <section class="section section-alt" id="services">
    <div class="container">
      <!-- 区块标题 -->
      <div class="section-header">
        <h2 class="section-title" ref="titleRef" :class="{ visible: titleVisible }">AI 可见性服务</h2>
        <p class="section-desc">从诊断到改造，让你的网站被 AI 准确理解</p>
        <div class="section-quick-links fade-in-up" :class="{ visible: titleVisible }">
          <RouterLink to="/services" class="quick-link">定制报价 →</RouterLink>
          <RouterLink to="/shop" class="quick-link quick-link-accent">闲鱼商店 →</RouterLink>
          <RouterLink to="/tools" class="quick-link">免费工具 →</RouterLink>
          <RouterLink to="/contact" class="quick-link">联系咨询 →</RouterLink>
        </div>
      </div>

      <!-- 4 张服务卡片（升级版） -->
      <div class="services-grid">
        <div
          v-for="(svc, i) in services"
          :key="svc.id"
          class="service-card"
          :class="{ visible: cardsVisible }"
          :style="{ animationDelay: `${i * 0.1}s` }"
        >
          <!-- 顶部渐变装饰条 -->
          <span class="card-accent-bar"></span>
          <div class="svc-icon-wrap">
            <span class="svc-number">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="svc-icon" v-html="svc.icon"></span>
          </div>
          <h3 class="svc-title">{{ svc.title }}</h3>
          <p class="svc-desc">{{ svc.desc }}</p>
          <div class="svc-tags">
            <span v-for="tag in svc.tags" :key="tag" class="svc-tag">{{ tag }}</span>
          </div>
        </div>
      </div>

      <div class="flow-cta-bar" ref="flowRef" :class="{ visible: flowVisible }">
        <p class="flow-cta-text">有项目需求？查看完整服务说明与交付流程</p>
        <div class="flow-cta-actions">
          <RouterLink to="/services" class="btn-primary flow-cta">查看服务详情</RouterLink>
          <RouterLink to="/contact" class="btn-secondary flow-cta-secondary">联系咨询</RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver.js'

const titleRef = ref(null)
const flowRef  = ref(null)
const { isVisible: titleVisible } = useIntersectionObserver(titleRef, { threshold: 0.2 })
const { isVisible: cardsVisible } = useIntersectionObserver(titleRef, { threshold: 0.1 })
const { isVisible: flowVisible  } = useIntersectionObserver(flowRef,  { threshold: 0.2 })

const services = [
  {
    id: 1,
    title: 'AI 可见性体检',
    desc: '从概念到部署，提供完整的前端与全栈开发服务，构建高性能、现代化的 Web 应用。',
    tags: ['Vue 3', 'React', 'Node.js', 'Vercel'],
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  },
  {
    id: 2,
    title: 'AI-ready 网站改造',
    desc: '专业的文案撰写、排版设计与内容策划，帮助您的品牌发声，触达目标用户。',
    tags: ['博客文章', '飞书文档', '产品文案', '落地页'],
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  },
  {
    id: 3,
    title: '结构化内容重构',
    desc: '提供技术选型建议、架构方案评审与问题排查，降低您的技术决策风险。',
    tags: ['技术选型', '架构设计', '性能优化', '问题诊断'],
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  },
  {
    id: 4,
    title: 'JSON-LD / Schema',
    desc: '精选模板、工具与定制服务，通过闲鱼店铺便捷购买，快速解决您的实际需求。',
    tags: ['网站模板', '实用工具', '定制开发', '闲鱼店铺'],
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
  },
]

</script>

<style scoped>
/* ── 区块标题 ── */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}
.section-title {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 700;
  letter-spacing: var(--letter-tight);
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  opacity: 0;
  transform: translateY(16px);
  transition: all 0.5s var(--ease-out);
}
.section-title.visible {
  opacity: 1;
  transform: none;
}
.section-desc {
  font-size: 1rem;
  color: var(--text-secondary);
  max-width: 480px;
  margin: 0 auto 1.25rem;
}

.section-quick-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 0.75rem;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.5s var(--ease-out);
}
.section-quick-links.visible {
  opacity: 1;
  transform: none;
}
.quick-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0.4rem 0.85rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  transition: color var(--duration-fast) ease, border-color var(--duration-fast) ease, background var(--duration-fast) ease;
}
.quick-link:hover {
  color: var(--accent);
  border-color: rgba(6, 182, 212, 0.35);
  background: rgba(6, 182, 212, 0.06);
}
.quick-link-accent {
  border-color: rgba(6, 182, 212, 0.35);
  color: var(--accent);
}

/* =============================================
   服务卡片 — 升级版：顶部装饰条 + 悬浮光晕 + 图标动效
   ============================================= */
.services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 4rem;
}
.service-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 1.75rem 1.5rem;
  transition: all var(--duration-slow) var(--ease-out);
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  /* 禁止文字选中，保持动效不变 */
  user-select: none;
  -webkit-user-select: none;
}
.service-card.visible {
  opacity: 1;
  transform: none;
  animation: fadeInUp 0.5s var(--ease-out) both;
}

/* 顶部渐变装饰条 — hover 时从左滑入 */
.card-accent-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--gradient-primary);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--duration-slow) var(--ease-out);
}
.service-card:hover .card-accent-bar {
  transform: scaleX(1);
}

/* 悬浮光晕 */
.service-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-glow);
  opacity: 0;
  transition: opacity var(--duration-slow) ease;
  pointer-events: none;
  border-radius: inherit;
}
.service-card:hover::after {
  opacity: 1;
}

.service-card:hover {
  border-color: var(--accent);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-6px);
}
[data-theme="dark"] .service-card:hover {
  box-shadow:
    var(--shadow-card-hover),
    0 0 30px rgba(74, 222, 128, 0.06);
}

.svc-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}
.svc-number {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.08em;
}

/* 图标容器 — hover 弹性旋转 */
.svc-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--accent-light);
  border-radius: 12px;
  color: var(--accent-text);
  transition: all var(--duration-slow) var(--ease-bounce);
}
[data-theme="dark"] .svc-icon { color: var(--accent); }
.service-card:hover .svc-icon {
  transform: scale(1.1) rotate(-5deg);
  box-shadow: var(--glow-accent-sm);
}

.svc-title {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.625rem;
}
.svc-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.65;
  margin-bottom: 1rem;
}
.svc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}
.svc-tag {
  padding: 0.2rem 0.625rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.flow-cta-bar {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-2xl);
  padding: 1.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  flex-wrap: wrap;
  opacity: 0;
  transform: translateY(16px);
  transition: all 0.5s var(--ease-out) 0.15s;
}
.flow-cta-bar.visible {
  opacity: 1;
  transform: none;
}
.flow-cta-text {
  margin: 0;
  font-size: 1rem;
  color: var(--text-secondary);
  max-width: 28rem;
}
.flow-cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.5rem;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--border);
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: border-color var(--duration-fast) ease, color var(--duration-fast) ease;
}
.btn-secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.flow-cta-secondary { text-align: center; }

@media (max-width: 640px) {
  .flow-cta-bar {
    flex-direction: column;
    align-items: stretch;
    padding: 1.25rem;
  }
  .flow-cta-actions { flex-direction: column; }
  .flow-cta,
  .flow-cta-secondary { width: 100%; }
}

/* =============================================
   流程步骤 — 旧版样式保留（其他页可能引用）
   ============================================= */
.flow-section {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-2xl);
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(16px);
  transition: all 0.5s var(--ease-out) 0.2s;
  user-select: none;
  -webkit-user-select: none;
}
.flow-section.visible {
  opacity: 1;
  transform: none;
}
.flow-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.flow-header .section-title {
  margin: 0;
  opacity: 1;
  transform: none;
  font-size: 1.375rem;
}
.flow-cta {
  font-size: 0.875rem;
  padding: 0.625rem 1.5rem;
  text-align: center;
}

@media (max-width: 640px) {
  .flow-header {
    flex-direction: column;
    align-items: stretch;
  }

  .flow-cta {
    width: 100%;
    justify-content: center;
  }

  .flow-section {
    padding: 1.25rem;
  }
}

.flow-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  position: relative;
}
.flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  padding: 0 1rem;
}

/* 圆形编号 — 加大到 56px + 外环光晕 */
.step-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--bg-primary);
  border: 2px solid transparent;
  /* 渐变边框用背景模拟 */
  background-image:
    linear-gradient(var(--bg-primary), var(--bg-primary)),
    var(--gradient-border);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  margin-bottom: 0.875rem;
  flex-shrink: 0;
  position: relative;
  /* 外环光晕 */
  box-shadow:
    0 0 0 4px rgba(34, 197, 94, 0.06),
    0 0 0 8px rgba(34, 197, 94, 0.03);
  transition: all var(--duration-slow) var(--ease-bounce);
}
[data-theme="dark"] .step-circle {
  background-image:
    linear-gradient(var(--bg-card), var(--bg-card)),
    var(--gradient-border);
  box-shadow:
    0 0 0 4px rgba(74, 222, 128, 0.08),
    0 0 0 8px rgba(74, 222, 128, 0.04);
}
.step-circle:hover {
  transform: scale(1.1);
  box-shadow:
    0 0 0 4px rgba(34, 197, 94, 0.12),
    0 0 0 8px rgba(34, 197, 94, 0.06),
    var(--glow-accent-sm);
}
[data-theme="dark"] .step-circle:hover {
  box-shadow:
    0 0 0 4px rgba(74, 222, 128, 0.14),
    0 0 0 8px rgba(74, 222, 128, 0.07),
    var(--glow-accent-sm);
}

/* 编号文字 — 渐变色 */
.step-num {
  font-size: 1.25rem;
  font-weight: 800;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.step-body {}
.step-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.375rem;
}
.step-desc {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 连接线 — 向右流光动画 */
.step-connector {
  position: absolute;
  top: 27px; /* 56/2 ≈ 28, 微调居中 */
  left: calc(50% + 32px);
  right: calc(-50% + 32px);
  height: 2px;
  background:
    linear-gradient(
      90deg,
      var(--accent-light) 0%,
      var(--accent) 25%,
      #06b6d4 50%,
      var(--accent) 75%,
      var(--accent-light) 100%
    );
  background-size: 200% 100%;
  opacity: 0.45;
  animation: connectorFlowRight 3s linear infinite;
}
[data-theme="dark"] .step-connector {
  opacity: 0.35;
}

@keyframes connectorFlowRight {
  0%   { background-position: -200% 0%; }
  100% { background-position: 200% 0%; }
}

/* 响应式 */
@media (max-width: 1024px) {
  .services-grid { grid-template-columns: repeat(2, 1fr); }
  .flow-steps { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; row-gap: 2rem; }
  .step-connector { display: none; }
}
@media (max-width: 640px) {
  .services-grid { grid-template-columns: 1fr; }
  .flow-steps { grid-template-columns: 1fr; }
  .flow-section { padding: 1.5rem; }
  .step-circle { width: 48px; height: 48px; }
}
</style>
