<template>
  <header class="main-header" :class="{ scrolled: isScrolled }">
    <div class="header-glow-line" :class="{ visible: isScrolled }"></div>

    <div class="container header-inner">
      <RouterLink to="/" class="logo" aria-label="返回首页">
        <span class="logo-ring">
          <span class="logo-ring-glow"></span>
          <img src="@/assets/logo.jpg" alt="CNCG Logo" class="logo-img" />
        </span>
      </RouterLink>

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

      <div class="header-actions">
        <button
          class="theme-toggle"
          :title="isDark ? '切换为浅色模式' : '切换为深色模式'"
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

        <button class="menu-toggle" @click="menuOpen = !menuOpen" aria-label="菜单">
          <span class="menu-bar" :class="{ open: menuOpen }"></span>
          <span class="menu-bar" :class="{ open: menuOpen }"></span>
          <span class="menu-bar" :class="{ open: menuOpen }"></span>
        </button>
      </div>
    </div>

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
  { cn: '首页', path: '/', svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>' },
  { cn: '笔记', path: '/note', svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  { cn: '知识库', path: '/doc', svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>' },
  { cn: '商店', path: '/shop', svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>' },
  { cn: '关于', path: '/about', svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>' }
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
/* ---- Header 瀹瑰櫒 ---- */
.main-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  background: var(--header-bg);
  border-bottom: 1px solid transparent;
  backdrop-filter: var(--glass-lg);
  -webkit-backdrop-filter: var(--glass-lg);
  transition: background var(--duration-normal) var(--ease-out),
              border-color var(--duration-normal) var(--ease-out),
              box-shadow var(--duration-normal) var(--ease-out);
}

.main-header.scrolled {
  background: var(--header-bg-scrolled);
  border-bottom-color: var(--header-border);
  box-shadow: var(--shadow-sm);
}

.header-glow-line {
  position: absolute;
  inset: auto 0 0 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.35), transparent);
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
}
.header-glow-line.visible { opacity: 1; }

.container {
  width: min(1200px, calc(100% - 2rem));
  margin: 0 auto;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
  gap: 1rem;
}

.logo {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.logo-ring {
  position: relative;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(6, 182, 212, 0.22);
  background: rgba(255, 255, 255, 0.02);
}

.logo-ring-glow {
  position: absolute;
  inset: -6px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.16) 0%, transparent 68%);
  pointer-events: none;
}

.logo-img {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  object-fit: cover;
}

.nav-desktop {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.nav-item,
.nav-mobile-item {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 0.8rem;
  border-radius: 999px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--duration-fast) ease, background var(--duration-fast) ease, transform var(--duration-fast) ease;
}

.nav-item:hover,
.nav-mobile-item:hover,
.nav-item.active,
.nav-mobile-item.active {
  color: var(--text-primary);
  background: rgba(6, 182, 212, 0.08);
}

.nav-icon-box,
.nav-mobile-icon {
  display: inline-flex;
  width: 16px;
  height: 16px;
}

.nav-label,
.nav-mobile-text {
  font-size: 0.92rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-toggle,
.menu-toggle {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg-card);
  color: var(--text-primary);
  cursor: pointer;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
}

.menu-bar {
  width: 16px;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
  transition: transform var(--duration-fast) ease, opacity var(--duration-fast) ease;
}

.nav-mobile {
  display: none;
  padding: 0.5rem 1rem 1rem;
  background: var(--header-bg-scrolled);
  border-bottom: 1px solid var(--header-border);
}

.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.menu-slide-enter-from,
.menu-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 860px) {
  .nav-desktop { display: none; }
  .menu-toggle { display: inline-flex; }
  .nav-mobile {
    display: grid;
    gap: 0.4rem;
  }
  .nav-mobile-item {
    padding: 0.85rem 0.95rem;
    border-radius: 14px;
  }
}
</style>
