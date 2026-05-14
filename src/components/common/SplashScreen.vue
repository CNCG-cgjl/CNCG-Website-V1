<template>
  <!-- SVG 渐变定义（放在根层，width=0 隐藏但可被引用） -->
  <svg class="svg-defs" width="0" height="0" aria-hidden="true">
    <defs>
      <linearGradient id="splashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#A78BFA"/>
        <stop offset="50%" stop-color="#F472B6"/>
        <stop offset="100%" stop-color="#60A5FA"/>
      </linearGradient>
      <linearGradient id="splashDarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4ade80"/>
        <stop offset="100%" stop-color="#22d3ee"/>
      </linearGradient>
    </defs>
  </svg>

  <Transition name="splash" @after-leave="$emit('end')">
    <div v-if="visible" class="splash-screen" :class="{ 'dark': isDark }">
      <!-- 实色底层（确保不透明遮挡主内容） -->
      <div class="splash-solid-bg"></div>

      <!-- 背景渐变装饰层 -->
      <div class="splash-bg"></div>

      <!-- 装饰圆环（静态脉冲） -->
      <div class="splash-ring ring-deco ring-deco-1"></div>
      <div class="splash-ring ring-deco ring-deco-2"></div>

      <!-- 渐变进度圆环 -->
      <div class="splash-ring ring-progress">
        <svg viewBox="0 0 120 120" class="progress-ring-svg">
          <circle cx="60" cy="60" r="56" class="progress-track"
                  stroke-dasharray="351.86" stroke-dashoffset="0"/>
          <circle cx="60" cy="60" r="56" class="progress-arc"
                  :stroke-dasharray="351.86"
                  :stroke-dashoffset="arcOffset"/>
        </svg>
      </div>

      <!-- 中心内容 -->
      <div class="splash-center">
        <!-- 圆形 Logo 容器 -->
        <div class="splash-logo-circle">
          <span class="splash-logo">C</span>
        </div>

        <!-- 品牌名 -->
        <p class="splash-brand">CNCG DIGITAL</p>
        <p class="splash-sub">STUDIO</p>

        <!-- 加载进度条 -->
        <div class="splash-bar-wrap">
          <div class="splash-bar" :style="{ width: progress + '%' }"></div>
        </div>
      </div>

      <!-- 底部提示 -->
      <span class="splash-tip">Loading experience...</span>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

defineEmits(['end'])

const visible = ref(true)
const progress = ref(0)
let timer = null
let animFrame = null

// 检测当前主题
const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
  window.matchMedia('(prefers-color-scheme: dark)').matches

// 圆环进度偏移量 (周长 = 2 * PI * 56 ≈ 351.86)
const circumference = 2 * Math.PI * 56
const arcOffset = computed(() => {
  return circumference - (circumference * progress.value / 100)
})

onMounted(() => {
  // 进度条动画：0→95% 在 1.6s 内完成（非线性缓动）
  const start = performance.now()
  const duration = 1600

  function tick(now) {
    const elapsed = now - start
    const p = Math.min(elapsed / duration, 1)
    // ease-out cubic
    progress.value = Math.round((1 - (1 - p) * (1 - p) * (1 - p)) * 95)
    if (p < 1) {
      animFrame = requestAnimationFrame(tick)
    }
  }
  animFrame = requestAnimationFrame(tick)

  // 1.9s 后隐藏 splash screen
  timer = setTimeout(() => {
    visible.value = false
  }, 1900)
})

onUnmounted(() => {
  clearTimeout(timer)
  cancelAnimationFrame(animFrame)
})
</script>

<style scoped>
/* ════════════════════════════════════════
   SplashScreen — 开屏启动动画
   ════════════════════════════════════════ */

/* SVG defs 容器 */
.svg-defs {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

.splash-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* ── 实色底层（关键：不透明，完全遮挡主内容）── */
.splash-solid-bg {
  position: absolute;
  inset: 0;
  background: #FAF8FC;
}
.splash-screen.dark .splash-solid-bg {
  background: #0a0a0f;
}

/* ── 背景渐变装饰层（在实色层之上）── */
.splash-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% 35%, rgba(167,139,250,.22) 0%, transparent 55%),
    radial-gradient(ellipse at 15% 85%, rgba(244,114,182,.14) 0%, transparent 50%),
    radial-gradient(ellipse at 88% 65%, rgba(96,165,250,.12) 0%, transparent 48%),
    radial-gradient(ellipse at 45% 90%, rgba(167,139,250,.08) 0%, transparent 40%);
}
.splash-screen.dark .splash-bg {
  background:
    radial-gradient(ellipse at 50% 40%, rgba(74,222,128,.10) 0%, transparent 55%),
    radial-gradient(ellipse at 30% 70%, rgba(34,211,238,.06) 0%, transparent 50%);
}

/* ── 装饰圆环 ── */
.splash-ring {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

/* 静态装饰圆环 */
.ring-deco {
  border-style: solid;
  border-color: rgba(167,139,250,.16);
  animation: ringPulse 3s ease-in-out infinite;
}
.ring-deco-1 { width: 300px; height: 300px; opacity: .32; border-width: 1px; }
.ring-deco-2 { width: 440px; height: 440px; opacity: .14; border-width: 1px; animation-delay: 0.5s; }
.splash-screen.dark .ring-deco { border-color: rgba(74,222,128,.14); }
.splash-screen.dark .ring-deco-1 { opacity: .22; }

/* 渐变进度圆环 */
.ring-progress {
  width: 160px;
  height: 160px;
  border: none;
  opacity: .88;
}
.progress-ring-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.progress-track {
  fill: none;
  stroke: rgba(167,139,250,.13);
  stroke-width: 3;
}
.progress-arc {
  fill: none;
  stroke: url(#splashGradient);
  stroke-width: 3.5;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.12s linear;
}
.splash-screen.dark .progress-track {
  stroke: rgba(74,222,128,.13);
}
.splash.screen.dark .progress-arc {
  stroke: url(#splashDarkGradient);
}

@keyframes ringPulse {
  0%,100% { transform: scale(1); opacity: var(--ring-o, .32); }
  50%     { transform: scale(1.05); opacity: calc(var(--ring-o, .32) * 0.4); }
}

/* ── 中心内容 ── */
.splash-center {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

/* 圆形 Logo 容器 */
.splash-logo-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #A78BFA 0%, #F472B6 50%, #60A5FA 100%);
  box-shadow:
    0 8px 32px rgba(167,139,250,.25),
    0 2px 8px rgba(167,139,250,.15),
    inset 0 2px 4px rgba(255,255,255,.25);
  animation: logoReveal 0.95s cubic-bezier(.22,1.2,.36,1) 0.15s both;
}
.splash-screen.dark .splash-logo-circle {
  background: linear-gradient(135deg, #4ade80 0%, #22d3ee 100%);
  box-shadow:
    0 8px 32px rgba(74,222,128,.28),
    0 2px 8px rgba(74,222,128,.18),
    inset 0 2px 4px rgba(255,255,255,.12);
}

.splash-logo {
  font-size: clamp(2rem, 7vw, 3.2rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0,0,0,.12);
}

@keyframes logoReveal {
  from { opacity: 0; transform: scale(0.5) translateY(20px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.splash-brand {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.32em;
  color: #6B5A82;
  text-transform: uppercase;
  margin-top: 1.15rem;
  animation: textFadeUp 0.6s ease-out 0.5s both;
}
.splash-screen.dark .splash-brand { color: #64748b; }

.splash-sub {
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.42em;
  color: #9588AA;
  text-transform: uppercase;
  animation: textFadeUp 0.6s ease-out 0.62s both;
}
.splash-screen.dark .splash-sub { color: #475569; }

@keyframes textFadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── 进度条 ── */
.splash-bar-wrap {
  width: 130px;
  height: 2.5px;
  background: rgba(167,139,250,.16);
  border-radius: 3px;
  margin-top: 1.85rem;
  overflow: hidden;
  animation: barFadeIn 0.5s ease-out 0.8s both;
}
.splash-screen.dark .splash-bar-wrap { background: rgba(74,222,128,.14); }

@keyframes barFadeIn {
  from { opacity: 0; transform: scaleX(0); }
  to   { opacity: 1; transform: scaleX(1); }
}

.splash-bar {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, #A78BFA, #F472B6, #60A5FA);
  background-size: 200% 100%;
  animation: barShimmer 2s ease-in-out infinite;
  transition: none;
}
.splash-screen.dark .splash-bar {
  background: linear-gradient(90deg, #4ade80, #22d3ee);
  background-size: 200% 100%;
  animation: barShimmer 2s ease-in-out infinite;
}

@keyframes barShimmer {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* ── 底部提示 ── */
.splash-tip {
  position: absolute;
  bottom: 2.5rem;
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  color: #B0A2C4;
  animation: tipPulse 2.5s ease-in-out infinite 0.6s both;
}
.splash-screen.dark .splash-tip { color: #334155; }

@keyframes tipPulse {
  from { opacity: 0; }
  to   { opacity: 0.6; }
  0%,100% { opacity: 0.6; }
  50%     { opacity: 0.2; }
}

/* ═══ 过渡动画 ═══ */
.splash-enter-active { transition: none; }
.splash-leave-active {
  transition: opacity 0.55s cubic-bezier(.4,0,1,1);
}
.splash-leave-to { opacity: 0; }
</style>
