<template>
  <main class="contact-page">
    <!-- 页面标题区 -->
    <section class="page-hero">
      <div class="container">
        <h1 class="page-title fade-in-up">联系我</h1>
        <div class="title-underline"></div>
        <p class="page-subtitle fade-in-up" style="animation-delay:0.1s">
          有项目想法、技术问题或合作意向？随时联系
        </p>
      </div>
    </section>

    <!-- 联系方式卡片网格 -->
    <section class="section contact-channels">
      <div class="container">
        <div class="channels-grid" ref="channelsRef">
          <a v-for="(ch, idx) in channels" :key="ch.name"
             :href="ch.url" :target="ch.target" rel="noopener noreferrer"
             class="channel-card fade-in-up"
             :style="{ animationDelay: idx * 100 + 'ms' }"
          >
            <span class="channel-icon-wrap" :style="{ background: ch.bg }">
              <span class="channel-icon" v-html="ch.icon"></span>
            </span>
            <h3 class="channel-name">{{ ch.name }}</h3>
            <p class="channel-label">{{ ch.label }}</p>
            <p class="channel-desc">{{ ch.desc }}</p>
            <span class="channel-arrow">→</span>
          </a>
        </div>
      </div>
    </section>

    <!-- 联系表单 -->
    <section class="section section-alt form-section">
      <div class="container form-container">
        <div class="form-header fade-in-up" ref="formHeaderRef">
          <h2 class="form-title">发送消息</h2>
          <p class="form-subtitle">填写以下表单，我会尽快回复您</p>
        </div>

        <form class="contact-form fade-in-up" style="animation-delay:0.15s" @submit.prevent="handleSubmit" ref="formRef">
          <div class="form-row">
            <div class="form-field">
              <label for="cf-name" class="field-label">姓名 <span class="required">*</span></label>
              <input id="cf-name" v-model="form.name" type="text" placeholder="您的称呼" required class="field-input" />
            </div>
            <div class="form-field">
              <label for="cf-email" class="field-label">邮箱 <span class="required">*</span></label>
              <input id="cf-email" v-model="form.email" type="email" placeholder="your@email.com" required class="field-input" />
            </div>
          </div>

          <div class="form-field">
            <label for="cf-subject" class="field-label">主题</label>
            <input id="cf-subject" v-model="form.subject" type="text" placeholder="简述您的需求或问题" class="field-input" />
          </div>

          <div class="form-field">
            <label for="cf-message" class="field-label">留言内容 <span class="required">*</span></label>
            <textarea id="cf-message" v-model="form.message" rows="5" placeholder="详细描述您的需求、项目背景或想要咨询的问题..." required class="field-textarea"></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-btn" :disabled="submitting">
              <span v-if="!submitting">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                发送消息
              </span>
              <span v-else class="sending">
                <span class="spinner"></span>
                发送中...
              </span>
            </button>
            <button type="reset" class="reset-btn" @click="resetForm">清空</button>
          </div>

          <!-- 成功提示 -->
          <transition name="fade">
            <div v-if="submitted" class="success-toast">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              消息已收到！我会尽快回复。
            </div>
          </transition>
        </form>
      </div>
    </section>

    <!-- 留言板 -->
    <section class="section guestbook-wrapper">
      <div class="container">
        <GuestbookSection />
      </div>
    </section>

    <!-- FAQ / 常见问题 -->
    <section class="section faq-section">
      <div class="container">
        <h2 class="section-title fade-in-up">常见问题</h2>
        <div class="faq-list" ref="faqRef">
          <div v-for="(item, idx) in faqs" :key="idx"
               class="faq-item fade-in-up"
               :style="{ animationDelay: idx * 80 + 'ms' }"
          >
            <button class="faq-question" @click="toggleFaq(idx)" :class="{ active: openFaq === idx }">
              <span class="faq-question-text">{{ item.q }}</span>
              <span class="faq-icon">
                <svg v-if="openFaq !== idx" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </span>
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
import { ref, reactive } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver.js'
import GuestbookSection from '@/components/common/GuestbookSection.vue'

const channelsRef = ref(null)
const formHeaderRef = ref(null)
const formRef = ref(null)
const faqRef = ref(null)

const { isVisible: channelsVisible } = useIntersectionObserver(channelsRef, { threshold: 0.1 })
const { isVisible: formVisible } = useIntersectionObserver(formHeaderRef, { threshold: 0.1 })
const { isVisible: faqVisible } = useIntersectionObserver(faqRef, { threshold: 0.1 })

/* ── 联系渠道 ── */
const channels = [
  {
    name: 'QQ',
    label: '3230801354',
    desc: '在线沟通最快捷的方式',
    url: 'tencent://message/?uin=3230801354',
    target: '_self',
    bg: 'linear-gradient(135deg, #12b7f520, #06b6d420)',
    icon: '<svg width="28" height="28" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z" fill="#06b6d4"/></svg>',
  },
  {
    name: 'GitHub',
    label: 'CNCG',
    desc: '开源项目与代码协作',
    url: 'https://github.com/CNCG-dev',
    target: '_blank',
    bg: 'linear-gradient(135deg, #6e40c920, #8b5cf620)',
    icon: '<svg width="28" height="28" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M1023.560892 524.587752c0 114.331752-32.549236 217.148443-97.647709 308.450075-65.047295 91.301632-149.132822 154.455339-252.205404 189.512299-11.975662 2.303012-20.778286 0.716493-26.305515-4.759558a27.584966 27.584966 0 0 1-8.342021-20.471218V853.150798c0-44.166653-11.566238-76.511177-34.647536-96.982394a446.272549 446.272549 0 0 0 68.32269-12.282731c20.16415-5.476051 41.044792-14.329852 62.590748-26.612583a187.311643 187.311643 0 0 0 53.992837-45.446104c14.432209-18.014672 26.203159-41.914819 35.312851-71.751618 9.109692-29.8368 13.664538-64.074912 13.664538-102.765514 0-55.118754-17.554069-102.049021-52.61103-140.739623 16.376974-41.454216 14.636921-87.872703-5.373695-139.357815-12.436265-4.094244-30.399759-1.535341-53.941659 7.523172a355.17563 355.17563 0 0 0-61.311297 30.041513l-25.333132 16.376974a462.137743 462.137743 0 0 0-127.945112-17.707604 462.137743 462.137743 0 0 0-127.945111 17.758782 589.571074 589.571074 0 0 0-28.301459-18.424096c-11.77095-7.31846-30.34858-16.069906-55.681713-26.305515-25.281954-10.235609-44.422543-13.306292-57.31941-9.212048-19.498835 51.433935-21.085354 97.852421-4.606024 139.306637-35.108139 38.690602-52.713386 85.620869-52.713386 140.739623 0 38.690602 4.606024 72.826357 13.715716 102.458445 9.109692 29.58091 20.778286 53.481057 34.954605 71.700441a180.658498 180.658498 0 0 0 53.634591 45.753172c21.545957 12.282731 42.477777 21.18771 62.641926 26.612583 20.215328 5.527229 42.989557 9.621472 68.32269 12.333909-17.758781 16.376974-28.659705 39.867697-32.651593 70.369811a129.941055 129.941055 0 0 1-29.990334 10.235609 184.087426 184.087426 0 0 1-37.974109 3.428929c-14.688099 0-29.171485-4.913092-43.654872-14.688099-14.432209-9.826185-26.766117-24.053681-37.001726-42.682489a109.162769 109.162769 0 0 0-32.293346-35.517563c-13.101579-9.109692-24.104859-14.585743-33.009839-16.376974l-13.306292-2.047122c-9.314404 0-15.762838 1.023561-19.345301 3.070683-3.582463 2.047122-4.606024 4.606024-3.326572 7.83024a37.769397 37.769397 0 0 0 5.987831 9.570295 49.182101 49.182101 0 0 0 8.700267 8.188487l4.606024 3.377751c9.826185 4.606024 19.447657 13.255114 29.017952 25.998447 9.570294 12.743333 16.581686 24.360749 20.982998 34.80107l6.653146 15.71166c5.783119 17.298179 15.558126 31.320963 29.376197 42.017174 13.766894 10.747389 28.659705 17.554069 44.627255 20.471218 15.96755 2.968327 31.423319 4.606024 46.316131 4.810736 14.841633 0.204712 27.22672-0.562958 37.001726-2.405368l15.302235-2.712436c0 17.298179 0.102356 37.564685 0.358247 60.799517l0.307068 36.848192c0 8.188487-2.86597 15.046345-8.700268 20.471218-5.731941 5.527229-14.636921 7.113748-26.612583 4.810736-103.072582-35.056961-187.158109-98.261846-252.205404-189.512299C32.549236 741.736195 0 638.919504 0 524.587752c0-95.191163 22.876586-182.910331 68.629758-263.31104a516.028224 516.028224 0 0 1 186.288082-190.894106A491.309228 491.309228 0 0 1 511.780446 0.012795a491.309228 491.309228 0 0 1 256.913784 70.369811 516.028224 516.028224 0 0 1 186.236905 190.894106C1000.684306 341.626242 1023.560892 429.447767 1023.560892 524.587752z" fill="#1e293b"/></svg>',
  },
  {
    name: 'Email',
    label: '3230801354@qq.com',
    desc: '正式合作与商务洽谈',
    url: 'mailto:3230801354@qq.com',
    target: '_self',
    bg: 'linear-gradient(135deg, #22c55e20, #06b6d420)',
    icon: '<svg width="28" height="28" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512.345366 6.139837c279.580556 0 506.184551 226.64902 506.184551 506.185574 0 279.580556-226.603994 506.184551-506.184551 506.184551-279.534508 0-506.184551-226.603994-506.184551-506.184551C6.160815 232.788857 232.809835 6.139837 512.345366 6.139837L512.345366 6.139837zM515.268952 541.913287c-32.689517 0-28.170596-28.702716-65.288982-28.702716-16.786315 0-45.533033 30.651091-57.757448 40.926108-18.337647 15.371082-35.612079 29.633924-53.329603 45.445028l-93.148493 78.754668c-23.342638 22.147416 1.727341 37.116339 30.695093 37.116339L746.12683 715.452715c13.198603 0 41.370223-6.553253 41.370223-17.540492 0-21.437242-12.757558-24.049742-35.346019-44.203758L605.627912 527.960507c-23.51967-22.412452-37.47245-24.228821-62.897515-3.233648-4.428869 3.631714-8.060583 6.112208-12.667507 9.655917C525.944082 537.483394 521.469164 541.913287 515.268952 541.913287L515.268952 541.913287zM182.535825 414.524968l0 206.938096c0 17.364483 5.493108 31.626301 23.121604 24.892947 7.043417-2.65855 77.868485-63.33856 86.283132-71.445192l70.693062-59.839877c12.977569-10.453073 38.003546-28.879748 38.003546-41.636283 0-14.926968-10.719132-19.400862-24.095791-30.030967l-122.161271-95.939049c-13.81975-10.985192-14.616906-17.983583-34.016745-4.960988C202.867896 354.286002 182.535825 385.77825 182.535825 414.524968L182.535825 414.524968zM625.116779 468.650703c0 16.123212 9.742898 18.957771 20.286022 29.05678l18.159592 15.281031c2.835581 2.260483 3.809769 3.765767 6.64535 6.158257l62.807465 53.417607c4.782933 4.428869 8.060583 6.687306 12.71151 11.072173l31.051203 26.310226c11.692297 10.453073 55.720046 57.361429 62.629409 23.653723 4.428869-21.527292 2.214435-174.782745 2.214435-207.91433 0-40.838104-24.8909-80.880075-48.457642-88.49859-13.508665-4.384867-10.984169 0-24.758893 10.453073l-100.768031 79.107709C653.375379 438.309674 625.116779 455.629131 625.116779 468.650703L625.116779 468.650703zM313.069787 326.912561c0 5.315052 16.96437 17.894555 21.570271 21.438265l48.28061 37.737486c8.28264 6.201236 16.122189 12.623505 24.095791 18.868743l72.331375 56.607252c16.609283 12.490475 14.83794 15.058974 35.922141 15.058974 14.174837 0 38.35761-22.500457 52.354392-33.662681l120.477932-94.433766c6.511297-5.050016 21.437242-14.793938 21.437242-21.615297 0-3.720741-2.65855-6.333242-6.377244-6.333242L319.403029 320.578296C315.683311 320.578296 313.069787 323.19182 313.069787 326.912561z" fill="#009FE8"/></svg>',
  },
  {
    name: '闲鱼',
    label: 'CNCG',
    desc: '模板、工具与服务购买',
    url: 'https://www.goofish.com/',
    target: '_blank',
    bg: 'linear-gradient(135deg, #f59e0b20, #ef444420)',
    icon: '<svg width="28" height="28" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h1024v1024H0z" fill="#FFFFFF"/><path d="M0 0m170.666667 0l682.666666 0q170.666667 0 170.666667 170.666667l0 682.666666q0 170.666667-170.666667 170.666667l-682.666666 0q-170.666667 0-170.666667-170.666667l0-682.666666q0-170.666667 170.666667-170.666667Z" fill="#FEE50F"/><path d="M748.16 676.437333c66.901333 16.426667 118.058667 17.194667 153.173333 3.584a27.52 27.52 0 0 1 35.413334 14.762667 26.197333 26.197333 0 0 1-15.232 34.304c-47.530667 18.432-109.653333 17.493333-185.472-1.152-50.474667-9.984-91.989333-8.96-125.098667-0.512-10.965333 2.773333-20.053333 6.186667-27.178667 9.728l-2.090666 1.109333-3.669334 2.133334-1.962666 1.365333-2.389334 1.28-1.706666 0.768-3.029334 1.066667-3.968 0.768c-14.634667-0.768-24.106667-5.674667-28.501333-14.805334-4.394667-9.130667-2.176-19.413333 6.570667-30.933333l0.682666-0.682667 0.042667-0.042666h0.256l1.706667-1.322667 2.048-1.408 1.024-0.64c2.816-1.792 6.229333-3.712 10.112-5.632a192.426667 192.426667 0 0 1 38.186666-13.866667c41.258667-10.538667 91.221333-11.733333 151.082667 0.128zM195.84 561.92l17.792 7.552c5.802667 5.12 8.533333 11.178667 8.192 18.346667L221.44 705.28a25.429333 25.429333 0 0 1-7.936 17.92 27.264 27.264 0 0 1-18.901333 7.893333c-5.034667 0.170667-10.794667-2.261333-17.237334-7.381333a25.642667 25.642667 0 0 1-8.106666-18.346667l0.085333-118.826666c0.128-6.528 3.328-12.117333 8.405333-17.109334a23.125333 23.125333 0 0 1 18.090667-7.509333z m240.512-242.602667c9.685333 2.133333 16.042667 4.821333 19.072 7.936 4.522667 4.693333 7.253333 10.837333 7.125333 17.365334l-2.048 360.448a25.386667 25.386667 0 0 1-7.978666 17.92 23.381333 23.381333 0 0 1-18.517334 6.698666c-4.906667-0.213333-10.965333-2.304-18.218666-6.357333a26.922667 26.922667 0 0 1-7.552-18.133333l2.261333-207.786667-108.586667 0.298667-2.858666 207.573333a23.808 23.808 0 0 1-7.765334 17.28 22.869333 22.869333 0 0 1-18.090666 7.552c-4.48-0.085333-10.581333-2.218667-18.218667-6.4a22.101333 22.101333 0 0 1-8.149333-18.346667l2.389333-208.341333-108.544 0.298667-2.432 208.341333a24.021333 24.021333 0 0 1-8.362667 17.152 22.442667 22.442667 0 0 1-18.346666 8.106667c-4.864-0.256-10.752-2.986667-17.621334-8.192a19.242667 19.242667 0 0 1-8.533333-17.152l2.218667-361.045334a25.386667 25.386667 0 0 1 7.978666-17.92 25.301333 25.301333 0 0 1 18.517334-6.656c4.906667 0.213333 10.922667 2.56 18.048 6.912 5.76 5.12 8.064 10.453333 7.722666 17.578667l0.426667 102.741333 108.629333-0.256 0.298667-11.093333c0.298667-7.125333 3.498667-12.714667 8.746667-18.346667a21.333333 21.333333 0 0 1 17.28-7.082666c4.906667 0.213333 11.093333 2.602667 18.645333 7.168a30.72 30.72 0 0 1 8.192 18.346666l-0.938667 10.88 110.421334 0.298667-0.170667-77.013333H268.288c-9.685333-2.133333-16.042667-4.778667-19.072-7.936a26.88 26.88 0 0 1-7.509333-18.133334 24.32 24.32 0 0 1 7.765333-17.28 26.282667 26.282667 0 0 1 18.688-7.338666z m-80.298667 242.005334l19.029334 7.936c4.565333 4.693333 7.253333 10.837333 6.954666 17.92l0.682667 118.485333a23.850667 23.850667 0 0 1-7.765333 17.322667 23.466667 23.466667 0 0 1-18.901334 7.893333c-4.906667-0.213333-10.88-2.730667-17.877333-7.552a22.314667 22.314667 0 0 1-7.936-16.938667l0.128-118.869333a24.576 24.576 0 0 1 7.552-18.688 29.610667 29.610667 0 0 1 18.133333-7.509333z m208.938667-154.581334l323.072 0.938667 18.261333 6.229333a25.856 25.856 0 0 1 7.082667 13.653334l0.426667 4.138666-1.578667 4.693334 1.877333 4.394666 0.512 160.512-1.194666 3.498667 0.64 4.053333a20.778667 20.778667 0 0 1-7.168 17.152 23.850667 23.850667 0 0 1-14.592 7.594667l-4.266667 0.170667-322.304 0.554666-19.029333-7.765333a25.728 25.728 0 0 1-7.082667-13.610667l-0.469333-4.138666 1.194666-3.498667-0.853333-3.498667V431.786667c-0.256-7.168 1.706667-12.970667 6.570667-17.28a31.104 31.104 0 0 1 14.421333-7.04l4.48-0.725334z m135.552 138.069334l-108.8 0.853333-0.170667 38.570667 109.781334 0.128-0.810667-39.552z m161.28 0.426666l-109.226667 0.042667-0.213333 38.570667 109.824 0.128-0.426667-38.784z m-271.018667-88.746666l0.256 39.381333 109.184-0.085333 0.384-39.168-109.824-0.085334z m161.450667-0.170667l0.213333 39.338667 109.226667-0.085334 0.384-39.168-109.824-0.085333zM887.381333 298.666667l19.072 7.936a26.88 26.88 0 0 1 7.552 18.133333l-0.682666 30.72a19.541333 19.541333 0 0 1-6.570667 17.664 23.466667 23.466667 0 0 1-18.901333 7.936l-18.645334-7.168a21.973333 21.973333 0 0 1-6.912-17.92l-0.085333-5.973333-270.848-1.109334-0.341333 7.168a23.893333 23.893333 0 0 1-7.765334 17.28 26.794667 26.794667 0 0 1-17.664 8.277334l-19.072-7.893334a23.765333 23.765333 0 0 1-6.912-17.962666l-0.554666-31.104a24.576 24.576 0 0 1 7.594666-18.688 25.344 25.344 0 0 1 18.474667-6.698667L887.381333 298.666667z m-700.032 10.837333a32.768 32.768 0 1 1 0 65.536 32.768 32.768 0 0 1 0-65.536z" fill="#342318"/></svg>',
  },
]

/* ── 表单 ── */
const form = reactive({ name: '', email: '', subject: '', message: '' })
const submitting = ref(false)
const submitted = ref(false)

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
    alert('留言内容不能超过2000字')
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
        message: form.message.trim()
      })
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || '提交失败')
    }
    
    submitting.value = false
    submitted.value = true
    resetForm()
    setTimeout(() => { submitted.value = false }, 8000)
  } catch (err) {
    console.error('提交失败:', err)
    submitting.value = false
    alert('提交失败，请通过其他方式联系我')
  }
}

function resetForm() {
  form.name = ''
  form.email = ''
  form.subject = ''
  form.message = ''
  submitted.value = false
}

/* ── FAQ ── */
const openFaq = ref(null)

function toggleFaq(idx) {
  openFaq.value = openFaq.value === idx ? null : idx
}

const faqs = [
  { q: '一般多久回复？', a: 'QQ 消息通常在 1 小时内回复，邮件一般在 24 小时内回复。如果遇到紧急情况，建议直接通过 QQ 联系。' },
  { q: '可以定制开发吗？', a: '当然可以！无论是完整网站、单个功能模块还是 UI 设计，都可以根据需求定制。先通过表单或 QQ 告诉我大致需求，我会给出初步方案和报价。' },
  { q: '合作的流程是怎样的？', a: '通常流程：需求沟通 → 方案确认 → 报价签约 → 开发迭代 → 验收交付 → 售后维护。小改动可能只需要几天，大型项目需要数周。' },
  { q: '支持哪些付款方式？', a: '目前支持支付宝、微信支付。对于较大金额的项目，可协商分期付款（如 50% 预付 + 50% 验收后）。' },
]
</script>

<style scoped>
/* ── 通用 ── */
.contact-page { padding-top: 64px; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 var(--space-6); }
.section { padding: var(--space-20) 0; }
.fade-in-up { animation: fadeInUp 0.5s var(--ease-out) both; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

/* ── 页面顶部 ── */
.page-hero { text-align: center; padding-top: calc(64px + 2rem); padding-bottom: 2rem; }
.page-title { font-size: clamp(1.75rem, 3vw, 2.25rem); font-weight: 700; letter-spacing: var(--letter-tight); color: var(--text-primary); margin-bottom: 0.75rem; }
.title-underline { width: 48px; height: 3px; background: var(--gradient-primary); border-radius: 2px; margin: 0 auto 1rem; transform: scaleX(0); animation: ulSlideIn 0.5s var(--ease-out) 0.15s forwards; }
@keyframes ulSlideIn { to { transform: scaleX(1); } }
.page-subtitle { font-size: 1rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto; }

/* ── 联系方式网格 ── */
.channels-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.25rem; }

.channel-card {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 2rem 1.25rem; background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-xl); text-decoration: none;
  transition: all var(--duration-slow) var(--ease-out);
}
.channel-card:hover { border-color: var(--accent); box-shadow: 0 8px 24px rgba(6, 182, 212, 0.25), 0 4px 12px rgba(6, 182, 212, 0.15); transform: translateY(-4px); }
.channel-icon-wrap {
  width: 56px; height: 56px; border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 1rem; transition: transform var(--duration-normal) var(--ease-bounce);
  overflow: hidden;
}

/* 闲鱼图标圆形 */
.channel-card:nth-child(4) .channel-icon-wrap {
  border-radius: 50%;
}
.channel-card:hover .channel-icon-wrap { transform: scale(1.1); }
.channel-icon { color: var(--accent); width: 28px; height: 28px; transition: all var(--duration-normal) var(--ease-out); }
.channel-card:hover .channel-icon { transform: scale(1.1); }

/* 暗色模式下的图标样式 */
[data-theme="dark"] .channel-icon { color: #22d3ee; }
[data-theme="dark"] .channel-card:hover .channel-icon {
  color: #67e8f9;
  filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.6)) drop-shadow(0 0 16px rgba(34, 211, 238, 0.3));
}

/* 暗色模式下GitHub图标更亮 */
[data-theme="dark"] .channel-card:nth-child(2) .channel-icon { color: #60a5fa; }
[data-theme="dark"] .channel-card:nth-child(2):hover .channel-icon {
  color: #93c5fd;
  filter: drop-shadow(0 0 8px rgba(96, 165, 250, 0.6)) drop-shadow(0 0 16px rgba(96, 165, 250, 0.3));
}
.channel-name { font-size: 1.05rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem; }
.channel-label { font-size: 0.82rem; color: var(--accent); font-weight: 500; margin-bottom: 0.4rem; }
.channel-desc { font-size: 0.78rem; color: var(--text-muted); line-height: 1.5; }
.channel-arrow {
  margin-top: auto; padding-top: 0.75rem; font-size: 1rem; color: var(--text-muted);
  transition: all var(--duration-normal) ease;
}
.channel-card:hover .channel-arrow { color: var(--accent); transform: translateX(4px); }

/* ── 联系表单 ── */
.form-section { background: var(--bg-secondary); }
.form-container { max-width: 720px; margin: 0 auto; }
.form-header { text-align: center; margin-bottom: 2rem; }
.form-title { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; }
.form-subtitle { font-size: 0.9rem; color: var(--text-secondary); }

.contact-form {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-xl); padding: 2rem; position: relative;
}
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
@media (max-width: 560px) { .form-row { grid-template-columns: 1fr; } }

.form-field { margin-bottom: 1.25rem; }
.field-label { display: block; font-size: 0.85rem; font-weight: 500; color: var(--text-primary); margin-bottom: 0.5rem; }
.required { color: #ef4444; }

.field-input,
.field-textarea {
  width: 100%; padding: 0.7rem 1rem; background: var(--bg-secondary);
  border: 1.5px solid var(--border); border-radius: var(--radius-md);
  font-size: 0.9rem; color: var(--text-primary); outline: none;
  transition: all var(--duration-normal) var(--ease-out);
  font-family: inherit;
}
.field-input:focus, .field-textarea:focus {
  border-color: transparent; box-shadow: 0 0 0 2px var(--accent), var(--glow-accent-sm);
}
.field-input::placeholder, .field-textarea::placeholder { color: var(--text-muted); }
.field-textarea { resize: vertical; min-height: 120px; line-height: 1.6; }

.form-actions { display: flex; align-items: center; gap: 0.75rem; margin-top: 0.5rem; }

.submit-btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.7rem 1.75rem; background: var(--accent); color: white;
  border: none; border-radius: var(--radius-full); font-size: 0.9rem; font-weight: 600;
  cursor: pointer; transition: all var(--duration-normal) ease;
}
.submit-btn:hover:not(:disabled) { background: var(--accent-hover); transform: translateY(-1px); box-shadow: var(--glow-accent-soft); }
.submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.sending { display: flex; align-items: center; gap: 0.5rem; }
.spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.reset-btn {
  padding: 0.7rem 1.25rem; background: transparent; color: var(--text-secondary);
  border: 1.5px solid var(--border); border-radius: var(--radius-full);
  font-size: 0.87rem; cursor: pointer; transition: all var(--duration-normal) var(--ease-out);
}
.reset-btn:hover { border-color: var(--accent); color: var(--accent); }

.success-toast {
  display: flex; align-items: center; gap: 0.5rem;
  margin-top: 1.25rem; padding: 0.85rem 1.25rem;
  background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.25);
  border-radius: var(--radius-md); color: #16a34a; font-size: 0.88rem; font-weight: 500;
}
[data-theme="dark"] .success-toast { background: rgba(74,222,128,0.08); border-color: rgba(74,222,128,0.2); color: #4ade80; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── FAQ ── */
.faq-section { background: var(--bg-primary); }
.faq-list { max-width: 720px; margin: 0 auto; }

.faq-item {
  margin-bottom: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-out);
}
.faq-item:hover {
  border-color: var(--accent);
  box-shadow: 0 2px 8px rgba(6, 182, 212, 0.1);
}

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  padding: 1.1rem 1.25rem;
  background: none;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  text-align: left;
  transition: color var(--duration-fast) ease;
}
.faq-question:hover { color: var(--accent); }
.faq-question.active { color: var(--accent); }

.faq-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: 50%;
  transition: all var(--duration-normal) ease;
  color: var(--text-secondary);
}
.faq-question.active .faq-icon {
  background: var(--accent);
  color: white;
}

.faq-answer {
  padding: 0 1.25rem 1.25rem;
}

.faq-answer-content {
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

.expand-enter-active, .expand-leave-active {
  transition: all 0.3s var(--ease-out);
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.expand-enter-to, .expand-leave-from {
  opacity: 1;
  max-height: 300px;
}

/* ── 响应式 ── */
@media (max-width: 768px) {
  .page-hero { padding-top: calc(64px + 1.5rem); }
  .section { padding: var(--space-12) 0; }
  .channels-grid { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .contact-form { padding: 1.5rem; }
  .faq-question { padding: 1rem 1rem; font-size: 0.9rem; }
  .faq-answer { padding: 0 1rem 1rem; }
}
@media (max-width: 480px) {
  .channels-grid { grid-template-columns: 1fr; }
}
</style>
