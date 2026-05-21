<template>
  <main class="about-page">
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title fade-in-up">关于我</h1>
        <div class="title-underline"></div>
        <p class="page-subtitle fade-in-up" style="animation-delay: 0.1s">
          了解我的技能、经历与做事方式。
        </p>
      </div>
    </section>

    <section class="section about-intro">
      <div class="container about-intro-grid">
        <div class="intro-left fade-in-left" ref="introRef">
          <div class="avatar-ring">
            <span class="avatar-glow"></span>
            <img src="@/assets/logo.jpg" alt="CNCG" class="avatar-img" />
          </div>

          <h2 class="intro-name">CNCG <span class="intro-accent">/ 长歌</span></h2>
          <p class="intro-role">全栈开发者 / UI 设计向 / 内容创作者</p>

          <p class="intro-bio">
            我主要做网站开发、前端工程化、内容整理和数字化方案落地。
            喜欢把复杂需求拆成清晰结构，也擅长根据实际场景整理问题、设计页面和提供更合适的定制化方案。
          </p>

          <div class="intro-tags">
            <span class="intro-tag">网站开发</span>
            <span class="intro-tag">问题梳理</span>
            <span class="intro-tag">定制方案</span>
          </div>

          <RouterLink to="/doc" class="cta-btn">
            浏览知识库
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </RouterLink>
        </div>

        <div class="intro-right" ref="highlightsRef">
          <div
            v-for="(item, idx) in highlights"
            :key="item.title"
            class="highlight-card fade-in-up"
            :style="{ animationDelay: idx * 120 + 'ms' }"
          >
            <span class="hc-icon" v-html="item.icon"></span>
            <div>
              <h3 class="hc-title">{{ item.title }}</h3>
              <p class="hc-desc">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

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

    <section class="section cta-section">
      <div class="container cta-inner">
        <h2 class="cta-title fade-in-up">有想法？一起实现。</h2>
        <p class="cta-desc fade-in-up" style="animation-delay: 0.1s">
          无论是网站开发、技术咨询，还是内容创作相关需求，都可以先聊聊。
        </p>
        <div class="cta-btns fade-in-up" style="animation-delay: 0.2s">
          <button
            class="cta-primary"
            title="点击复制 QQ 号 3230801354"
            aria-label="点击复制 QQ 号 3230801354"
            @click="copyQQ"
          >
            QQ: 3230801354 {{ qqCopied ? '(已复制)' : '' }}
          </button>

          <div class="wechat-entry">
            <button
              class="cta-secondary wechat-entry-btn"
              type="button"
              title="悬浮查看二维码，点击复制微信号"
              aria-label="悬浮查看二维码，点击复制微信号"
              @click="copyWechatId"
            >
              微信联系 {{ wechatCopied ? '(已复制)' : '' }}
            </button>
            <div class="wechat-entry-popup">
              <img src="@/assets/wechat-qrcode.jpg" alt="微信二维码" class="wechat-entry-qrcode" />
              <button
                v-if="wechatId"
                type="button"
                class="wechat-copy-inline"
                @click.stop="copyWechatId"
              >
                复制微信号
              </button>
            </div>
          </div>

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
const wechatCopied = ref(false)
const wechatId = import.meta.env.VITE_WECHAT_ID || ''

const copyQQ = async () => {
  try {
    await navigator.clipboard.writeText('3230801354')
  } catch {
    const t = document.createElement('textarea')
    t.value = '3230801354'
    t.style.cssText = 'position:fixed;opacity:0'
    document.body.appendChild(t)
    t.select()
    document.execCommand('copy')
    document.body.removeChild(t)
  }
  qqCopied.value = true
  setTimeout(() => { qqCopied.value = false }, 2000)
}

const copyWechatId = async () => {
  if (!wechatId) return
  try {
    await navigator.clipboard.writeText(wechatId)
  } catch {
    const t = document.createElement('textarea')
    t.value = wechatId
    t.style.cssText = 'position:fixed;opacity:0'
    document.body.appendChild(t)
    t.select()
    document.execCommand('copy')
    document.body.removeChild(t)
  }
  wechatCopied.value = true
  setTimeout(() => { wechatCopied.value = false }, 2000)
}

useIntersectionObserver(introRef, { threshold: 0.15 })
useIntersectionObserver(highlightsRef, { threshold: 0.1 })
useIntersectionObserver(skillsRef, { threshold: 0.1 })

const highlights = [
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    title: '网站开发',
    desc: '以 Vue 3、Vite 和基础前端能力为主，把想法整理成真正能访问、能使用的页面。'
  },
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
    title: '内容创作',
    desc: '会写技术记录、页面文案，也喜欢整理结构和表达方式。'
  },
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    title: '问题梳理',
    desc: '比起直接堆功能，我更习惯先把需求和问题理顺，再决定怎么做更合适。'
  },
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
    title: '定制方案',
    desc: '会结合具体场景去调整页面结构、内容表达和实现方式，而不是只套同一种模板。'
  }
]

const skills = [
  { name: 'Vue 3 / Composition API', level: 82 },
  { name: 'HTML / CSS / JavaScript', level: 86 },
  { name: 'Vite / 基础工程化', level: 72 },
  { name: 'Tailwind CSS / 样式整理', level: 78 },
  { name: 'Node.js / 入门实践', level: 56 },
  { name: 'TypeScript / 学习中', level: 48 },
  { name: 'Supabase / 基础使用', level: 52 },
  { name: 'AI 协作 / 页面搭建', level: 84 }
]
</script>

<style scoped>
.about-page { padding-top: 64px; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 var(--space-6); }
.section { padding: var(--space-20) 0; }

.page-hero { text-align: center; padding-top: calc(64px + 2rem); padding-bottom: 2rem; }
.page-title {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}
.title-underline {
  width: 48px;
  height: 3px;
  background: var(--gradient-primary);
  border-radius: 2px;
  margin: 0 auto 1rem;
  transform: scaleX(0);
  animation: ulSlideIn 0.5s var(--ease-out) 0.15s forwards;
}
@keyframes ulSlideIn { to { transform: scaleX(1); } }
.page-subtitle { font-size: 1rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto; }

.about-intro-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
  align-items: start;
}
@media (max-width: 900px) {
  .about-intro-grid { grid-template-columns: 1fr; gap: var(--space-6); }
}

.intro-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2.4rem 2rem 2rem;
  background: color-mix(in srgb, var(--bg-card) 95%, transparent);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, background 0.2s ease;
}
.intro-left:hover {
  transform: translateY(-1px);
  border-color: rgba(6, 182, 212, 0.14);
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
}
.avatar-ring {
  position: relative;
  width: 104px;
  height: 104px;
  padding: 5px;
  border-radius: 50%;
  margin-bottom: 1.1rem;
  background: linear-gradient(145deg, rgba(6,182,212,0.12), rgba(34,197,94,0.08));
  border: 1px solid rgba(6,182,212,0.1);
}
.avatar-glow {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(6,182,212,0.1), transparent 72%);
  opacity: 0;
  filter: blur(12px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.intro-left:hover .avatar-glow {
  opacity: 0.95;
  transform: scale(1.03);
}
.avatar-img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: white;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
}
.intro-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.28rem;
}
.intro-accent { color: var(--accent); font-weight: 400; }
.intro-role {
  font-size: 0.82rem;
  color: var(--text-secondary);
  margin-bottom: 0.95rem;
}
.intro-bio {
  max-width: 470px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.82;
  margin-bottom: 0.95rem;
}
.intro-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  justify-content: center;
  margin-bottom: 0.95rem;
}
.intro-tag {
  padding: 0.22rem 0.62rem;
  background: color-mix(in srgb, var(--bg-tertiary) 88%, transparent);
  border: 1px solid color-mix(in srgb, var(--border) 86%, transparent);
  border-radius: var(--radius-full);
  font-size: 0.72rem;
  color: var(--text-secondary);
}
.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  background: var(--accent);
  color: white;
  border-radius: var(--radius-full);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all var(--duration-normal) var(--ease-out);
}
.cta-btn:hover { background: var(--accent-hover); transform: translateY(-2px); box-shadow: var(--glow-accent-soft); }

[data-theme="dark"] .intro-left {
  background: linear-gradient(180deg, rgba(27, 28, 38, 0.98) 0%, rgba(19, 20, 28, 0.98) 100%);
  border-color: rgba(148, 163, 184, 0.14);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.01),
    0 18px 40px rgba(0, 0, 0, 0.18);
}
[data-theme="dark"] .intro-left:hover {
  background: linear-gradient(180deg, rgba(30, 31, 42, 0.98) 0%, rgba(21, 22, 31, 0.98) 100%);
  border-color: rgba(34, 197, 94, 0.18);
  box-shadow:
    0 0 0 1px rgba(34, 197, 94, 0.05),
    0 22px 48px rgba(0, 0, 0, 0.22);
}
[data-theme="dark"] .avatar-ring {
  background: linear-gradient(145deg, rgba(28, 47, 48, 0.92), rgba(23, 39, 31, 0.92));
  border-color: rgba(74, 222, 128, 0.16);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02);
}
[data-theme="dark"] .avatar-img {
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.22);
}
[data-theme="dark"] .intro-role {
  color: color-mix(in srgb, var(--text-secondary) 86%, white 14%);
}
[data-theme="dark"] .intro-bio {
  color: color-mix(in srgb, var(--text-secondary) 82%, white 18%);
}
[data-theme="dark"] .intro-tag {
  background: rgba(255, 255, 255, 0.035);
  border-color: rgba(148, 163, 184, 0.16);
  color: color-mix(in srgb, var(--text-secondary) 84%, white 16%);
}

.intro-right { display: grid; gap: 1rem; }
.highlight-card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  transition: all var(--duration-normal) var(--ease-out);
}
.highlight-card:hover { border-color: var(--border-hover); box-shadow: var(--shadow-card-hover); transform: translateY(-2px); }
.hc-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-icon);
  background: var(--accent-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
}
[data-theme="dark"] .hc-icon { background: rgba(74,222,128,0.10); color: #4ade80; }
[data-theme="dark"] .highlight-card {
  background: linear-gradient(180deg, rgba(27, 28, 38, 0.98) 0%, rgba(19, 20, 28, 0.98) 100%);
  border-color: rgba(148, 163, 184, 0.14);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.01),
    0 18px 40px rgba(0, 0, 0, 0.16);
}
[data-theme="dark"] .highlight-card:hover {
  border-color: rgba(74, 222, 128, 0.14);
  box-shadow:
    0 0 0 1px rgba(74, 222, 128, 0.04),
    0 22px 48px rgba(0, 0, 0, 0.2);
}
.hc-title { font-size: 0.95rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem; }
.hc-desc { font-size: 0.82rem; color: var(--text-secondary); line-height: 1.6; }

.skills-section { background: var(--bg-secondary); }
.section-title { font-size: 1.5rem; font-weight: 700; text-align: center; color: var(--text-primary); margin-bottom: 2rem; }
.skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.75rem; }
.skill-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  transition: all var(--duration-normal) var(--ease-out);
}
.skill-item:hover { border-color: var(--accent); box-shadow: var(--glow-accent-sm); }
.skill-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
.skill-name { font-size: 0.82rem; color: var(--text-primary); white-space: nowrap; min-width: 140px; }
.skill-bar { flex: 1; height: 6px; border-radius: 3px; background: var(--bg-tertiary); overflow: hidden; }
.skill-fill { height: 100%; border-radius: 3px; background: var(--gradient-primary); transition: width 0.8s var(--ease-out); }

.cta-section { background: var(--bg-primary); }
.cta-inner { text-align: center; padding: 3rem 0; }
.cta-title { font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem; }
.cta-desc { font-size: 1rem; color: var(--text-secondary); margin-bottom: 2rem; max-width: 500px; margin-left: auto; margin-right: auto; }
.cta-btns { display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap; }
.cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  text-decoration: none;
  font: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-normal) ease;
}
.cta-primary:hover { background: var(--accent-hover); transform: translateY(-1px); box-shadow: var(--glow-accent-soft); }
.cta-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: var(--text-primary);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-full);
  text-decoration: none;
  font: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
}
.cta-secondary:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-1px); box-shadow: var(--glow-accent-sm); }

[data-theme="dark"] .about-page {
  background:
    radial-gradient(circle at top, rgba(34, 197, 94, 0.06), transparent 26%),
    linear-gradient(180deg, #0d0f16 0%, #11131b 30%, #0f1118 100%);
}
[data-theme="dark"] .page-hero {
  background:
    linear-gradient(180deg, rgba(34, 197, 94, 0.06) 0%, rgba(34, 197, 94, 0) 38%),
    transparent;
  border-bottom: 1px solid rgba(148, 163, 184, 0.08);
}
[data-theme="dark"] .page-subtitle {
  color: color-mix(in srgb, var(--text-secondary) 80%, white 20%);
}
[data-theme="dark"] .skills-section {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0)),
    rgba(17, 19, 27, 0.72);
  border-top: 1px solid rgba(148, 163, 184, 0.07);
  border-bottom: 1px solid rgba(148, 163, 184, 0.07);
}
[data-theme="dark"] .skill-item {
  background: linear-gradient(180deg, rgba(27, 28, 38, 0.96) 0%, rgba(19, 20, 28, 0.96) 100%);
  border-color: rgba(148, 163, 184, 0.14);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.01),
    0 14px 32px rgba(0, 0, 0, 0.14);
}
[data-theme="dark"] .skill-item:hover {
  border-color: rgba(74, 222, 128, 0.16);
  box-shadow:
    0 0 0 1px rgba(74, 222, 128, 0.04),
    0 18px 40px rgba(0, 0, 0, 0.18);
}
[data-theme="dark"] .cta-section {
  background: transparent;
}
[data-theme="dark"] .cta-desc {
  color: color-mix(in srgb, var(--text-secondary) 80%, white 20%);
}
[data-theme="dark"] .cta-secondary {
  background: rgba(255, 255, 255, 0.035);
  border-color: rgba(148, 163, 184, 0.16);
}
[data-theme="dark"] .cta-secondary:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(74, 222, 128, 0.18);
}

.wechat-entry { position: relative; display: inline-flex; }
.wechat-entry-btn { min-width: 144px; }
.wechat-entry-popup {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 14px);
  transform: translateX(-50%) translateY(6px);
  opacity: 0;
  pointer-events: none;
  z-index: 8;
  display: grid;
  justify-items: center;
  gap: 0.75rem;
  width: 208px;
  padding: 0.95rem;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: var(--bg-card);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.14);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.wechat-entry-popup::after {
  content: '';
  position: absolute;
  top: calc(100% - 8px);
  left: 50%;
  width: 14px;
  height: 14px;
  background: var(--bg-card);
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  transform: translateX(-50%) rotate(45deg);
}
.wechat-entry:hover .wechat-entry-popup,
.wechat-entry:focus-within .wechat-entry-popup {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}
.wechat-entry-qrcode {
  display: block;
  width: 168px;
  height: 168px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid var(--border);
}
.wechat-copy-inline {
  width: 100%;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  font-size: 0.82rem;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
.wechat-copy-inline:hover {
  transform: translateY(-1px);
  border-color: var(--accent);
  box-shadow: var(--glow-accent-sm);
}
[data-theme="dark"] .wechat-entry-popup {
  background: linear-gradient(180deg, rgba(27, 28, 38, 0.99) 0%, rgba(19, 20, 28, 0.99) 100%);
  border-color: rgba(148, 163, 184, 0.16);
  box-shadow: 0 22px 48px rgba(0, 0, 0, 0.24);
}
[data-theme="dark"] .wechat-entry-popup::after {
  background: rgba(22, 23, 32, 0.99);
  border-right-color: rgba(148, 163, 184, 0.16);
  border-bottom-color: rgba(148, 163, 184, 0.16);
}
[data-theme="dark"] .wechat-copy-inline {
  background: rgba(255, 255, 255, 0.035);
  border-color: rgba(148, 163, 184, 0.16);
}

@media (max-width: 640px) {
  .section { padding: var(--space-12) 0; }
  .intro-left { padding: 2rem 1.25rem 1.5rem; }
  .skills-grid { grid-template-columns: 1fr; }
  .cta-btns {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    max-width: 320px;
    margin-left: auto;
    margin-right: auto;
  }
  .cta-primary,
  .cta-secondary,
  .wechat-entry {
    width: 100%;
  }
  .cta-primary,
  .cta-secondary {
    justify-content: center;
  }
  .wechat-entry-btn {
    width: 100%;
  }
  .wechat-entry-popup {
    width: 188px;
    padding: 0.85rem;
  }
  .wechat-entry-qrcode {
    width: 152px;
    height: 152px;
  }
}
</style>
