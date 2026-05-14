import { ref, onMounted, onUnmounted } from 'vue'

/**
 * IntersectionObserver composable - 监测元素是否进入视口
 * @param {Ref} target - 被观察的元素 ref
 * @param {Object} options - IntersectionObserver 配置
 */
export function useIntersectionObserver(target, options = {}) {
  const isVisible = ref(false)
  let observer = null

  onMounted(() => {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          // 触发一次后断开观察
          observer?.disconnect()
        }
      },
      { threshold: 0.15, ...options }
    )
    if (target.value) observer.observe(target.value)
  })

  onUnmounted(() => observer?.disconnect())

  return { isVisible }
}
