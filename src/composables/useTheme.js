import { ref, watch, onMounted } from 'vue'

const isDark = ref(false)

export function useTheme() {
  // 初始化：读取本地偏好或系统偏好
  function initTheme() {
    const saved = localStorage.getItem('cnng-theme')
    if (saved === 'dark') {
      isDark.value = true
    } else if (saved === 'light') {
      isDark.value = false
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme(isDark.value)
  }

  function applyTheme(dark) {
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }

  function toggleTheme() {
    isDark.value = !isDark.value
    localStorage.setItem('cnng-theme', isDark.value ? 'dark' : 'light')
    applyTheme(isDark.value)
  }

  onMounted(initTheme)

  return {
    isDark,
    toggleTheme,
  }
}
