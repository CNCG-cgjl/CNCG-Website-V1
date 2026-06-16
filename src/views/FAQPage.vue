<template>
  <main class="faq-page">
    <section class="faq-hero">
      <div class="hero-bg"><div class="hero-grid"></div></div>
      <div class="container hero-content">
        <h1 class="hero-title fade-in-up">常见问题</h1>
        <p class="hero-desc fade-in-up" style="animation-delay:0.08s">
          AI 可见性优化相关问题解答
        </p>
      </div>
    </section>

    <section class="faq-content">
      <div class="container">
        <div v-for="(category, ci) in categories" :key="ci" class="faq-category fade-in-up" :style="{ animationDelay: `${ci * 0.1}s` }">
          <h2 class="category-title">{{ category.name }}</h2>
          <div v-for="(item, ii) in category.items" :key="ii" class="faq-item" :class="{ open: openItems[`${ci}-${ii}`] }">
            <button class="faq-question" @click="toggle(`${ci}-${ii}`)">
              <span>{{ item.q }}</span>
              <svg class="faq-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="faq-answer" v-show="openItems[`${ci}-${ii}`]">
              <p>{{ item.a }}</p>
            </div>
          </div>
        </div>

        <div class="faq-cta">
          <h2>还有问题？</h2>
          <p>随时联系我们，提供免费咨询</p>
          <RouterLink to="/contact" class="cta-primary">联系咨询</RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { reactive } from 'vue'

const categories = [
  {
    name: 'AI 可见性基础',
    items: [
      { q: '什么是 AI 可见性？', a: 'AI 可见性是指 AI 系统（如 ChatGPT、Perplexity、Google AI、Claude、Gemini）能否准确找到、理解并描述您的网站及其内容。如果 AI 无法正确描述您的业务，您可能会失去潜在客户。' },
      { q: '为什么 AI 可见性很重要？', a: '越来越多的用户通过 AI 工具搜索产品、服务和信息。如果 AI 无法正确描述您的业务，竞争对手会获得更多推荐机会。' },
      { q: '如何测量 AI 可见性？', a: '我们使用 7+ 组标准 AI 提示词测试您的网站，分析 AI 回复的准确性、完整性和一致性，并生成详细的审计报告。' },
      { q: 'AI 可见性和 SEO 有什么区别？', a: 'SEO 优化搜索引擎排名，AI 可见性优化 AI 系统对网站的理解准确度。两者互补但目标不同。' },
    ]
  },
  {
    name: 'AI-ready 网站改造',
    items: [
      { q: '什么样的网站算 AI-ready？', a: '一个 AI-ready 的网站拥有结构化数据(JSON-LD)、AI 可读导航文件(llms.txt/ai-overview.md)、语义化 HTML、清晰的内容层级以及正确配置的 robots.txt 和 sitemap.xml。' },
      { q: '需要重建网站吗？', a: '不一定。大部分现有网站通过内容重构和结构化数据添加即可实现 AI-ready，无需完全重建。' },
      { q: '改造需要多长时间？', a: '根据网站规模和页面数量，典型的 AI-ready 优化需要 3-7 个工作日。' },
    ]
  },
  {
    name: '结构化数据与 Schema',
    items: [
      { q: '什么是 JSON-LD？', a: 'JSON-LD 是一种结构化数据格式，以 JSON 形式嵌入网页，帮助搜索引擎和 AI 系统理解页面内容的含义和关系。' },
      { q: 'Schema.org 是什么？', a: 'Schema.org 是 Google、Microsoft、Yahoo 和 Yandex 联合推出的结构化数据词汇表，定义了组织、服务、产品、人物等类型的标准描述方式。' },
      { q: '结构化数据对 AI 有帮助吗？', a: '是的。结构化数据是 AI 系统理解网页内容的最可靠信号之一。有结构化数据的页面在 AI 搜索结果中更容易被准确引用。' },
    ]
  },
  {
    name: '服务与价格',
    items: [
      { q: 'AI 可见性体检多少钱？', a: '请联系我们获取当前报价。我们提供固定价格套餐。' },
      { q: '提供长期维护吗？', a: '是的。我们提供月度 AI 可见性监控和季度内容更新服务。' },
      { q: '你们服务哪些类型的客户？', a: '个人品牌、独立顾问、小型工作室、中小企业、SaaS 产品和专业服务机构是我们的主要客户群。' },
    ]
  }
]

const openItems = reactive({})
function toggle(id) { openItems[id] = !openItems[id] }
</script>

<style scoped>
.faq-page { min-height: 100vh; background: var(--bg-primary); }
.faq-hero { position: relative; padding: 6rem 0 3rem; text-align: center; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; z-index: 0; }
.hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px); background-size: 48px 48px; }
.hero-content { position: relative; z-index: 1; }
.hero-title { font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; color: var(--text-primary); margin-bottom: .75rem; }
.hero-desc { font-size: 1.05rem; color: var(--text-secondary); max-width: 600px; margin: 0 auto; }
.faq-content { padding: 3rem 0 5rem; }
.faq-category { margin-bottom: 2.5rem; }
.category-title { font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin-bottom: .75rem; padding-bottom: .5rem; border-bottom: 1px solid var(--border-color); }
.faq-item { border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: .5rem; overflow: hidden; background: var(--bg-secondary); }
.faq-question { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: .9rem 1.1rem; background: none; border: none; cursor: pointer; font-size: .95rem; font-weight: 600; color: var(--text-primary); text-align: left; }
.faq-question:hover { background: var(--bg-hover); }
.faq-icon { transition: transform .2s; color: var(--text-tertiary); }
.faq-item.open .faq-icon { transform: rotate(180deg); }
.faq-answer { padding: 0 1.1rem 1rem; font-size: .9rem; color: var(--text-secondary); line-height: 1.65; }
.faq-cta { text-align: center; padding: 3rem 0; margin-top: 2rem; border-top: 1px solid var(--border-color); }
.faq-cta h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: .5rem; }
.faq-cta p { color: var(--text-secondary); margin-bottom: 1.25rem; }
.fade-in-up { opacity: 0; transform: translateY(20px); animation: fadeInUp .5s ease forwards; }
@keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
</style>
