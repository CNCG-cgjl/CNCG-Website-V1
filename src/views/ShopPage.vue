<template>
  <main class="shop-page">
    <!-- 页面标题区 -->
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title fade-in-up">在线店铺</h1>
        <div class="title-underline"></div>
        <p class="page-subtitle fade-in-up" style="animation-delay:0.1s">
          精选工具、模板与服务，助力您的数字化需求
        </p>
      </div>
    </section>

    <!-- 分类筛选 -->
    <section class="filter-section">
      <div class="container">
        <div class="filter-tabs fade-in-up" style="animation-delay:0.15s">
          <button 
            class="filter-tab" 
            :class="{ active: currentView === 'ALL' }" 
            @click="goBack"
            v-if="currentView !== 'ALL'"
          >
            ← 返回全部
          </button>
          <button class="filter-tab" :class="{ active: currentView === 'ALL' }" @click="currentView = 'ALL'">全部</button>
          <button v-for="cat in categories" :key="cat.id" class="filter-tab"
                  :class="{ active: currentView === cat.id }" @click="selectCategory(cat)">{{ cat.name }}</button>
        </div>
      </div>
    </section>

    <!-- 开发中状态 -->
    <section class="section shop-section" v-if="isDeveloping">
      <div class="container">
        <div class="empty-state fade-in-up">
          <span class="coming-soon-badge coming-soon-yellow">开发中</span>
          <div class="empty-glow-bg empty-glow-bg-yellow"></div>
          <div class="empty-icon float" style="animation-delay:0.5s">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
            </svg>
          </div>
          <p class="empty-title">当前项目开发中。。。</p>
          <p class="empty-desc">该分类正在准备中<br/>即将上线，敬请期待</p>
          <button class="back-btn" @click="goBack">← 返回全部</button>
        </div>
      </div>
    </section>

    <!-- 商品网格 -->
    <section class="section shop-section" v-else>
      <div class="container">
        <!-- 空状态 -->
        <div v-if="currentCategory && currentCategory.products.length === 0" class="empty-state fade-in-up">
          <span class="coming-soon-badge coming-soon-yellow">开发中</span>
          <div class="empty-glow-bg empty-glow-bg-yellow"></div>
          <div class="empty-icon float" style="animation-delay:0.5s">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
            </svg>
          </div>
          <p class="empty-title">当前项目开发中。。。</p>
          <p class="empty-desc">该分类正在准备中<br/>即将上线，敬请期待</p>
          <button class="back-btn" @click="goBack">← 返回全部</button>
        </div>

        <!-- 商品卡片网格 -->
        <div v-else class="products-grid" ref="productsRef" :class="{ visible: productsVisible }">
          <a v-for="product in currentProducts" :key="product.id"
             :href="product.url || '#'" target="_blank" rel="noopener noreferrer"
             class="product-card gradient-border"
             @click="handleProductClick(product, $event)">
            <span class="product-accent-bar"></span>
            <div class="product-image" :style="{ background: product.bg }">
              <span class="product-icon" v-html="product.icon"></span>
            </div>
            <div class="product-body">
              <div class="product-header">
                <h3 class="product-title">{{ product.title }}</h3>
                <span class="product-type-badge">{{ product.type }}</span>
              </div>
              <p class="product-desc">{{ product.desc }}</p>
              <div class="product-footer">
                <span class="product-price">{{ product.price }}</span>
                <span class="product-buy-btn">去购买 →</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- CTA 区 -->
    <section class="section cta-section">
      <div class="container cta-inner">
        <h2 class="cta-title fade-in-up">找不到想要的服务？</h2>
        <p class="cta-desc fade-in-up" style="animation-delay:0.1s">
          直接联系我，一对一沟通您的具体需求
        </p>
        <div class="cta-btns fade-in-up" style="animation-delay:0.2s">
          <a href="https://wpa.qq.com/msgrd?v=3&uin=3230801354&site=qq&menu=yes"
             target="_blank" rel="noopener noreferrer" class="cta-primary">
            通过 QQ 联系我
          </a>
          <RouterLink to="/note" class="cta-secondary">浏览技术文章</RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver.js'

const currentView = ref('ALL')
const productsRef = ref(null)
const { isVisible: productsVisible } = useIntersectionObserver(productsRef, { threshold: 0.1 })

// 分类数据
const categories = ref([
  { id: 'SERVICE', name: '服务', products: [
    { id: 1, title: '清理电脑', desc: '专业清理电脑垃圾、缓存、无用文件，提升电脑运行速度。', price: '¥9.9', type: '服务', serviceId: 'clean',
      bg: 'linear-gradient(135deg, #06b6d415, #22c55e15)', url: 'https://www.goofish.com/',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>` },
    { id: 2, title: '配置系统', desc: '优化系统设置、开机启动项、视觉效果，提升系统性能。', price: '¥25起', type: '服务', serviceId: 'system',
      bg: 'linear-gradient(135deg, #8b5cf615, #06b6d415)', url: 'https://www.goofish.com/',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>` },
    { id: 3, title: '配置环境', desc: '配置开发环境、安装依赖、配置IDE，省时省力。', price: '¥10起', type: '服务', serviceId: 'environment',
      bg: 'linear-gradient(135deg, #22c55e15, #8b5cf615)', url: 'https://www.goofish.com/',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>` },
  ]},
  { id: 'TEMPLATE', name: '模板', products: []},
  { id: 'TOOL', name: '工具', products: []},
  { id: 'EBOOK', name: '电子书', products: []},
  { id: 'COURSE', name: '课程', products: []},
])

// 当前选中的分类
const currentCategory = ref(null)
const isDeveloping = ref(false)

// 所有商品
const allProducts = computed(() => categories.value.flatMap(cat => cat.products))

// 当前显示的商品
const currentProducts = computed(() => {
  if (currentView.value === 'ALL') {
    return allProducts.value
  }
  return currentCategory.value?.products || []
})

// 选择分类
function selectCategory(cat) {
  currentView.value = cat.id
  currentCategory.value = cat
  isDeveloping.value = false
  
  // 如果分类没有商品，显示开发中状态
  if (cat.products.length === 0) {
    setTimeout(() => {
      isDeveloping.value = true
    }, 100)
  }
}

// 返回全部
function goBack() {
  currentView.value = 'ALL'
  currentCategory.value = null
  isDeveloping.value = false
}

// 处理商品点击 - 跳转到详情页
function handleProductClick(product, event) {
  // 如果有 serviceId，跳转到详情页
  if (product.serviceId) {
    event.preventDefault()
    window.location.href = `/shop/${product.serviceId}`
  }
  // 如果没有URL或#，显示开发中
  else if (!product.url || product.url === '#') {
    event.preventDefault()
    isDeveloping.value = true
  }
}
</script>

<style scoped>
/* ── 通用 ── */
.shop-page { padding-top: 64px; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 var(--space-6); }
.section { padding: var(--space-20) 0; }

/* ── 页面顶部 ── */
.page-hero { text-align: center; padding-top: calc(64px + 2rem); padding-bottom: 2rem; }
.page-title { font-size: clamp(1.75rem, 3vw, 2.25rem); font-weight: 700; letter-spacing: var(--letter-tight); color: var(--text-primary); margin-bottom: 0.75rem; }
.title-underline { width: 48px; height: 3px; background: var(--gradient-primary); border-radius: 2px; margin: 0 auto 1rem; transform: scaleX(0); animation: ulSlideIn 0.5s var(--ease-out) 0.15s forwards; }
@keyframes ulSlideIn { to { transform: scaleX(1); } }
.page-subtitle { font-size: 1rem; color: var(--warm-gray-text); max-width: 480px; margin: 0 auto; }

/* ── 筛选标签 ── */
.filter-section { padding: 0 0 var(--space-8); }
.filter-tabs { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem; justify-content: center; }
.filter-tab {
  padding: 0.35rem 1rem;
  background: linear-gradient(135deg, rgba(200,195,230,0.35) 0%, rgba(245,220,220,0.30) 50%, rgba(220,235,250,0.28) 100%);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(200,195,220,0.40);
  border-radius: var(--radius-full); font-size: 0.8rem; color: #3D3830;
  cursor: pointer; transition: all 0.3s cubic-bezier(.4,0,.2,1);
}
.filter-tab:hover {
  border-color: rgba(167,139,250,0.45);
  background: linear-gradient(135deg, rgba(190,182,230,0.50) 0%, rgba(240,205,205,0.45) 50%, rgba(210,228,245,0.42) 100%);
  color: #2D2620; transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139,92,246,0.12), 0 2px 6px rgba(149,149,149,.10);
}
.filter-tab.active {
  border-color: rgba(139,92,246,0.50);
  background: linear-gradient(135deg, rgba(180,170,225,0.55) 0%, rgba(235,195,195,0.48) 50%, rgba(200,222,240,0.46) 100%);
  color: #2D2620;
  box-shadow: 0 4px 14px rgba(139,92,246,0.10);
}
/* 暗色模式胶囊 */
[data-theme="dark"] .filter-tab {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  color: var(--text-muted);
}
[data-theme="dark"] .filter-tab:hover {
  border-color: rgba(74,222,128,0.25);
  background: rgba(74,222,128,0.08);
  color: var(--accent);
  box-shadow: 0 4px 14px rgba(74,222,128,0.08), 0 2px 4px rgba(0,0,0,.3);
}
[data-theme="dark"] .filter-tab.active {
  border-color: rgba(74,222,128,0.30);
  background: rgba(74,222,128,0.10);
  color: var(--accent);
}

/* ── 空状态 ── */
.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 3rem 1.5rem; background: var(--bg-card); border: 1px dashed var(--border);
  border-radius: var(--radius-xl); text-align: center; gap: 0.625rem; position: relative; overflow: hidden;
  max-width: 560px; margin: 0 auto;
}
.coming-soon-badge {
  position: absolute; top: 18px; right: -26px; padding: 0.2rem 2rem;
  background: var(--gradient-primary); color: white; font-size: 0.65rem; font-weight: 700;
  letter-spacing: 0.1em; transform: rotate(45deg); z-index: 1; line-height: 1.4;
}
.coming-soon-yellow { background: linear-gradient(135deg, #eab308, #facc15); color: #854d0e; }
.empty-glow-bg { position: absolute; width: 200px; height: 200px; border-radius: 50%; pointer-events: none; animation: glowPulse 4s ease-in-out infinite; }
.empty-glow-bg-yellow { background: radial-gradient(circle, rgba(234,179,8,0.06) 0%, transparent 70%); }
@keyframes glowPulse { 0%,100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 1; transform: scale(1.15); } }
.empty-icon { width: 64px; height: 64px; border-radius: var(--radius-lg); background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; }
.empty-title { font-size: 0.9375rem; font-weight: 600; color: var(--text-primary); position: relative; z-index: 1; }
.empty-desc { font-size: 0.8125rem; color: var(--text-muted); line-height: 1.6; position: relative; z-index: 1; }
.back-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--accent-light);
  border: 1px solid var(--accent);
  border-radius: var(--radius-full);
  color: var(--accent);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}
.back-btn:hover {
  background: var(--accent);
  color: white;
}

/* ── 商品网格 ── */
.products-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem; opacity: 0; transform: translateY(20px);
  transition: all 0.5s var(--ease-out);
}
.products-grid.visible { opacity: 1; transform: none; }

.product-card {
  display: flex; flex-direction: column; position: relative; overflow: hidden;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-xl); text-decoration: none; transition: all var(--duration-slow) var(--ease-out);
}
.product-card:hover { border-color: transparent; box-shadow: var(--shadow-card-hover), var(--glow-accent-soft); transform: translateY(-4px); }
.product-accent-bar { position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: var(--gradient-primary); transform: scaleX(0); transform-origin: left; transition: transform var(--duration-slow) var(--ease-out); }
.product-card:hover .product-accent-bar { transform: scaleX(1); }
.product-card::before {
  content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 2px;
  background: var(--gradient-border); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0;
  transition: opacity var(--duration-slow) ease; pointer-events: none;
}
.product-card:hover::before { opacity: 1; }

.product-image {
  height: 160px; display: flex; align-items: center; justify-content: center;
  color: var(--accent); transition: all var(--duration-slow) var(--ease-bounce);
}
.product-card:hover .product-image { transform: scale(1.03); }
.product-icon { width: 36px; height: 36px; }

.product-body { padding: 1.25rem 1.25rem 1rem; flex: 1; display: flex; flex-direction: column; }
.product-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.5rem; }
.product-title { font-size: 1rem; font-weight: 600; color: var(--text-primary); flex: 1; }
.product-type-badge {
  padding: 0.2rem 0.5rem;
  background: var(--accent-light);
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--accent);
  white-space: nowrap;
}
.product-desc { font-size: 0.8125rem; color: var(--warm-gray-text); line-height: 1.6; margin-bottom: 0.75rem; flex: 1; }
.product-footer { display: flex; align-items: center; justify-content: space-between; }
.product-price { font-size: 1.125rem; font-weight: 700; color: var(--accent); }
.product-buy-btn { font-size: 0.8125rem; color: var(--accent); font-weight: 500; transition: all var(--duration-normal) ease; }
.product-card:hover .product-buy-btn { transform: translateX(2px); }

/* ── CTA 区 ── */
.cta-section { background: var(--bg-primary); }
.cta-inner { text-align: center; padding: 3rem 0; }
.cta-title { font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem; }
.cta-desc { font-size: 1rem; color: var(--warm-gray-text); margin-bottom: 2rem; max-width: 500px; margin-left: auto; margin-right: auto; }
.cta-btns { display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap; }
.cta-primary {
  display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem;
  background: var(--accent); color: white; border-radius: var(--radius-full);
  text-decoration: none; font-weight: 500; transition: all var(--duration-normal) ease;
}
.cta-primary:hover { background: var(--accent-hover); transform: translateY(-1px); box-shadow: var(--glow-accent-soft); }
.cta-secondary {
  display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem;
  background: var(--bg-warm-gray-200); color: var(--text-primary); border: 1.5px solid transparent;
  border-radius: var(--radius-full); text-decoration: none; font-weight: 500;
  transition: all var(--duration-normal) var(--ease-out);
}
.cta-secondary:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(149,149,149,.20); }

/* ── 响应式 ── */
@media (max-width: 768px) {
  .page-hero { padding-top: calc(64px + 1.5rem); }
  .section { padding: var(--space-12) 0; }
  .empty-state { padding: 2.5rem 1rem; }
  .products-grid { grid-template-columns: 1fr; }
}
</style>
