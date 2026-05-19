<template>
  <main class="about-page">
    <!-- 页面顶部标题区 -->
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title fade-in-up">关于我</h1>
        <div class="title-underline"></div>
        <p class="page-subtitle fade-in-up" style="animation-delay:0.1s">
          了解我的技能、经验与理念
        </p>
      </div>
    </section>

    <!-- 内容区：简介 + CTA -->
    <section class="section about-intro">
      <div class="container about-intro-grid">
        <!-- 左侧：头像 + 简介 -->
        <div class="intro-left fade-in-left" ref="introRef">
          <div class="avatar-ring">
            <span class="avatar-glow"></span>
            <img src="@/assets/logo.jpg" alt="CNCG" class="avatar-img" />
          </div>
          <h2 class="intro-name">CNCG <span class="intro-accent">/ 长歌</span></h2>
          <p class="intro-role">全栈开发者 · UI设计师 · 内容创作者</p>
          <p class="intro-bio">
            专注网站开发、前端工程化与数字化解决方案。热爱用代码构建优雅的用户体验，
            相信好的设计能让技术更有温度。
          </p>
          <div class="intro-tags">
            <span class="intro-tag">Vue 3</span>
            <span class="intro-tag">React</span>
            <span class="intro-tag">Node.js</span>
            <span class="intro-tag">Tailwind CSS</span>
            <span class="intro-tag">Supabase</span>
          </div>
          <RouterLink to="/note" class="cta-btn">
            查看我的文章
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </RouterLink>
        </div>

        <!-- 右侧：亮点卡片 -->
        <div class="intro-right" ref="highlightsRef">
          <div
            v-for="(item, idx) in highlights"
            :key="item.title"
            class="highlight-card fade-in-up"
            :style="{ animationDelay: idx * 120 + 'ms' }"
          >
            <span class="hc-icon" v-html="item.icon"></span>
            <h3 class="hc-title">{{ item.title }}</h3>
            <p class="hc-desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 技能标签云 -->
    <section class="section section-alt skills-section">
      <div class="container">
        <h2 class="section-title fade-in-up">技能矩阵</h2>
        <div class="skills-grid" ref="skillsRef">
          <div
            v-for="(skill, idx) in skills"
            :key="skill.name"
            class="skill-item fade-in-up"
            :style="{ animationDelay: idx * 60 + 'ms' }"
          >
            <span class="skill-dot"></span>
            <span class="skill-name">{{ skill.name }}</span>
            <div class="skill-bar">
              <div class="skill-fill" :style="{ width: skill.level + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA 区 -->
    <section class="section cta-section">
      <div class="container cta-inner">
        <h2 class="cta-title fade-in-up">有想法？一起实现</h2>
        <p class="cta-desc fade-in-up" style="animation-delay:0.1s">
          无论是网站开发、技术咨询，还是内容创作，我都可以帮您落地。
        </p>
        <div class="cta-btns fade-in-up" style="animation-delay:0.2s">
          <button class="cta-primary" @click="copyQQ">
            QQ: 3230801354 {{ qqCopied ? '(已复制!)' : '' }}
          </button>
          <RouterLink to="/shop" class="cta-secondary">浏览店铺</RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver.js'

const introRef = ref(null)
const highlightsRef = ref(null)
const skillsRef = ref(null)
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

const { isVisible: introVisible } = useIntersectionObserver(introRef, { threshold: 0.15 })
const { isVisible: highlightsVisible } = useIntersectionObserver(highlightsRef, { threshold: 0.1 })
const { isVisible: skillsVisible } = useIntersectionObserver(skillsRef, { threshold: 0.1 })

const highlights = [
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    title: '网站开发',
    desc: 'Vue 3 / React / Vite — 高性能现代 Web 应用',
  },
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
    title: '内容创作',
    desc: '技术博客 / 产品文案 / Notion 知识库搭建',
  },
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    title: '技术咨询',
    desc: '架构评审 / 技术选型 / 性能优化方案',
  },
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
    title: '数字化解决方案',
    desc: '从需求分析到上线运维，全流程技术支持',
  },
]

const skills = [
  { name: 'Vue 3 / Composition API', level: 92 },
  { name: 'React / Next.js',        level: 78 },
  { name: 'Vite / Rollup / Webpack', level: 85 },
  { name: 'Tailwind CSS / Sass',      level: 88 },
  { name: 'Node.js / Express',      level: 75 },
  { name: 'TypeScript',             level: 80 },
  { name: 'Supabase / PostgreSQL',   level: 70 },
  { name: '飞书 API / 自动化',    level: 82 },
]
</script>

<style scoped>
.about-page { padding-top: 64px; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 var(--space-6); }
.section { padding: var(--space-20) 0; }

/* ── 页面顶部 ── */
.page-hero { text-align: center; padding-top: calc(64px + 2rem); padding-bottom: 2rem; }
.page-title {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 700; letter-spacing: var(--letter-tight);
  color: var(--text-primary); margin-bottom: 0.75rem;
}
.title-underline {
  width: 48px; height: 3px; background: var(--gradient-primary);
  border-radius: 2px; margin: 0 auto 1rem;
  transform: scaleX(0); animation: ulSlideIn 0.5s var(--ease-out) 0.15s forwards;
}
@keyframes ulSlideIn { to { transform: scaleX(1); } }
.page-subtitle { font-size: 1rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto; }

/* ── 简介网格 ── */
.about-intro-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-8);
  align-items: start;
}
@media (max-width: 900px) {
  .about-intro-grid { grid-template-columns: 1fr; gap: var(--space-6); }
}

/* ── 左侧简介 ── */
.intro-left {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: var(--space-8) var(--space-6); background: var(--bg-card);
  border: 1px solid var(--border); border-radius: var(--radius-xl);
}
.avatar-ring {
  position: relative; width: 96px; height: 96px; padding: 3px;
  border-radius: 50%; margin-bottom: 1rem;
  background: conic-gradient(from 180deg, var(--accent), #22d3ee, var(--accent), #a78bfa, var(--accent));
}
.avatar-glow {
  position: absolute; inset: -4px; border-radius: 50%;
  background: conic-gradient(from 0deg, transparent, var(--accent), transparent);
  opacity: 0; filter: blur(8px); transition: opacity var(--duration-slow) ease;
  animation: ringRotate 4s linear infinite paused;
}
.intro-left:hover .avatar-glow { opacity: 0.5; animation-play-state: running; }
@keyframes ringRotate { to { transform: rotate(360deg); } }

.avatar-img {
  display: block; width: 100%; height: 100%; border-radius: 50%;
  object-fit: cover; background: white;
}
.intro-name { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem; }
.intro-accent { color: var(--accent); font-weight: 400; }
.intro-role { font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 1rem; }
.intro-bio { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.25rem; }
.intro-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; justify-content: center; margin-bottom: 1.5rem; }
.intro-tag {
  padding: 0.25rem 0.65rem; background: var(--bg-tertiary); border: 1px solid var(--border);
  border-radius: var(--radius-full); font-size: 0.7rem; color: var(--text-secondary);
}
.cta-btn {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.6rem 1.2rem; background: var(--accent); color: white;
  border-radius: var(--radius-full); text-decoration: none; font-size: 0.85rem; font-weight: 500;
  transition: all var(--duration-normal) var(--ease-out);
}
.cta-btn:hover { background: var(--accent-hover); transform: translateY(-2px); box-shadow: var(--glow-accent-soft); }

/* ── 右侧亮点卡片 ── */
.intro-right { display: grid; gap: 1rem; }
.highlight-card {
  display: flex; align-items: flex-start; gap: 0.75rem;
  padding: 1rem 1.25rem; background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-lg); transition: all var(--duration-normal) var(--ease-out);
}
.highlight-card:hover { border-color: var(--border-hover); box-shadow: var(--shadow-card-hover); transform: translateY(-2px); }
.hc-icon {
  flex-shrink: 0; width: 36px; height: 36px; border-radius: var(--radius-icon);
  background: var(--accent-light); display: flex; align-items: center; justify-content: center;
  color: var(--accent); font-size: 14px;
}
[data-theme="dark"] .hc-icon { background: rgba(74,222,128,0.10); color: #4ade80; }
.hc-title { font-size: 0.95rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem; }
.hc-desc { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; }

/* ── 技能矩阵 ── */
.skills-section { background: var(--bg-secondary); }
.section-title { font-size: 1.5rem; font-weight: 700; text-align: center; color: var(--text-primary); margin-bottom: 2rem; }
.skills-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.75rem;
}
.skill-item {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.65rem 1rem; background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-md); transition: all var(--duration-normal) var(--ease-out);
}
.skill-item:hover { border-color: var(--accent); box-shadow: var(--glow-accent-sm); }
.skill-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
.skill-name { font-size: 0.82rem; color: var(--text-primary); white-space: nowrap; min-width: 140px; }
.skill-bar { flex: 1; height: 6px; border-radius: 3px; background: var(--bg-tertiary); overflow: hidden; }
.skill-fill {
  height: 100%; border-radius: 3px; background: var(--gradient-primary);
  transition: width 0.8s var(--ease-out);
}

/* ── CTA 区 ── */
.cta-section { background: var(--bg-primary); }
.cta-inner { text-align: center; padding: 3rem 0; }
.cta-title { font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem; }
.cta-desc { font-size: 1rem; color: var(--text-secondary); margin-bottom: 2rem; max-width: 500px; margin-left: auto; margin-right: auto; }
.cta-btns { display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap; }

.cta-primary {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1.5rem; background: var(--accent); color: white;
  border-radius: var(--radius-full); text-decoration: none; font-weight: 500;
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
@media (max-width: 640px) {
  .section { padding: var(--space-12) 0; }
  .intro-left { padding: var(--space-6) var(--space-4); }
  .skills-grid { grid-template-columns: 1fr; }
}
</style>
