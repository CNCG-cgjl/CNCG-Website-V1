<template>
  <component :is="tag" :to="to" :href="href" class="logo-link" :class="{ 'wrap-only': !to && !href }">
    <span class="logo-ring">
      <span class="logo-glow"></span>
      <img v-if="useImage" :src="logoSrc" alt="CNCG Logo" class="logo-img" />
      <span v-else class="logo-text">CNCG</span>
    </span>
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: { type: [Number, String], default: 42 },
  to: { type: [String, Object], default: null },
  href: { type: String, default: null },
  useImage: { type: Boolean, default: true },
})

const tag = computed(() => {
  if (props.to) return 'RouterLink'
  if (props.href) return 'a'
  return 'div'
})

const logoSrc = new URL('../assets/logo.jpg', import.meta.url).href

const sizePx = computed(() => {
  const s = typeof props.size === 'number' ? props.size : parseInt(props.size, 10)
  return `${s}px`
})
</script>

<style scoped>
.logo-link {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  text-decoration: none;
}

/* ── 圆环容器 ── */
.logo-ring {
  display: block;
  width: v-bind(sizePx);
  height: v-bind(sizePx);
  padding: calc(vbind(sizePx) * 0.07);
  border-radius: 50%;
  position: relative;
  /* 渐变圆环边框 */
  background: conic-gradient(
    from 180deg,
    var(--accent) 0%,
    #22d3ee 25%,
    var(--accent) 50%,
    #a78bfa 75%,
    var(--accent) 100%
  );
  transition:
    transform var(--duration-slow) var(--ease-spring),
    box-shadow var(--duration-normal) ease;
  animation: ringSpin 20s linear infinite paused;
}
@keyframes ringSpin { to { transform: rotate(360deg); } }

/* 外圈光晕 — hover 时激活 */
.logo-glow {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    transparent 0%,
    var(--accent) 20%,
    #22d3ee 40%,
    transparent 60%
  );
  opacity: 0;
  z-index: -1;
  filter: blur(8px);
  transition: opacity var(--duration-slow) ease;
}

.logo-link:hover .logo-glow {
  opacity: 0.5;
}

.logo-link:hover .logo-ring {
  transform: scale(1.08);
  box-shadow: var(--glow-accent-md);
  animation-play-state: running;
}

/* ── 图片版 ── */
.logo-img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: white;
}

/* ── 文字版（fallback）── */
.logo-text {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #06b6d4, #8b5cf6);
  color: white;
  font-size: calc(vbind(sizePx) * 0.38);
  font-weight: 800;
  letter-spacing: -0.02em;
}
</style>
