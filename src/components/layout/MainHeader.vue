<template>
  <header class="main-header" :class="{ 'scrolled': isScrolled }">
    <!-- 顶部渐变光效线 -->
    <div class="header-glow-line" :class="{ 'visible': isScrolled }"></div>

    <div class="container header-inner">
      <!-- Logo（圆形+圆环） -->
      <RouterLink to="/" class="logo">
        <span class="logo-ring">
          <span class="logo-ring-glow"></span>
          <img src="@/assets/logo.jpg" alt="CNCG Logo" class="logo-img" />
        </span>
      </RouterLink>

      <!-- 桌面导航：文字菜单 -->
      <nav class="nav-desktop" aria-label="主导航">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          <span class="nav-icon-box" v-html="item.svg"></span>
          <span class="nav-label">{{ item.cn }}</span>
        </RouterLink>
      </nav>

      <!-- 右侧操作区 -->
      <div class="header-actions">
        <!-- 主题切换 -->
        <button
          class="theme-toggle"
          :title="isDark ? '切换为亮色模式' : '切换为暗色模式'"
          @click="toggleTheme"
          aria-label="切换主题"
        >
          <svg v-if="!isDark" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <!-- 移动端菜单按钮 -->
        <button class="menu-toggle" @click="menuOpen = !menuOpen" aria-label="菜单">
          <span class="menu-bar" :class="{ open: menuOpen }"></span>
          <span class="menu-bar" :class="{ open: menuOpen }"></span>
          <span class="menu-bar" :class="{ open: menuOpen }"></span>
        </button>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <transition name="menu-slide">
      <div v-if="menuOpen" class="nav-mobile">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-mobile-item"
          :class="{ active: isActive(item.path) }"
          @click="menuOpen = false"
        >
          <span class="nav-mobile-icon" v-html="item.svg"></span>
          <span class="nav-mobile-text">{{ item.cn }}</span>
        </RouterLink>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme.js'

const route = useRoute()
const { isDark, toggleTheme } = useTheme()
const isScrolled = ref(false)
const menuOpen = ref(false)

const navItems = [
  { cn: '首页',   path: '/',     svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>' },
  { cn: '笔记',   path: '/note', svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  { cn: '知识库', path: '/doc',  svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>' },
  { cn: '店铺',   path: '/shop', svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>' },
  { cn: '关于',   path: '/about', svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>' },
]

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function handleScroll() {
  isScrolled.value = window.scrollY > 30
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
/* ---- Header 容器 ---- */
.main-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  background: var(--header-bg);
  border-bottom: 1px solid transparent;
  backdrop-filter: var(--glass-lg);
  -webkit-backdrop-filter: var(--glass-lg);
  transition: all var(--duration-slow) var(--ease-out), border-color var(--duration-slow) ease;
}

/* 滚动后：距顶20px + 大圆角 + 阴影 */
.main-header.scrolled {
  top: 20px;
  left: 16px; right: 16px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-elevated);
}
[data-theme="dark"] .main-header.scrolled {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.06);
}

/* ---- 顶部渐变光效线 ---- */
.header-glow-line {
  position: absolute;
  top: 0; left: 15%; right: 15%;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%, var(--accent) 30%, #06b6d4 50%, var(--accent) 70%, transparent 100%
  );
  opacity: 0;
  transition: opacity var(--duration-slow) ease;
}
.header-glow-line.visible { opacity: 0.6; }
[data-theme="dark"] .header-glow-line.visible { opacity: 0.45; }

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

/* ========== Logo ========== */
.logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  text-decoration: none;
}
.logo-ring {
  display: block;
  width: 42px; height: 42px;
  padding: 3px;
  border-radius: 50%;
  position: relative;
  background: conic-gradient(from 180deg, var(--accent) 0%, #22d3ee 25%, var(--accent) 50%, #a78bfa 75%, var(--accent) 100%);
  transition: transform var(--duration-slow) var(--ease-spring), box-shadow var(--duration-normal) ease;
}
.logo-ring-glow {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent 0%, var(--accent) 20%, #22d3ee 40%, transparent 60%);
  opacity: 0;
  z-index: -1;
  filter: blur(6px);
  transition: opacity var(--duration-slow) ease;
  animation: ringRotate 3s linear infinite paused;
}
.logo:hover .logo-ring-glow { opacity: 0.55; animation-play-state: running; }
.logo:hover .logo-ring { transform: scale(1.08); box-shadow: var(--glow-accent-md); }
.logo-img { display: block; width: 100%; height: 100%; border-radius: 50%; object-fit: cover; background: white; }
@keyframes ringRotate { to { transform: rotate(360deg); } }

/* ========== 桌面导航：文字菜单 ========== */
.nav-desktop {
  display: flex;
  align-items: center;
  gap: 4px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

/* ---- 导航项容器 ---- */
.nav-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all var(--duration-normal) var(--ease-out);
}

/* ---- 图标 ---- */
.nav-icon-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.nav-icon-box :deep(svg) { width: 16px; height: 16px; }

/* ---- 文字标签 ---- */
.nav-label {
  white-space: nowrap;
}

/* Hover 态 */
.nav-item:hover {
  color: var(--accent);
  background: var(--accent-light);
}
[data-theme="dark"] .nav-item:hover { background: rgba(74, 222, 128, 0.10); color: #4ade80; }

/* Active 态 */
.nav-item.active {
  color: var(--accent);
  background: var(--accent-light);
  font-weight: 600;
}
[data-theme="dark"] .nav-item.active { background: rgba(74, 222, 128, 0.15); color: #4ade80; }

/* ========== 右侧操作区 ========== */
.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px; height: 36px;
  border-radius: var(--radius-icon);
  border: 1.5px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
}
.theme-toggle:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-light);
  transform: translateY(-2px) rotate(15deg);
  box-shadow: var(--glow-accent-sm);
}

/* ========== 移动端菜单按钮 ========== */
.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px; height: 36px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: var(--radius-icon);
  transition: background var(--duration-fast) ease;
}
.menu-toggle:hover { background: var(--bg-secondary); }
.menu-bar {
  display: block;
  width: 100%; height: 1.5px;
  background: var(--text-primary);
  border-radius: 1px;
  transition: all var(--duration-normal) ease;
}
.menu-bar.open:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.menu-bar.open:nth-child(2) { opacity: 0; }
.menu-bar.open:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

/* ========== 移动端菜单面板 ========== */
.nav-mobile {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 1.5rem 1rem;
  border-top: 1px solid var(--border);
  background: var(--header-bg);
  backdrop-filter: var(--glass-lg);
}
.nav-mobile-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  text-decoration: none;
  color: var(--text-primary);
  font-size: 1rem;
  border-bottom: 1px solid var(--border);
  transition: all var(--duration-fast) ease;
}
.nav-mobile-item:last-child { border-bottom: none; }
.nav-mobile-item:hover,
.nav-mobile-item.active { color: var(--accent); }
.nav-mobile-icon { display: flex; align-items: center; }
.nav-mobile-icon :deep(svg) { width: 18px; height: 18px; }
.nav-mobile-text { flex: 1; }

/* ========== 响应式设计 ========== */
@media (max-width: 768px) {
  .nav-desktop { display: none; }
  .menu-toggle { display: flex; }
  .main-header.scrolled { left: 8px; right: 8px; }
}

@media (max-width: 480px) {
  .logo-ring { width: 36px; height: 36px; }
  .header-inner { height: 56px; }
  .theme-toggle, .menu-toggle { width: 32px; height: 32px; }
}
</style>
