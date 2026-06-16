<template>
  <section class="hero-section" aria-labelledby="hero-heading">
    <div class="hero-ambient" aria-hidden="true"></div>
    <div class="hero-grid-soft" aria-hidden="true"></div>

    <div class="container hero-inner">
      <p class="hero-eyebrow fade-in-up">
        <span class="status-dot" aria-hidden="true"></span>
        <span>AI 可见性优化 · 独立数字工作室</span>
      </p>

      <h1 id="hero-heading" class="hero-title fade-in-up" style="animation-delay: 0.06s">
        让你的网站被 <span class="title-accent">AI</span><br class="hero-br" />
        真正<span class="title-accent">看懂</span>
      </h1>

      <p class="hero-lead fade-in-up" style="animation-delay: 0.12s">
        CNCG 帮助个人品牌、工作室和中小企业，把传统官网升级为 AI 可抓取、
        可理解、可引用的品牌信息源。从 AI 可见性体检到全套改造，一站式搞定。
      </p>

      <div class="hero-cta-row fade-in-up" style="animation-delay: 0.18s">
        <RouterLink to="/services" class="cta-primary">
          免费 AI 可见性体检
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </RouterLink>
        <RouterLink to="/services" class="cta-secondary">查看改造方案</RouterLink>
      </div>

      <nav class="hero-quick-nav fade-in-up" style="animation-delay: 0.24s" aria-label="快捷入口">
        <RouterLink to="/services/ai-visibility-audit">AI 体检</RouterLink>
        <span class="nav-sep" aria-hidden="true">·</span>
        <RouterLink to="/faq">常见问题</RouterLink>
        <span class="nav-sep" aria-hidden="true">·</span>
        <RouterLink to="/contact">联系咨询</RouterLink>
      </nav>

      <ul class="hero-offers fade-in-up" style="animation-delay: 0.3s">
        <li v-for="item in offers" :key="item.label">
          <RouterLink :to="item.to" class="offer-card">
            <span class="offer-label">{{ item.label }}</span>
            <span class="offer-value">{{ item.value }}</span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
const offers = [
  { label: '定制开发', value: '¥2,000 起', to: '/services' },
  { label: '标品商店', value: '闲鱼担保', to: '/shop' },
  { label: '上线清单', value: '免费工具', to: '/tools/site-checklist' },
]
</script>

<style scoped>
.hero-section {
  position: relative;
  overflow: hidden;
  padding: calc(64px + clamp(2.5rem, 8vw, 4.5rem)) 0 clamp(2.5rem, 6vw, 4rem);
  min-height: min(88vh, 720px);
  display: flex;
  align-items: center;
}

.hero-ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 80% 50% at 10% 0%, rgba(6, 182, 212, 0.09) 0%, transparent 55%),
    radial-gradient(ellipse 60% 45% at 90% 20%, rgba(124, 58, 237, 0.06) 0%, transparent 50%),
    var(--bg-primary);
}

[data-theme="dark"] .hero-ambient {
  background:
    radial-gradient(ellipse 70% 45% at 15% 5%, rgba(74, 222, 128, 0.08) 0%, transparent 55%),
    radial-gradient(ellipse 55% 40% at 85% 25%, rgba(6, 182, 212, 0.06) 0%, transparent 50%),
    var(--bg-primary);
}

.hero-grid-soft {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.45;
  background-image:
    linear-gradient(var(--border-subtle) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, transparent 85%);
  -webkit-mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, transparent 85%);
}

[data-theme="dark"] .hero-grid-soft {
  opacity: 0.2;
}

.hero-inner {
  position: relative;
  z-index: 1;
  max-width: 640px;
  margin: 0 auto;
  padding-inline: max(var(--space-4), env(safe-area-inset-left, 0px))
    max(var(--space-4), env(safe-area-inset-right, 0px));
}

@media (min-width: 900px) {
  .hero-inner {
    margin: 0;
    margin-left: max(0px, calc((100% - 1200px) / 2 + var(--space-6)));
    text-align: left;
  }
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.25rem;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
  animation: pulse-dot 2.2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.65; transform: scale(0.92); }
}

.hero-title {
  margin: 0 0 1rem;
  font-size: clamp(2.125rem, 5.5vw, 3.25rem);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: var(--letter-tighter);
  color: var(--text-primary);
}

.title-accent {
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-br {
  display: none;
}

@media (min-width: 480px) {
  .hero-br { display: inline; }
}

.hero-lead {
  margin: 0 0 1.75rem;
  font-size: clamp(0.9375rem, 2.2vw, 1.0625rem);
  line-height: 1.65;
  color: var(--text-secondary);
  max-width: 36rem;
}

.hero-cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.cta-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.8rem 1.5rem;
  background: var(--accent);
  color: #fff;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: background var(--duration-normal) ease, transform var(--duration-fast) ease, box-shadow var(--duration-normal) ease;
}

.cta-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: var(--glow-accent-sm);
}

.cta-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.35rem;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-full);
  font-weight: 500;
  font-size: 0.9375rem;
  color: var(--text-primary);
  text-decoration: none;
  background: var(--bg-card);
  transition: border-color var(--duration-fast) ease, color var(--duration-fast) ease;
}

.cta-secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.hero-quick-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.875rem;
}

.hero-quick-nav a {
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--duration-fast) ease;
}

.hero-quick-nav a:hover {
  color: var(--accent);
}

.nav-sep {
  color: var(--border);
  user-select: none;
}

.hero-offers {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.65rem;
}

.offer-card {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.85rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: border-color var(--duration-normal) ease, box-shadow var(--duration-normal) ease;
}

.offer-card:hover {
  border-color: rgba(6, 182, 212, 0.35);
  box-shadow: var(--shadow-sm);
}

.offer-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
}

.offer-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.fade-in-up {
  animation: fadeInUp 0.55s var(--ease-out) both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: auto;
    padding-top: calc(64px + 2rem);
    padding-bottom: 2rem;
  }

  .hero-inner {
    text-align: center;
  }

  .hero-eyebrow {
    justify-content: center;
  }

  .hero-lead {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-cta-row {
    flex-direction: column;
    align-items: stretch;
  }

  .cta-primary,
  .cta-secondary {
    width: 100%;
  }

  .hero-quick-nav {
    justify-content: center;
  }

  .hero-offers {
    grid-template-columns: 1fr;
    text-align: left;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fade-in-up {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .status-dot {
    animation: none;
  }

  .cta-primary:hover {
    transform: none;
  }
}
</style>
