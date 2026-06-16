<template>
  <main class="tools-page">
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title fade-in-up">免费工具</h1>
        <div class="title-underline"></div>
        <p class="page-subtitle fade-in-up" style="animation-delay: 0.1s">
          即用型小工具，帮你在上线前自检；需要定制开发可前往服务页或联系咨询。
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="tools-grid">
          <RouterLink
            v-for="tool in tools"
            :key="tool.slug"
            :to="`/tools/${tool.slug}`"
            class="tool-card"
            :class="{ 'tool-card-soon': !tool.available }"
          >
            <span class="tool-icon" v-html="tool.icon"></span>
            <h2 class="tool-name">{{ tool.name }}</h2>
            <p class="tool-desc">{{ tool.desc }}</p>
            <span class="tool-cta">{{ tool.available ? '立即使用 →' : '即将上线' }}</span>
          </RouterLink>
        </div>

        <div class="tools-upsell">
          <p>需要飞书知识库接入、整站搭建或运维部署？</p>
          <div class="tools-upsell-actions">
            <RouterLink to="/services" class="btn-primary">查看定制服务</RouterLink>
            <RouterLink to="/shop" class="btn-secondary">闲鱼商店</RouterLink>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
const tools = [
  {
    slug: 'site-checklist',
    name: '网站上线检查清单',
    desc: '发布前逐项勾选：域名、HTTPS、表单、移动端、SEO 等，进度保存在本机浏览器。',
    available: true,
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
  },
  {
    slug: 'feishu-wiki',
    name: '飞书知识库结构规划',
    desc: '规划 Wiki 分类与同步到个人站的注意事项（教程向，开发中）。',
    available: false,
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
  },
]
</script>

<style scoped>
.tools-page { padding-top: 64px; }
.page-hero { padding: var(--space-16) 0 var(--space-10); text-align: center; }
.page-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}
.title-underline {
  width: 48px;
  height: 3px;
  margin: 0 auto 1rem;
  border-radius: 999px;
  background: var(--gradient-primary);
}
.page-subtitle {
  color: var(--text-secondary);
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.6;
}
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}
.tool-card {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  text-decoration: none;
  color: inherit;
  transition: border-color var(--duration-normal) ease, box-shadow var(--duration-normal) ease, transform var(--duration-normal) ease;
}
.tool-card:hover:not(.tool-card-soon) {
  border-color: var(--accent);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}
.tool-card-soon {
  opacity: 0.65;
  pointer-events: none;
}
.tool-icon {
  display: inline-flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  background: rgba(6, 182, 212, 0.1);
  color: var(--accent);
}
.tool-name { font-size: 1.125rem; font-weight: 600; margin: 0; color: var(--text-primary); }
.tool-desc { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.55; flex: 1; margin: 0; }
.tool-cta { font-size: 0.8125rem; font-weight: 600; color: var(--accent); }
.tools-upsell {
  text-align: center;
  padding: 1.75rem;
  border: 1px dashed var(--border);
  border-radius: var(--radius-xl);
  background: var(--bg-secondary);
}
.tools-upsell p { margin: 0 0 1rem; color: var(--text-secondary); }
.tools-upsell-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}
.btn-primary {
  display: inline-flex;
  padding: 0.65rem 1.35rem;
  background: var(--accent);
  color: #fff;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
}
.btn-secondary {
  display: inline-flex;
  padding: 0.65rem 1.35rem;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-full);
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-primary);
  text-decoration: none;
}
.btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
</style>
