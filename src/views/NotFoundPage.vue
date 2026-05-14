<template>
  <div class="not-found-page">
    <!-- 背景装饰 -->
    <div class="nf-bg-grid" aria-hidden="true"></div>
    <div class="nf-bg-glow" aria-hidden="true"></div>

    <!-- 主内容 -->
    <div class="nf-content">
      <!-- 404 数字艺术化 -->
      <div class="nf-code-wrap">
        <span class="nf-digit" style="--d: 0; --delay: 0s">4</span>
        <span class="nf-digit nf-digit-zero" style="--d: 1; --delay: 0.15s">
          <span class="zero-ring"></span>
          0
        </span>
        <span class="nf-digit" style="--d: 2; --delay: 0.3s">4</span>
      </div>

      <!-- 信息区 -->
      <h1 class="nf-title">页面不存在</h1>
      <p class="nf-desc">你来到了一片未知的数字领域<br/>或许该页面已迁移至其他维度</p>

      <!-- 操作按钮组 -->
      <div class="nf-actions">
        <RouterLink to="/" class="nf-btn nf-btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m3 9 9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          回到首页
        </RouterLink>
        <RouterLink to="/note" class="nf-btn nf-btn-outline">
          浏览笔记
        </RouterLink>
      </div>

      <!-- 装饰性提示 -->
      <p class="nf-hint">
        <span class="hint-dot"></span>
        Error Code: NOT_FOUND · 可能是链接失效或输入了错误地址
      </p>
    </div>

    <!-- 底部浮动粒子装饰 -->
    <div class="nf-particles" aria-hidden="true">
      <span v-for="n in 6" :key="n" class="particle" :style="{ '--i': n, '--x': Math.random() * 100 + '%', '--s': 0.5 + Math.random() * 1.5 }"></span>
    </div>
  </div>
</template>

<script setup>
// 无需额外逻辑 — 纯视觉展示页
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 64px var(--space-6) var(--space-6);
}

/* ── 背景 ── */
.nf-bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.3;
  mask-image: radial-gradient(circle at 50% 40%, black 20%, transparent 70%);
  -webkit-mask-image: radial-gradient(circle at 50% 40%, black 20%, transparent 70%);
}
.nf-bg-glow {
  position: absolute; top: 30%; left: 50%; transform: translate(-50%, -50%);
  width: 500px; height: 500px; border-radius: 50%;
  background: radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%);
  pointer-events: none;
  animation: glowBreathe 6s ease-in-out infinite;
}
@keyframes glowBreathe {
  0%,100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1;   transform: translate(-50%, -50%) scale(1.15); }
}

/* ── 主内容 ── */
.nf-content {
  position: relative; z-index: 1;
  text-align: center;
  display: flex; flex-direction: column;
  align-items: center; gap: 1.25rem;
}

/* ── 404 数字艺术 ── */
.nf-code-wrap {
  display: flex; align-items: center; gap: 0.15rem;
  margin-bottom: 0.5rem;
  position: relative;
}
.nf-digit {
  font-size: clamp(5rem, 12vw, 9rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.06em;
  color: var(--text-primary);
  opacity: 0;
  transform: translateY(30px) rotateX(-40deg);
  animation: digitIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: var(--delay);
  position: relative;
  user-select: none;
}
@keyframes digitIn {
  to { opacity: 0.15; transform: translateY(0) rotateX(0deg); }
}

/* 中间 0 的特殊效果 */
.nf-digit-zero {
  position: relative;
  color: var(--accent);
  opacity: 0 !important;
  animation-name: digitInZero;
}
.nf-digit-zero::after {
  content: '0';
  position: absolute; inset: 0;
  color: transparent;
  -webkit-text-stroke: 1.5px var(--accent);
  opacity: 0;
  animation: digitStroke 0.5s ease 0.55s forwards;
}
@keyframes digitInZero {
  to { opacity: 0.2; transform: translateY(0) rotateX(0deg); }
}
@keyframes digitStroke {
  to { opacity: 0.4; }
}

/* 0 的外环 */
.zero-ring {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 0.75em; height: 0.75em; border: 2px solid var(--accent);
  border-radius: 50%; opacity: 0;
  animation: ringIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.45s forwards;
}
@keyframes ringIn {
  to { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
}

/* ── 文字信息 ── */
.nf-title {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 700; letter-spacing: -0.02em;
  color: var(--text-primary);
  opacity: 0; transform: translateY(16px);
  animation: fadeUp 0.5s ease 0.45s forwards;
}
.nf-desc {
  font-size: 0.9375rem; color: var(--text-secondary);
  line-height: 1.7; max-width: 380px;
  opacity: 0; transform: translateY(12px);
  animation: fadeUp 0.5s ease 0.55s forwards;
}
@keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

/* ── 按钮 ── */
.nf-actions {
  display: flex; gap: 0.75rem; margin-top: 0.5rem;
  opacity: 0; transform: translateY(12px);
  animation: fadeUp 0.5s ease 0.65s forwards;
}
.nf-btn {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.7rem 1.5rem; border-radius: var(--radius-full);
  font-size: 0.875rem; font-weight: 500;
  text-decoration: none; transition: all var(--duration-normal) var(--ease-bounce);
  white-space: nowrap;
}
.nf-btn-primary {
  background: var(--accent); color: white;
  box-shadow: var(--glow-accent-sm);
}
.nf-btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: var(--glow-accent-md);
}
.nf-btn-outline {
  background: transparent; color: var(--text-primary);
  border: 1.5px solid var(--border);
}
.nf-btn-outline:hover {
  border-color: var(--accent); color: var(--accent);
  transform: translateY(-2px);
}

/* ── 提示文字 ── */
.nf-hint {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.75rem; color: var(--text-muted);
  margin-top: 1rem;
  opacity: 0;
  animation: fadeUp 0.5s ease 0.8s forwards;
}
.hint-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent);
  animation: dotPulse 2s ease-in-out infinite;
}
@keyframes dotPulse { 0%,100%{opacity:0.4} 50%{opacity:1} }

/* ── 浮动粒子 ── */
.nf-particles {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden;
}
.particle {
  position: absolute;
  bottom: -10%; left: var(--x);
  width: 4px; height: 4px;
  border-radius: 50%; background: var(--accent);
  opacity: 0;
  animation: particleFloat 8s linear infinite;
  animation-delay: calc(var(--i) * 1.2s);
  transform: scale(var(--s));
}
@keyframes particleFloat {
  0%   { transform: translateY(0) scale(var(--s)); opacity: 0; }
  15%  { opacity: 0.4; }
  85%  { opacity: 0.4; }
  100% { transform: translateY(-110vh) scale(var(--s)); opacity: 0; }
}

/* ── 暗色适配 ── */
[data-theme="dark"] .nf-bg-grid { opacity: 0.12; }
[data-theme="dark"] .nf-digit:not(.nf-digit-zero) { opacity: 0.08; }
[data-theme="dark"] .nf-digit-zero { animation-name: digitInZeroDark; }
@keyframes digitInZeroDark {
  to { opacity: 0.12; transform: translateY(0) rotateX(0deg); }
}
[data-theme="dark"] .nf-bg-glow {
  background: radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 70%);
}

/* ── 响应式 ── */
@media (max-width: 640px) {
  .not-found-page { padding: 80px var(--space-4) var(--space-6); }
  .nf-code-wrap { gap: 0; }
  .nf-actions { flex-direction: column; width: 100%; }
  .nf-btn { justify-content: center; }
  .nf-desc br { display: none; }
}
</style>
