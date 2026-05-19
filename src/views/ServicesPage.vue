<template>
  <main class="services-page">
    <!-- Hero 区 -->
    <section class="services-hero">
      <div class="hero-bg">
        <div class="hero-grid"></div>
        <div class="hero-glow hero-glow-1"></div>
        <div class="hero-glow hero-glow-2"></div>
      </div>
      <div class="container hero-content">
        <h1 class="hero-title fade-in-up">
          我能为您<br class="sm-break" /><span class="hero-accent">做什么</span>
        </h1>
        <p class="hero-desc fade-in-up" style="animation-delay:0.1s">
          从创意到上线，提供全链路数字化服务
        </p>
        <div class="hero-stats fade-in-up" style="animation-delay:0.2s">
          <div class="stat-item"><span class="stat-num">4+</span><span class="stat-label">服务方向</span></div>
          <div class="stat-divider"></div>
          <div class="stat-item"><span class="stat-num">100%</span><span class="stat-label">源码交付</span></div>
          <div class="stat-divider"></div>
          <div class="stat-item"><span class="stat-num">终身</span><span class="stat-label售后">售后支持</span></div>
        </div>
      </div>
    </section>

    <!-- 核心服务卡片 -->
    <section class="section core-services">
      <div class="container">
        <h2 class="section-title fade-in-up">核心服务</h2>
        <p class="section-subtitle fade-in-up" style="animation-delay:0.08s">
          每一项服务都经过实践验证，专注于交付价值而非堆砌功能
        </p>
        <div class="services-grid" ref="servicesRef">
          <div v-for="(svc, idx) in services" :key="svc.id"
               class="service-card fade-in-up"
               :style="{ animationDelay: (idx + 1) * 100 + 'ms' }"
          >
            <div class="service-number">{{ String(idx + 1).padStart(2, '0') }}</div>
            <span class="service-icon" :style="{ background: svc.iconBg }" v-html="svc.icon"></span>
            <h3 class="service-title">{{ svc.title }}</h3>
            <p class="service-desc">{{ svc.desc }}</p>
            <ul class="service-features">
              <li v-for="f in svc.features" :key="f">{{ f }}</li>
            </ul>
            <div class="service-footer">
              <span class="service-price" v-if="svc.price">{{ svc.price }}</span>
              <span class="service-price" v-else>按需报价</span>
              <RouterLink to="/contact" class="service-link">
                咨询详情
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 工作流程 -->
    <section class="section section-alt process-section">
      <div class="container">
        <h2 class="section-title fade-in-up">工作流程</h2>
        <p class="section-subtitle fade-in-up" style="animation-delay:0.08s">
          清晰透明的流程，每一步都让您掌握进度
        </p>
        <div class="process-timeline" ref="processRef">
          <div v-for="(step, idx) in processSteps" :key="idx"
               class="process-step fade-in-up"
               :style="{ animationDelay: idx * 120 + 'ms' }"
          >
            <div class="step-marker">
              <span class="step-dot"></span>
              <span class="step-line"></span>
            </div>
            <div class="step-body">
              <h4 class="step-name">{{ step.name }}</h4>
              <p class="step-detail">{{ step.detail }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术栈展示 -->
    <section class="section tech-section">
      <div class="container">
        <h2 class="section-title fade-in-up">技术栈</h2>
        <p class="section-subtitle fade-in-up" style="animation-delay:0.08s">
          选择合适的技术，让每一行代码都物有所值
        </p>
        <div class="tech-grid" ref="techRef">
          <div v-for="(tech, idx) in techStack" :key="tech.name"
               class="tech-item fade-in-up"
               :style="{ animationDelay: idx * 60 + 'ms' }"
          >
            <span class="tech-icon" v-html="tech.icon"></span>
            <span class="tech-name">{{ tech.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section cta-section">
      <div class="container cta-inner">
        <h2 class="cta-title fade-in-up">准备好开始了吗？</h2>
        <p class="cta-desc fade-in-up" style="animation-delay:0.1s">
          告诉我您的想法，免费获得初步方案与报价
        </p>
        <div class="cta-btns fade-in-up" style="animation-delay:0.2s">
          <RouterLink to="/contact" class="cta-primary">
            立即联系
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </RouterLink>
          <button class="cta-secondary" @click="copyQQ">
            QQ: 3230801354 {{ qqCopied ? '(已复制!)' : '' }}
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver.js'

const servicesRef = ref(null)
const processRef = ref(null)
const techRef = ref(null)
const qqCopied = ref(false)

const copyQQ = async () => {
  try {
    await navigator.clipboard.writeText('3230801354')
  } catch {
    const t = document.createElement('textarea'); t.value = '3230801354'; t.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t)
  }
  qqCopied.value = true
  setTimeout(() => { qqCopied.value = false }, 2000)
}

useIntersectionObserver(servicesRef, { threshold: 0.08 })
useIntersectionObserver(processRef, { threshold: 0.1 })
useIntersectionObserver(techRef, { threshold: 0.1 })

const services = [
  {
    id: 'web-dev',
    title: '网站开发',
    desc: '从企业官网到复杂 Web 应用，提供端到端的网站开发服务。',
    iconBg: 'linear-gradient(135deg, #22c55e15, #06b6d415)',
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    features: ['响应式设计，全设备适配', 'Vue 3 / React 现代化架构', 'SEO 友好，性能优化', 'Supabase 后端集成', 'CI/CD 自动部署'],
    price: '¥2,000 起',
  },
  {
    id: 'ui-design',
    title: 'UI / UX 设计',
    desc: '以用户为中心的界面设计，让美观与实用并存。',
    iconBg: 'linear-gradient(135deg, #8b5cf615, #ec489915)',
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
    features: ['设计系统搭建', '原型图 & 高保真设计稿', '交互规范文档', '暗色模式适配', '动效设计'],
    price: '¥1,500 起',
  },
  {
    id: 'content',
    title: '内容创作',
    desc: '技术文章、产品文案、知识库搭建——用内容传递价值。',
    iconBg: 'linear-gradient(135deg, #06b6d415, #22d3ee15)',
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    features: ['技术博客写作', '飞书知识库搭建', '产品文档撰写', 'SEO 内容策略', '多平台内容分发'],
    price: '¥500 起',
  },
  {
    id: 'consulting',
    title: '技术咨询',
    desc: '架构评审、技术选型、性能诊断——帮您做出正确的技术决策。',
    iconBg: 'linear-gradient(135deg, #f59e0b15, #ef444415)',
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    features: ['技术方案评审', '代码审查 & 重构建议', '性能分析与优化', '架构设计指导', '团队技术培训'],
    price: '¥200/30min',
  },
]

const processSteps = [
  { name: '需求沟通', detail: '了解您的目标、用户群体、预算范围和时间预期，梳理核心需求。' },
  { name: '方案设计', detail: '输出技术方案、功能规划、视觉草图和初步报价供确认。' },
  { name: '开发迭代', detail: '敏捷开发模式，分阶段交付演示，确保每一步都符合预期。' },
  { name: '测试验收', detail: '全面测试（兼容性、性能、安全），修复问题直至验收通过。' },
  { name: '部署交付', detail: '正式环境部署、域名配置、源码交付，并提供操作培训。' },
  { name: '售后支持', detail: '免费 Bug 修复期 + 长期维护选项，确保线上稳定运行。' },
]

const techStack = [
  { name: 'Vue 3',   icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2 3h3.5A5.5 5.5 0 0111 8.5V21H2V3zm13 0h3.5A5.5 5.5 0 0124 8.5V21h-9V3zM11 11h2v10h-2V11z"/></svg>' },
  { name: 'React',   icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14.23 12.004a2.236 2.236 0 01-2.235 2.236 2.236 2.236 0 01-2.236-2.236 2.236 2.236 0 012.236-2.236 2.236 2.236 0 012.235 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.792 1.02-1.792 3.873.03 7.444-.79 1.65-1.24 3.245-1.24 4.567 0 2.708 1.33 4.592 3.168 4.592 1.347 0 3.108-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.094 1.106-.278 1.792-1.02 1.792-3.874-.03-7.445.79-1.65 1.24-3.245 1.24-4.567 0-2.708-1.33-4.592-3.168-4.592zm.139 1.638c.892 0 1.53.467 1.53 2.954 0 .99-.364 2.28-.94 3.69-1.27-2.154-2.887-4.308-4.577-5.91 1.39-.96 2.62-1.493 3.43-1.493h.557zm-9.98.04c.892 0 1.53.466 1.53 2.953 0 .99-.365 2.28-.94 3.69-1.27-2.153-2.887-4.307-4.577-5.908 1.39-.96 2.62-1.493 3.43-1.493h.557v-.242zm4.987 1.126c1.63 1.468 3.155 3.47 4.27 5.51-.76 1.632-1.77 3.175-2.93 4.505h-.68c-1.156-1.33-2.17-2.873-2.93-4.504 1.115-2.04 2.64-4.043 4.27-5.51zm-.34 11.45c-1.63-1.468-3.155-3.47-4.27-5.51.76-1.632 1.77-3.174 2.93-4.504h.68c1.156 1.33 2.17 2.873 2.93 4.504-1.115 2.04-2.64 4.043-4.27 5.51z"/></svg>' },
  { name: 'Vite',    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8.286 21.293L.6 2.336A.952.952 0 011.786 1.6L22.5 13.148a.952.952 0 01-.55 1.725L15.6 15.43l-4.143 6.528a.952.952 0 01-1.71-.665z"/></svg>' },
  { name: 'Tailwind CSS', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19.2 12.001 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/></svg>' },
  { name: 'Node.js',  icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.585-.203.703-.25 1.328-.604.065-.037.151-.023.218.017l2.256 1.339a.29.29 0 00.272 0l8.795-5.076a.277.277 0 00.134-.238V6.921a.28.28 0 00-.137-.242l-8.791-5.072a.278.278 0 00-.271 0L3.075 6.68a.283.283 0 00-.139.241v10.15a.27.27 0 00.138.236l2.409 1.392c1.307.654 2.108-.116 2.108-.89V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.112.255.253v10.021c0 1.745-.95 2.745-2.604 2.745-.508 0-.909 0-2.026-.551L2.28 18.394A1.857 1.857 0 011.35 16.77V6.921c0-.645.344-1.248.9-1.571l8.795-5.082c.539-.304 1.253-.304 1.788 0l8.794 5.082c.558.323.902.926.902 1.571v10.15c0 .645-.344 1.246-.902 1.571l-8.794 5.076a1.834 1.834 0 01-.935.253z"/><path d="M15.016 15.629c-3.837 0-4.641-1.763-4.641-3.244 0-.142.113-.253.256-.253h1.137c.128 0 .235.093.254.217.172 1.167.685 1.755 2.994 1.755 1.842 0 2.626-.417 2.626-1.394 0-.563-.222-.982-3.086-1.262-2.39-.236-3.87-.764-3.87-2.672 0-1.765 1.489-2.816 3.985-2.816 2.803 0 4.189.973 4.366 3.062a.256.256 0 01-.254.278h-1.143a.252.252 0 01-.246-.199c-.274-1.216-.939-1.604-2.723-1.604-2.005 0-2.24.699-2.24 1.223 0 .636.276.82 2.999 1.179 2.693.354 3.953.854 3.953 2.654 0 1.907-1.59 2.996-4.367 2.996z"/></svg>' },
  { name: 'TypeScript', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 011.306.34v2.458a3.95 3.95 0 00-.643-.361 5.093 5.093 0 00-.717-.26 5.453 5.453 0 00-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 00-.623.242c-.17.104-.3.229-.393.374a.888.888 0 00-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.42.276.69.394c.27.119.579.243.926.371.499.184.947.381 1.343.591.396.21.736.454 1.02.733.283.279.503.598.658.959.155.361.232.789.232 1.286 0 .57-.11 1.085-.33 1.543a3.133 3.133 0 01-.923 1.137c-.393.306-.86.54-1.4.702a5.99 5.99 0 01-1.76.243 6.476 6.476 0 01-1.878-.254 5.5 5.0 0 01-1.425-.624v-2.572a4.07 4.07 0 00.815.542c.31.164.628.295.953.393.326.098.646.169.96.213.314.044.606.066.875.066.3 0 .572-.027.816-.08.244-.054.453-.134.626-.24a1.14 1.14 0 00.39-.38c.09-.152.136-.33.136-.534 0-.225-.064-.422-.192-.592a1.975 1.975 0 00-.538-.461 5.6 5.6 0 00-.825-.4 15.458 15.458 0 00-1.075-.393 9.26 9.26 0 01-1.27-.545 4.007 4.007 0 01-.998-.69 2.955 2.955 0 01-.658-.93 3.12 3.12 0 01-.236-1.252c0-.542.103-1.025.309-1.449.206-.424.494-.785.864-1.084.37-.3.807-.527 1.311-.684a5.5 5.5 0 011.637-.237zM8.19 9.877h3.592v2.29H8.19v4.118c0 .39.034.716.102.984.068.27.173.483.315.649.141.166.326.283.554.353.228.07.503.105.825.105a4.88 4.88 0 001.375-.198v2.37a8.54 8.54 0 01-1.071.214 7.84 7.84 0 01-1.17.088c-.827 0-1.535-.112-2.124-.336a3.806 3.806 0 01-1.46-.947 3.88 3.88 0 01-.854-1.49 6.326 6.326 0 01-.278-1.935V12.167H3.413V9.877h1.55V6.87h3.227v3.007z"/></svg>' },
  { name: 'Supabase', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21.36 6.24l-1.08 3.36a1.66 1.66 0 01-1.58 1.15H5.89L4.71 14.7h13.17c.73 0 1.37.49 1.56 1.19l.5 1.74a.47.47 0 01-.45.6H4.41a1.56 1.56 0 01-1.49-2l3.47-12A1.66 1.66 0 0 8 2.07h11.95c.74 0 1.38.5 1.57 1.2l.84 2.97zM3.68 18.76a.5.5 0 00.48.63h15.62c.27 0 .48-.22.46-.48l-.5-1.74a1.56 1.56 0 00-1.49-1.19H4.41c-.73 0-1.37.49-1.56 1.19l-.17.59z"/></svg>' },
  { name: '飞书',  icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.5 3.5L7 7L10.5 3.5L14 7L17.5 3.5L21 7V20.5L17.5 17L14 20.5L10.5 17L7 20.5L3.5 17V3.5Z"/></svg>' },
  { name: 'PostgreSQL', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.128 0a10.134 10.134 0 00-2.755.363c-.4.122-.817.305-1.178.535-.674.43-1.263 1.006-1.707 1.67-.443.665-.77 1.42-.957 2.215-.187.795-.263 1.63-.213 2.47.025.42.1.84.225 1.24.125.4.3.78.525 1.12.225.34.5.65.8.9.3.25.64.45 1.01.6.37.15.77.22 1.18.22.4 0 .8-.07 1.17-.22.37-.15.71-.35 1.01-.6.3-.25.57-.56.8-.9.23-.34.4-.72.53-1.12.12-.4.2-.82.22-1.24.05-.84-.03-1.675-.22-2.47-.19-.795-.51-1.55-.96-2.215-.44-.664-1.03-1.24-1.7-1.67a6.13 6.13 0 00-1.18-.535A10.134 10.134 0 0017.128 0z"/></svg>' },
  { name: 'Vercel',  icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 22.525H0l12-21.05 12 21.05z"/></svg>' },
  { name: 'Docker',  icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.185.185v1.887c0 .102.083.186.185.186m2.964 2.715h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.887c0 .102.083.185.185.185m-2.964 0h2.119a.186.186 0 00.185-.185V9.006a.185.185 0 00-.185-.186h-2.119a.186.186 0 00-.185.185v1.887c0 .102.083.185.185.185m9.285 5.429h2.119a.186.186 0 00.186-.185v-1.888a.186.186 0 00-.186-.185h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185M0 15.27l.117.076c.992.644 2.182 1.132 3.497 1.453a13.7 13.7 0 002.883.312c.992-.03 1.956-.188 2.883-.469a13.7 13.7 0 003.497-1.453l.117-.076v-4.633H0v4.633z"/></svg>' },
  { name: 'Git',     icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.66 2.66c.645-.222 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.72.72-1.885.72-2.604 0-.539-.541-.676-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.719.719.719 1.885 0 2.604-.719.72-1.885.72-2.604 0-.719-.72-.719-1.885 0-2.604.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.404-.545-.545-.676-1.342-.396-2.003L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187"/></svg>' },
]
</script>

<style scoped>
/* ── 通用 ── */
.services-page { padding-top: 64px; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 var(--space-6); }
.section { padding: var(--space-20) 0; }
.section-alt { background: var(--bg-secondary); }
.section-title { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 700; text-align: center; color: var(--text-primary); letter-spacing: var(--letter-tight); margin-bottom: 0.5rem; }
.section-subtitle { font-size: 0.95rem; color: var(--text-secondary); text-align: center; max-width: 520px; margin: 0 auto 2.5rem; }
.fade-in-up { animation: fadeInUp 0.5s var(--ease-out) both; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

/* ── Hero ── */
.services-hero { position: relative; overflow: hidden; padding-top: calc(64px + 3rem); padding-bottom: 3rem; text-align: center; }
.hero-bg { position: absolute; inset: 0; z-index: -1; }
.hero-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 48px 48px; opacity: 0.35;
}
[data-theme="dark"] .hero-grid { opacity: 0.12; }
.hero-glow { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
.hero-glow-1 { width: 360px; height: 360px; background: radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%); top: -80px; right: 10%; animation: glowFloat 8s ease-in-out infinite; }
.hero-glow-2 { width: 280px; height: 280px; background: radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%); bottom: -60px; left: 5%; animation: glowFloat 8s ease-in-out infinite 4s; }
[data-theme="dark"] .hero-glow-1 { background: radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%); }
[data-theme="dark"] .hero-glow-2 { background: radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%); }
@keyframes glowFloat { 0%,100% { transform: translate(0,0); } 50% { transform: translate(20px,-16px); } }

.hero-title { font-size: clamp(2.25rem, 6vw, 3.5rem); font-weight: 800; line-height: 1.15; color: var(--text-primary); margin-bottom: 1rem; }
.hero-accent { background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.sm-br { display: none; }
@media (max-width: 480px) { .sm-br { display: block; } }
.hero-desc { font-size: 1.1rem; color: var(--text-secondary); max-width: 440px; margin: 0 auto 2rem; }
.hero-stats { display: flex; align-items: center; justify-content: center; gap: 1.5rem; flex-wrap: wrap; }
.stat-item { display: flex; flex-direction: column; align-items: center; }
.stat-num { font-size: 1.5rem; font-weight: 800; color: var(--accent); }
.stat-label { font-size: 0.78rem; color: var(--text-muted); margin-top: 0.15rem; }
.stat-divider { width: 1px; height: 28px; background: var(--border); }

/* ── 服务卡片 ── */
.services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }

.service-card {
  position: relative; padding: 2rem 1.5rem;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-xl); overflow: hidden;
  transition: all var(--duration-slow) var(--ease-out);
}
.service-card:hover { border-color: transparent; box-shadow: var(--shadow-card-hover), var(--glow-accent-soft); transform: translateY(-4px); }
.service-number {
  position: absolute; top: 1rem; right: 1.25rem; font-size: 2.5rem; font-weight: 900;
  color: var(--bg-tertiary); line-height: 1; letter-spacing: -1px;
}
.service-icon {
  width: 48px; height: 48px; border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 1rem; color: var(--accent);
  transition: transform var(--duration-normal) var(--ease-bounce);
}
.service-card:hover .service-icon { transform: scale(1.1); }
.service-icon :deep(svg) { width: 24px; height: 24px; }
.service-title { font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; }
.service-desc { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem; }

.service-features { list-style: none; padding: 0; margin: 0 0 1.25rem; }
.service-features li {
  position: relative; padding-left: 1.1rem; font-size: 0.8rem; color: var(--text-secondary);
  line-height: 1.8;
}
.service-features li::before {
  content: ''; position: absolute; left: 0; top: 0.62rem;
  width: 5px; height: 5px; border-radius: 50%; background: var(--accent);
}

.service-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border); }
.service-price { font-size: 1rem; font-weight: 700; color: var(--accent); }
.service-link {
  display: inline-flex; align-items: center; gap: 0.3rem;
  font-size: 0.82rem; color: var(--accent); font-weight: 500;
  text-decoration: none; transition: all var(--duration-normal) ease;
}
.service-link:hover { gap: 0.5rem; }

/* ── 流程时间线 ── */
.process-timeline { max-width: 640px; margin: 0 auto; position: relative; }
.process-step { display: flex; gap: 1.25rem; padding-bottom: 1.5rem; }
.process-step:last-child { padding-bottom: 0; }
.process-step:last-child .step-line { display: none; }

.step-marker { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; width: 20px; }
.step-dot {
  width: 12px; height: 12px; border-radius: 50%;
  background: var(--accent); box-shadow: var(--glow-accent-sm); flex-shrink: 0;
}
.step-line { width: 2px; flex: 1; background: var(--border); margin-top: 4px; }

.step-body { flex: 1; padding-top: 0; }
.step-name { font-size: 1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.3rem; }
.step-detail { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; }

/* ── 技术栈 ── */
.tech-grid {
  display: flex; flex-wrap: wrap; gap: 0.6rem; justify-content: center;
  max-width: 700px; margin: 0 auto;
}
.tech-item {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.5rem 1rem; background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-full); font-size: 0.82rem; color: var(--text-primary);
  transition: all var(--duration-normal) var(--ease-out);
}
.tech-item:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); box-shadow: var(--glow-accent-sm); }
.tech-icon { display: flex; align-items: center; color: var(--text-muted); }
.tech-icon :deep(svg) { width: 16px; height: 16px; }
.tech-item:hover .tech-icon { color: var(--accent); }

/* ── CTA ── */
.cta-section { background: var(--bg-primary); }
.cta-inner { text-align: center; padding: 3rem 0; }
.cta-title { font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem; }
.cta-desc { font-size: 1rem; color: var(--text-secondary); margin-bottom: 2rem; max-width: 500px; margin-left: auto; margin-right: auto; }
.cta-btns { display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap; }

.cta-primary {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1.75rem; background: var(--accent); color: white;
  border-radius: var(--radius-full); text-decoration: none; font-weight: 600;
  transition: all var(--duration-normal) ease;
}
.cta-primary:hover { background: var(--accent-hover); transform: translateY(-1px); box-shadow: var(--glow-accent-soft); }

.cta-secondary {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1.5rem; background: transparent; color: var(--text-primary);
  border: 1.5px solid var(--border); border-radius: var(--radius-full);
  text-decoration: none; font-weight: 500; transition: all var(--duration-normal) var(--ease-out);
}
.cta-secondary:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-1px); box-shadow: var(--glow-accent-sm); }

/* ── 响应式 ── */
@media (max-width: 768px) {
  .services-hero { padding-top: calc(64px + 2rem); padding-bottom: 2rem; }
  .section { padding: var(--space-12) 0; }
  .services-grid { grid-template-columns: 1fr; }
  .hero-stats { gap: 1rem; }
  .stat-num { font-size: 1.25rem; }
}
</style>
