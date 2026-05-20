<template>
  <main class="contact-page">
    <div class="contact-bg-grid" aria-hidden="true"></div>
    <div class="contact-bg-glow" aria-hidden="true"></div>

    <section class="page-hero">
      <div class="container">
        <h1 class="page-title fade-in-up">联系我</h1>
        <div class="title-underline"></div>
        <p class="page-subtitle fade-in-up" style="animation-delay: 0.1s">
          有项目想法、技术问题，或者想聊合作方式，都可以从这里开始。
        </p>
      </div>
    </section>

    <section class="section contact-channels">
      <div class="container">
        <div class="channels-grid">
          <article
            v-for="channel in channels"
            :key="channel.name"
            class="channel-shell"
            :class="{ 'channel-shell-wechat': channel.action === 'wechat-hover' }"
          >
            <a
              v-if="!channel.action"
              :href="channel.url"
              :target="channel.target"
              rel="noopener noreferrer"
              class="channel-card"
            >
              <div class="channel-icon" :style="{ background: channel.bg }">
                <span class="channel-icon-svg" v-html="channel.icon"></span>
              </div>
              <h3 class="channel-name">{{ channel.name }}</h3>
              <p class="channel-label">{{ channel.label }}</p>
              <p class="channel-desc">{{ channel.desc }}</p>
              <span class="channel-link">{{ channel.linkText }}</span>
            </a>

            <button
              v-else
              type="button"
              class="channel-card channel-card-wechat"
            >
              <div class="wechat-card-default">
                <div class="channel-icon" :style="{ background: channel.bg }">
                  <span class="channel-icon-svg" v-html="channel.icon"></span>
                </div>
                <h3 class="channel-name">{{ channel.name }}</h3>
                <p class="channel-label">{{ channel.label }}</p>
                <p class="channel-desc">{{ channel.desc }}</p>
                <span class="channel-link">{{ channel.linkText }}</span>
              </div>

              <div class="wechat-hover-panel">
                <img :src="wechatQrCode" alt="微信二维码" class="wechat-hover-image" />
              </div>
            </button>
          </article>
        </div>
      </div>
    </section>

    <section class="section section-alt form-section">
      <div class="container form-container">
        <div class="form-header">
          <h2 class="form-title">发送消息</h2>
          <p class="form-subtitle">填写下面的表单，我会尽快回复你。</p>
        </div>

        <form class="contact-form" @submit.prevent="handleSubmit">
          <div class="form-row">
            <div class="form-field">
              <label for="cf-name" class="field-label">称呼 <span class="required">*</span></label>
              <input
                id="cf-name"
                v-model="form.name"
                type="text"
                placeholder="怎么称呼你"
                required
                class="field-input"
              />
            </div>
            <div class="form-field">
              <label for="cf-email" class="field-label">邮箱 <span class="required">*</span></label>
              <input
                id="cf-email"
                v-model="form.email"
                type="email"
                placeholder="your@email.com"
                required
                class="field-input"
              />
            </div>
          </div>

          <div class="form-field">
            <label for="cf-subject" class="field-label">主题</label>
            <input
              id="cf-subject"
              v-model="form.subject"
              type="text"
              placeholder="简单描述一下需求或问题"
              class="field-input"
            />
          </div>

          <div class="form-field">
            <label for="cf-message" class="field-label">留言内容 <span class="required">*</span></label>
            <textarea
              id="cf-message"
              v-model="form.message"
              rows="6"
              placeholder="详细写一下你的需求、项目背景，或者希望咨询的问题..."
              required
              class="field-textarea"
            ></textarea>
          </div>

          <input
            v-model="form.website"
            type="text"
            tabindex="-1"
            autocomplete="off"
            class="hp-field"
            aria-hidden="true"
          />

          <div class="form-actions">
            <button type="submit" class="submit-btn" :disabled="submitting">
              <span v-if="!submitting">发送消息</span>
              <span v-else class="sending"><span class="spinner"></span>发送中...</span>
            </button>
            <button type="reset" class="reset-btn" @click="resetForm">清空</button>
          </div>

          <transition name="fade">
            <div v-if="submitted" class="success-toast">消息已收到，我会尽快回复。</div>
          </transition>
        </form>
      </div>
    </section>

    <section class="section guestbook-wrapper">
      <div class="container">
        <GuestbookSection />
      </div>
    </section>

    <section class="section faq-section">
      <div class="container">
        <h2 class="section-title">常见问题</h2>
        <div class="faq-list">
          <div v-for="(item, idx) in faqs" :key="idx" class="faq-item">
            <button class="faq-question" :class="{ active: openFaq === idx }" @click="toggleFaq(idx)">
              <span>{{ item.q }}</span>
              <span class="faq-icon">{{ openFaq === idx ? '-' : '+' }}</span>
            </button>
            <transition name="expand">
              <div v-show="openFaq === idx" class="faq-answer">
                <div class="faq-answer-content">{{ item.a }}</div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import GuestbookSection from '@/components/common/GuestbookSection.vue'
import wechatQrCode from '@/assets/wechat-qrcode.jpg'

async function readApiResult(response) {
  const text = await response.text()
  if (!text) return {}

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`API returned non-JSON response (${response.status})`)
  }
}

const qqIcon = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z" fill="currentColor"></path></svg>'
const wechatIcon = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M693.824 597.248c-15.104 0-27.392 12.224-27.392 27.328 0 15.232 12.288 27.52 27.392 27.52 15.232 0 27.52-12.288 27.52-27.52 0-15.104-12.288-27.328-27.52-27.328zM512 595.84c-15.104 0-27.392 12.288-27.392 27.392 0 15.168 12.288 27.456 27.392 27.456s27.392-12.288 27.392-27.456c0-15.104-12.288-27.392-27.392-27.392z" fill="currentColor"></path><path d="M512.512 245.76c-185.856 0-336.64 120.64-336.64 269.44 0 85.312 49.984 161.216 128 210.56l-32.192 96.64 112.832-56.384c39.936 11.264 82.688 17.216 128 17.216 185.92 0 336.64-120.704 336.64-269.504 0-148.736-150.72-267.968-336.64-267.968z m-133.12 178.56c-21.952 0-39.744-17.792-39.744-39.744 0-22.016 17.792-39.872 39.744-39.872 22.016 0 39.872 17.856 39.872 39.872 0 21.952-17.856 39.744-39.872 39.744z m266.24 0c-22.016 0-39.872-17.792-39.872-39.744 0-22.016 17.856-39.872 39.872-39.872 21.952 0 39.744 17.856 39.744 39.872 0 21.952-17.792 39.744-39.744 39.744z" fill="currentColor"></path></svg>'
const githubIcon = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M511.957333 21.333333C241.024 21.333333 21.333333 240.981333 21.333333 512c0 216.832 140.544 400.725333 335.573334 465.664 24.490667 4.394667 32.256-10.069333 32.256-23.082667 0-11.690667 0.256-44.245333 0-85.205333-136.448 29.610667-164.736-64.64-164.736-64.64-22.314667-56.704-54.4-71.765333-54.4-71.765333-44.586667-30.464 3.285333-29.824 3.285333-29.824 49.194667 3.413333 75.178667 50.517333 75.178667 50.517333 43.776 75.008 114.816 53.333333 142.762666 40.789333 4.522667-31.658667 17.152-53.376 31.189334-65.536-108.970667-12.458667-223.488-54.485333-223.488-242.602666 0-53.546667 19.114667-97.322667 50.517333-131.669334-5.034667-12.330667-21.930667-62.293333 4.778667-129.834666 0 0 41.258667-13.184 134.912 50.346666a469.802667 469.802667 0 0 1 122.88-16.554666c41.642667 0.213333 83.626667 5.632 122.88 16.554666 93.653333-63.488 134.784-50.346667 134.784-50.346666 26.752 67.541333 9.898667 117.504 4.864 129.834666 31.402667 34.346667 50.474667 78.122667 50.474666 131.669334 0 188.586667-114.730667 230.016-224.042666 242.090666 17.578667 15.232 33.578667 44.672 33.578666 90.453334v135.850666c0 13.141333 7.936 27.605333 32.853334 22.869334C862.250667 912.597333 1002.666667 728.746667 1002.666667 512 1002.666667 240.981333 783.018667 21.333333 511.957333 21.333333z" fill="currentColor"></path></svg>'
const mailIcon = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M838.954667 234.666667H170.666667c-3.626667 0-7.168 0.448-10.56 1.322666l323.690666 323.669334a21.333333 21.333333 0 0 0 30.165334 0L838.954667 234.666667z m46.144 14.186666l-260.693334 260.693334 262.933334 262.912c5.44-7.168 8.661333-16.106667 8.661333-25.792V277.333333c0-10.944-4.117333-20.906667-10.88-28.48zM843.861333 789.333333l-249.6-249.621333-50.133333 50.133333a64 64 0 0 1-90.517333 0l-50.112-50.133333L156.373333 786.88c4.48 1.578667 9.28 2.453333 14.314667 2.453333h673.194667zM128.661333 754.218667L373.333333 509.525333 129.578667 265.813333A42.709333 42.709333 0 0 0 128 277.333333v469.333334c0 2.56 0.213333 5.098667 0.661333 7.552zM170.666667 192h682.666666a85.333333 85.333333 0 0 1 85.333334 85.333333v469.333334a85.333333 85.333333 0 0 1-85.333334 85.333333H170.666667a85.333333 85.333333 0 0 1-85.333334-85.333333V277.333333a85.333333 85.333333 0 0 1 85.333334-85.333333z" fill="currentColor"></path></svg>'
const idleFishIcon = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M81 48m139 0l650 0q139 0 139 139l0 650q0 139-139 139l-650 0q-139 0-139-139l0-650q0-139 139-139Z" fill="#FFDA44"></path><path d="M869 469h-94v33h94v-33z m47.995-23.5c0.003 0.166 0.005 0.333 0.005 0.5v161c0 13.255-10.745 24-24 24-2.39 0-4.699-0.35-6.878-1H607c-13.255 0-24-10.745-24-24V445c0-13.255 10.745-24 24-24h130.729c3.801-2.527 8.364-4 13.271-4s9.47 1.473 13.271 4H893c13.255 0 24 10.745 24 24 0 0.167-0.002 0.334-0.005 0.5zM869 582v-32h-94v32h94zM727 469h-96v33h96v-33z m0 113v-32h-96v32h96z m141-205H630v3c0 13.255-10.745 24-24 24s-24-10.745-24-24v-27c0-13.255 10.745-24 24-24h286c13.255 0 24 10.745 24 24v27c0 13.255-10.745 24-24 24s-24-10.745-24-24v-3z m-384-30c13.255 0 24 10.745 24 24v300c0 13.255-10.745 24-24 24s-24-10.745-24-24V508h-95v163c0 13.255-10.745 24-24 24s-24-10.745-24-24V508h-96v163c0 13.255-10.745 24-24 24s-24-10.745-24-24V371c0-13.255 10.745-24 24-24s24 10.745 24 24v89h96v-8c0-13.255 10.745-24 24-24s24 10.745 24 24v8h95v-65H333c-13.255 0-24-10.745-24-24s10.745-24 24-24h151zM269 565c13.255 0 24 10.745 24 24v82c0 13.255-10.745 24-24 24s-24-10.745-24-24v-82c0-13.255 10.745-24 24-24z m-4-236c13.255 0 24 10.745 24 24v27c0 13.255-10.745 24-24 24s-24-10.745-24-24v-27c0-13.255 10.745-24 24-24z m341 318c13.255 0 24 10.745 24 24s-10.745 24-24 24-24-10.745-24-24 10.745-24 24-24z m97 0c13.255 0 24 10.745 24 24s-10.745 24-24 24-24-10.745-24-24 10.745-24 24-24z m95 0c13.255 0 24 10.745 24 24s-10.745 24-24 24-24-10.745-24-24 10.745-24 24-24z m95 0c13.255 0 24 10.745 24 24s-10.745 24-24 24-24-10.745-24-24 10.745-24 24-24z m-481-82c13.255 0 24 10.745 24 24v82c0 13.255-10.745 24-24 24s-24-10.745-24-24v-82c0-13.255 10.745-24 24-24z" fill="#000000"></path></svg>'

const channels = [
  {
    name: 'QQ',
    label: '3230801354',
    desc: '适合快速沟通需求与问题',
    url: 'https://wpa.qq.com/msgrd?v=3&uin=3230801354&site=qq&menu=yes',
    target: '_blank',
    bg: 'linear-gradient(135deg, rgba(18,183,245,0.16), rgba(6,182,212,0.2))',
    icon: qqIcon,
    linkText: '前往联系 ->'
  },
  {
    name: '微信',
    label: '扫码添加',
    desc: '适合私聊沟通合作、建站和长期维护需求',
    action: 'wechat-hover',
    bg: 'linear-gradient(135deg, rgba(34,197,94,0.16), rgba(16,185,129,0.2))',
    icon: wechatIcon,
    linkText: '悬浮查看二维码'
  },
  {
    name: 'GitHub',
    label: 'CNCG-dev',
    desc: '查看项目、代码与开发记录',
    url: 'https://github.com/CNCG-dev',
    target: '_blank',
    bg: 'linear-gradient(135deg, rgba(99,102,241,0.14), rgba(139,92,246,0.2))',
    icon: githubIcon,
    linkText: '前往主页 ->'
  },
  {
    name: '邮箱',
    label: '3230801354@qq.com',
    desc: '适合正式合作、报价与资料往来',
    url: 'mailto:3230801354@qq.com',
    target: '_self',
    bg: 'linear-gradient(135deg, rgba(34,197,94,0.14), rgba(6,182,212,0.16))',
    icon: mailIcon,
    linkText: '发送邮件 ->'
  },
  {
    name: '闲鱼',
    label: '个人主页',
    desc: '查看服务入口与交易渠道',
    url: 'https://www.goofish.com/personal?spm=a21ybx.home.nav.1.4c053da6c7Qiup',
    target: '_blank',
    bg: 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(239,68,68,0.16))',
    icon: idleFishIcon,
    linkText: '前往查看 ->'
  }
]

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
  website: ''
})

const submitting = ref(false)
const submitted = ref(false)
const openFaq = ref(null)

const faqs = [
  {
    q: '一般多久回复？',
    a: 'QQ 通常更快，邮箱一般会在 24 小时内处理。若事情比较紧急，建议优先通过 QQ 或微信联系。'
  },
  {
    q: '可以做定制开发吗？',
    a: '可以。无论是完整网站、单个功能模块，还是已有项目的改造与维护，都可以先沟通需求，再给出方案与报价。'
  },
  {
    q: '合作流程通常是怎样的？',
    a: '一般会先沟通需求，再确认范围、报价和排期，随后进入开发、验收与交付。较长期的项目会补充后续维护安排。'
  },
  {
    q: '支持哪些付款方式？',
    a: '目前以常见线上支付方式为主。对于金额较大的项目，可以提前沟通分阶段付款方案。'
  }
]

function toggleFaq(idx) {
  openFaq.value = openFaq.value === idx ? null : idx
}

async function handleSubmit() {
  if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
    alert('请填写必填项')
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    alert('请输入有效的邮箱地址')
    return
  }

  if (form.message.length > 2000) {
    alert('留言内容不能超过 2000 字')
    return
  }

  submitting.value = true

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        website: ''
      })
    })

    const result = await readApiResult(response)

    if (!response.ok) {
      throw new Error(result.error || '提交失败')
    }

    submitted.value = true
    resetForm()
    setTimeout(() => {
      submitted.value = false
    }, 8000)
  } catch (err) {
    console.error('提交失败:', err)
    alert('提交失败，请通过其他方式联系我')
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  form.name = ''
  form.email = ''
  form.subject = ''
  form.message = ''
  form.website = ''
  submitted.value = false
}
</script>

<style scoped>
.contact-page {
  position: relative;
  padding-top: 64px;
  overflow: hidden;
}

.contact-bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 72px 72px;
  opacity: 0.14;
  mask-image: radial-gradient(circle at 50% 18%, black 10%, transparent 58%);
  -webkit-mask-image: radial-gradient(circle at 50% 18%, black 10%, transparent 58%);
  pointer-events: none;
}

.contact-bg-glow {
  position: absolute;
  top: 110px;
  left: 50%;
  width: 560px;
  height: 560px;
  border-radius: 50%;
  transform: translateX(-50%);
  background: radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, transparent 68%);
  pointer-events: none;
  animation: contactGlowBreathe 7s ease-in-out infinite;
}

@keyframes contactGlowBreathe {
  0%, 100% { opacity: 0.45; transform: translateX(-50%) scale(1); }
  50% { opacity: 0.9; transform: translateX(-50%) scale(1.08); }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.section {
  position: relative;
  padding: var(--space-20) 0;
  z-index: 1;
}

.section-alt {
  background: color-mix(in srgb, var(--bg-secondary) 92%, transparent);
}

.fade-in-up { animation: fadeInUp 0.5s ease both; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-hero {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: calc(64px + 2rem) 0 2rem;
}

.page-title {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.title-underline {
  width: 48px;
  height: 3px;
  background: var(--gradient-primary);
  border-radius: 2px;
  margin: 0 auto 1rem;
  transform: scaleX(0);
  animation: ulSlideIn 0.5s ease 0.15s forwards;
}

@keyframes ulSlideIn {
  to { transform: scaleX(1); }
}

.page-subtitle {
  max-width: 620px;
  margin: 0 auto;
  color: var(--text-secondary);
  line-height: 1.7;
}

.channels-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  align-items: stretch;
}

.channel-shell {
  min-width: 0;
}

.channel-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 272px;
  height: 100%;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: color-mix(in srgb, var(--bg-card) 94%, transparent);
  text-decoration: none;
  font: inherit;
  text-align: left;
  color: inherit;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
}

.channel-card:hover,
.channel-card:focus-visible {
  transform: translateY(-4px) scale(1.018);
  border-color: var(--accent);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.1), 0 10px 24px rgba(6, 182, 212, 0.1);
}

.channel-card:focus-visible {
  outline: none;
}

.channel-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  margin-bottom: 1rem;
  color: var(--text-primary);
  flex: 0 0 auto;
  overflow: visible;
}

.channel-icon-svg {
  display: inline-flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.channel-icon-svg :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}

.channel-name {
  margin: 0 0 0.35rem;
  color: var(--text-primary);
  font-size: 1.05rem;
}

.channel-label {
  margin: 0 0 0.45rem;
  color: var(--accent);
  font-size: 0.88rem;
}

.channel-desc {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.72;
  flex: 1;
}

.channel-link {
  margin-top: 1rem;
  color: var(--accent);
  font-weight: 600;
}

.channel-card-wechat {
  isolation: isolate;
}

.wechat-card-default,
.wechat-hover-panel {
  position: absolute;
  inset: 0;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  border-radius: inherit;
  transition: opacity 0.2s ease, transform 0.22s ease;
}

.wechat-card-default {
  opacity: 1;
  transform: scale(1);
}

.wechat-hover-panel {
  opacity: 0;
  transform: scale(0.98);
  pointer-events: none;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,255,255,0.98)),
    linear-gradient(135deg, rgba(34,197,94,0.08), rgba(16,185,129,0.12));
}

[data-theme="dark"] .wechat-hover-panel {
  background:
    linear-gradient(180deg, rgba(18,24,33,0.96), rgba(18,24,33,0.98)),
    linear-gradient(135deg, rgba(34,197,94,0.08), rgba(16,185,129,0.12));
}

.channel-shell-wechat:hover .wechat-card-default,
.channel-shell-wechat:focus-within .wechat-card-default {
  opacity: 0;
  transform: scale(1.01);
}

.channel-shell-wechat:hover .wechat-hover-panel,
.channel-shell-wechat:focus-within .wechat-hover-panel {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}

.wechat-hover-image {
  width: 100%;
  max-width: 182px;
  margin: 0;
  border-radius: 14px;
  border: 1px solid var(--border);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.form-container {
  max-width: 760px;
}

.form-header {
  text-align: center;
  margin-bottom: 1.75rem;
}

.form-title {
  margin: 0 0 0.45rem;
  font-size: 1.5rem;
}

.form-subtitle {
  color: var(--text-secondary);
}

.contact-form {
  padding: 2rem;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: color-mix(in srgb, var(--bg-card) 94%, transparent);
  backdrop-filter: blur(6px);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.form-field {
  margin-bottom: 1rem;
}

.field-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.required { color: #ef4444; }

.field-input,
.field-textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font: inherit;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field-input:focus,
.field-textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.12);
}

.field-textarea {
  resize: vertical;
  min-height: 140px;
  line-height: 1.7;
}

.hp-field {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.submit-btn,
.reset-btn {
  height: 44px;
  padding: 0 1.25rem;
  border-radius: 999px;
  font: inherit;
  cursor: pointer;
}

.submit-btn {
  border: none;
  background: var(--accent);
  color: white;
  font-weight: 600;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.reset-btn {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
}

.sending {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-toast {
  margin-top: 1rem;
  padding: 0.9rem 1rem;
  border: 1px solid rgba(34,197,94,0.24);
  border-radius: 12px;
  background: rgba(34,197,94,0.08);
  color: #16a34a;
}

.section-title {
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.5rem;
}

.faq-list {
  max-width: 760px;
  margin: 0 auto;
}

.faq-item {
  margin-bottom: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: color-mix(in srgb, var(--bg-card) 94%, transparent);
  overflow: hidden;
}

.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.15rem;
  border: none;
  background: transparent;
  color: var(--text-primary);
  text-align: left;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.faq-question.active { color: var(--accent); }

.faq-icon {
  flex: 0 0 auto;
  font-size: 1.15rem;
}

.faq-answer {
  padding: 0 1.15rem 1.15rem;
}

.faq-answer-content {
  padding: 0.95rem 1rem;
  border-radius: 12px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  line-height: 1.75;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.22s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.expand-enter-active, .expand-leave-active { transition: all 0.25s ease; overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
.expand-enter-to, .expand-leave-from { opacity: 1; max-height: 240px; }

[data-theme="dark"] .contact-bg-grid {
  opacity: 0.08;
}

[data-theme="dark"] .contact-bg-glow {
  background: radial-gradient(circle, rgba(74, 222, 128, 0.05) 0%, transparent 68%);
}

[data-theme="dark"] .channel-card {
  border-color: rgba(148, 163, 184, 0.16);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.01);
}

[data-theme="dark"] .channel-card:hover,
[data-theme="dark"] .channel-card:focus-visible {
  transform: translateY(-2px) scale(1.008);
  border-color: rgba(34, 197, 94, 0.45);
  box-shadow:
    0 0 0 1px rgba(34, 197, 94, 0.18),
    0 0 22px rgba(34, 197, 94, 0.12),
    0 0 36px rgba(6, 182, 212, 0.08);
}

@media (max-width: 980px) {
  .channels-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .section { padding: var(--space-12) 0; }
  .form-row { grid-template-columns: 1fr; }
  .contact-form { padding: 1.25rem; }
}

@media (max-width: 520px) {
  .channels-grid {
    grid-template-columns: 1fr;
  }

  .channel-card {
    min-height: 252px;
  }

  .wechat-hover-image {
    max-width: 168px;
  }
}
</style>
