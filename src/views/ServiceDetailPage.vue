<template>
  <main class="service-detail-page">
    <!-- 返回按钮 -->
    <div class="container back-section">
      <RouterLink to="/shop" class="back-btn">
        ← 返回店铺
      </RouterLink>
    </div>

    <!-- 服务详情 -->
    <section class="section detail-section">
      <div class="container">
        <h1 class="service-title">{{ currentService.title }}</h1>
        <p class="service-desc" style="white-space: pre-line;">{{ currentService.description }}</p>

        <!-- 额外福利 -->
        <div class="service-bonus">
          <h3>🎁 服务保障</h3>
          <div class="bonus-grid">
            <div class="bonus-item" v-for="(item, index) in currentService.bonus" :key="index">
              <span class="bonus-icon">✓</span>
              <span class="bonus-text">{{ item }}</span>
            </div>
          </div>
        </div>

        <!-- 服务范围 -->
        <div class="service-scope">
          <h3>✅ 服务包含项目</h3>
          <ul>
            <li v-for="(item, index) in currentService.scope" :key="index">{{ item }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 服务流程 -->
    <section class="section process-section">
      <div class="container">
        <h2 class="section-title">📋 服务流程</h2>
        <p class="process-time">全程{{ currentService.timeRange }}，高效不耗时</p>

        <div class="process-grid">
          <div v-for="(step, index) in processSteps" :key="index" class="process-card">
            <div class="step-number">{{ index + 1 }}</div>
            <h4 class="step-title">{{ step.title }}</h4>
            <p class="step-desc">{{ step.desc }}</p>
          </div>
        </div>

        <!-- 售后保障单独一行 -->
        <div class="warranty-card">
          <div class="warranty-badges">
            <span class="warranty-badge">7天质保・免费重做</span>
            <span class="warranty-badge">全程可视・隐私安全</span>
            <span class="warranty-badge">无隐形消费・无套路</span>
            <span class="warranty-badge">服务未完成・全额退款</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 收费标准 -->
    <section class="section pricing-section">
      <div class="container">
        <h2 class="section-title">💰 收费标准</h2>
        <p class="pricing-note">透明收费，诚信服务</p>

        <div class="pricing-table">
          <div class="table-header">
            <span>服务类型</span>
            <span>适用场景</span>
            <span>价格（元）</span>
            <span>备注</span>
          </div>
          <div v-for="(item, index) in currentService.pricing" :key="index" class="table-row">
            <span class="price-type">{{ item.type }}</span>
            <span class="price-scenario">{{ item.scenario }}</span>
            <span class="price-value">{{ item.price }}</span>
            <span class="price-note">{{ item.note }}</span>
          </div>
        </div>

        <!-- 补充说明 -->
        <div v-if="currentService.extraNote" class="pricing-extra">
          <h4>💡 补充说明</h4>
          <p>{{ currentService.extraNote }}</p>
        </div>
      </div>
    </section>

    <!-- 下单须知 -->
    <section class="section notice-section">
      <div class="container">
        <h2 class="section-title">📌 下单须知</h2>
        <ul class="notice-list">
          <li v-for="(notice, index) in currentService.notice" :key="index">
            <strong>{{ index + 1 }}.</strong> {{ notice }}
          </li>
        </ul>
      </div>
    </section>

    <!-- 联系咨询 -->
    <section class="section contact-section">
      <div class="container">
        <h2 class="section-title">💬 立即下单</h2>
        <p class="contact-desc">闲鱼担保交易安全放心，QQ/微信适合长期合作</p>
        <div class="contact-btns">
          <a href="https://www.goofish.com/personal?spm=a21ybx.home.nav.1.4c053da6c7Qiup" target="_blank" rel="noopener noreferrer" class="contact-btn xianyu-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            闲鱼下单（担保交易）
          </a>
          <button class="contact-btn primary qq-btn" @click="copyQQ">
            <svg width="20" height="20" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z" fill="currentColor"/></svg>
            QQ咨询 {{ qqCopied ? '(已复制!)' : '' }}
          </button>
          <div class="wechat-contact-wrapper">
            <button class="contact-btn primary wechat-btn">
              <svg width="20" height="20" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M664.250054 368.541681c10.015098 0 19.892049 0.732687 29.67281 1.795902-26.647917-122.810047-159.358451-214.077703-310.826188-214.077703-169.353083 0-308.085774 114.232694-308.085774 259.274068 0 83.708494 46.165436 152.460344 123.281791 205.78483l-30.80868 91.730191 107.688651-53.455469c38.558178 7.53665 69.459978 15.308661 107.924012 15.308661 9.66308 0 19.230993-0.470721 28.752858-1.225921-6.025227-20.36584-9.521864-41.723264-9.521864-63.862493C402.328693 476.632491 517.908058 368.541681 664.250054 368.541681z" fill="currentColor"/><circle cx="283" cy="324" r="38" fill="currentColor"/><circle cx="499" cy="324" r="38" fill="currentColor"/></svg>
              微信咨询
            </button>
            <div class="wechat-contact-popup">
              <img src="@/assets/wechat-qrcode.jpg" alt="微信二维码" class="qrcode-img" />
              <p class="qrcode-tip">扫码添加微信</p>
            </div>
          </div>
        </div>
        <div class="contact-links">
          <a href="https://qm.qq.com/cgi-bin/qm/qr?k=zzJ02JO6xDIwtgLFF2ZNmtIIXQKKk81j&jump_from=webapi&authKey=RJGZ5O+qA/qe7pkDbICLL3VOd1dzVmeyDGACjsinraACAO0my9W9qitkjmXpfBxf" target="_blank" rel="noopener noreferrer" class="contact-link">加入QQ群</a>
          <RouterLink to="/contact" class="contact-link">更多联系方式</RouterLink>
        </div>
        <p class="service-time">服务时间：全天在线 · 下单后30分钟内安排服务</p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const qqCopied = ref(false)
const copyQQ = async () => {
  try { await navigator.clipboard.writeText('3230801354') } catch { const t = document.createElement('textarea'); t.value = '3230801354'; t.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t) }
  qqCopied.value = true
  setTimeout(() => { qqCopied.value = false }, 2000)
}

const route = useRoute()

// 服务数据
const services = {
  'clean': {
    id: 'clean',
    title: '🖥️ 电脑清理优化服务',
    description: '适配 Win10 / Win11 全系 Windows 及 Mac 系统\n专治：电脑卡顿、开机慢、内存占用高、垃圾堆积、后台程序冗余、拖慢运行等问题。\n深度安全清理，不损坏个人文件，不泄露隐私数据，优化后开机、软件打开，日常流畅度明显提升。',
    scope: [
      '系统垃圾、缓存、临时文件深度清理',
      '冗余注册表精简优化',
      '开机自启程序管控，禁用无用后台',
      '无用流氓软件、捆绑软件彻底卸载',
      '磁盘碎片整理 & 磁盘空间释放'
    ],
    bonus: [
      '免费硬件健康状态检测',
      '免费给出长期使用优化建议',
      '全程远程可视操作，透明无暗操作'
    ],
    timeRange: '10-30分钟',
    process: [
      { title: '咨询沟通', desc: '告知电脑型号、系统版本、目前卡顿问题' },
      { title: '远程协助', desc: '提供正规远程工具，全程你可实时观看' },
      { title: '深度清理', desc: '按标准流程逐项优化，每步清晰可见' },
      { title: '效果验收', desc: '优化完毕实测开机、打开软件速度' },
      { title: '售后保障', desc: '7天同类问题免费重新优化' }
    ],
    pricing: [
      { type: '电脑清理优化', scenario: 'Win10/Win11/Mac全系统适用', price: '¥9.9', note: '含深度清理、优化服务' }
    ],
    extraNote: '多台电脑同账号下单，每台减3元；老客户复购，享8折优惠',
    notice: [
      '下单前请先咨询客服，确认电脑配置、系统版本是否适配',
      '服务全程远程操作，操作过程可全程查看，无隐私泄露风险',
      '收费均为一次性费用，无隐形消费，若服务未完成，可全额退款',
      '售后保障7天，7天内出现服务相关问题，免费重新服务',
      '全天在线响应，下单后30分钟内安排服务'
    ]
  },
  'system': {
    id: 'system',
    title: '⚙️ 电脑系统配置服务',
    description: '专业解决系统崩溃、蓝屏、卡顿、中毒、系统老化等问题，提供Windows（Win10/11）、Mac系统重装、修复及升级服务。无需U盘、无需懂技术，重装后系统纯净无捆绑软件。',
    scope: [
      '系统重装（Win10/11/Mac）',
      '系统修复（蓝屏/死机/无法开机）',
      '系统升级',
      '驱动安装（显卡/声卡等）',
      '系统激活'
    ],
    bonus: [
      '免费安装常用办公软件（WPS、浏览器等）',
      '不额外收费'
    ],
    timeRange: '30-60分钟',
    process: [
      { title: '咨询沟通', desc: '客户告知电脑问题，确认是否需要备份文件' },
      { title: '文件备份', desc: '指导备份重要文件（文档、照片等）' },
      { title: '远程操作', desc: '发送远程工具，全程透明操作' },
      { title: '系统配置', desc: '重装/修复系统，安装驱动、激活系统' },
      { title: '测试验收', desc: '测试系统运行、软件情况，确认无问题' },
      { title: '售后保障', desc: '7天内系统出现问题，免费重新修复/重装' }
    ],
    pricing: [
      { type: 'Windows系统重装', scenario: '系统卡顿，中毒、崩溃', price: '¥30-35', note: '含系统激活，全程30-40分钟' },
      { type: 'Windows系统修复', scenario: '蓝屏、死机（可远程解决）', price: '¥25-30', note: '无需重装，保留原有文件' },
      { type: 'Mac系统重装/升级', scenario: 'Mac系统老化、需升级', price: '¥40-45', note: '含系统激活、基础优化' },
      { type: '系统驱动安装', scenario: '驱动缺失、无法使用', price: '¥15-20', note: '单独驱动服务，无需重装' }
    ],
    extraNote: '系统重装+深度清理组合下单，立减8元；学生凭学生证下单，减5元',
    notice: [
      '下单前请先咨询客服，确认电脑问题是否适合远程解决',
      '重要文件请提前备份（可协助备份，但建议客户自己备份重要数据）',
      '收费均为一次性费用，无隐形消费，若服务未完成，可全额退款',
      '售后保障7天，7天内系统出现同类问题，免费重新服务',
      '全天在线响应，下单后30分钟内安排服务'
    ]
  },
  'environment': {
    id: 'environment',
    title: '🛠️ 电脑环境配置服务',
    description: '适配办公、学习、开发等场景，提供各类软件安装、开发环境搭建服务。无需自己动手，耐心指导使用方法，解决"不会安装、安装失败、环境冲突"等问题。',
    scope: [
      '办公软件（Office/WPS、浏览器、微信等）',
      '专业软件（PS、PR、AE、CAD等）',
      '开发环境（Python、Java、Vue、Vite等）',
      '服务器环境配置'
    ],
    bonus: [
      '安装后简单指导使用方法',
      '解决基础使用疑问，不额外收费'
    ],
    timeRange: '20-60分钟',
    process: [
      { title: '咨询沟通', desc: '客户告知需要安装的软件/搭建的环境，确认适配情况' },
      { title: '准备资源', desc: '提供纯净版安装包（无捆绑），无需客户自行下载' },
      { title: '远程操作', desc: '远程连接电脑，逐步安装配置，同步讲解关键步骤' },
      { title: '测试调试', desc: '测试软件/环境是否能正常使用，解决冲突问题' },
      { title: '指导教学', desc: '简单讲解软件基础操作、环境使用方法' },
      { title: '售后保障', desc: '7天内出现安装/配置相关问题，免费重新调试' }
    ],
    pricing: [
      { type: '基础办公软件安装', scenario: 'Office/WPS等常用软件（1-3个）', price: '¥10-15', note: '多装1个加3元' },
      { type: '专业软件安装', scenario: 'PS、PR、AE等设计/剪辑软件', price: '¥25-35', note: '含破解激活，全程30-40分钟' },
      { type: '基础开发环境', scenario: 'Python/Java单一语言环境', price: '¥30-35', note: '含环境配置、测试，适合学生新手' },
      { type: '复杂开发环境', scenario: 'Vue/Vite/多语言环境组合', price: '¥45-60', note: '含环境调试、冲突解决' }
    ],
    extraNote: '3个及以上软件/环境组合下单，享8.5折优惠；老客户复购，任意服务减5元',
    notice: [
      '下单前请先咨询客服，确认软件/环境是否适配您的系统',
      '提供纯净版软件安装包，无捆绑软件、无广告',
      '收费均为一次性费用，无隐形消费，若服务未完成，可全额退款',
      '售后保障7天，7天内出现配置相关问题，免费重新调试',
      '全天在线响应，下单后30分钟内安排服务'
    ]
  }
}

const currentServiceId = computed(() => route.params.id || 'clean')
const currentService = computed(() => services[currentServiceId.value] || services['clean'])

// 流程步骤（不含售后保障）
const processSteps = computed(() => {
  const steps = currentService.value.process || []
  return steps.slice(0, -1)
})

// 售后保障（最后一步）
onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style scoped>
.service-detail-page {
  padding-top: 64px;
  background: var(--bg-primary);
  min-height: 100vh;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.section {
  padding: var(--space-12) 0;
}

.back-section {
  padding: var(--space-6) 0;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.back-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
  transform: translateX(-4px);
}

/* 服务详情 */
.detail-section {
  padding: var(--space-12) 0;
}

.service-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.service-desc {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 2rem;
}

.service-scope,
.service-bonus {
  margin-bottom: 1.5rem;
}

.service-scope h3,
.service-bonus h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.service-scope ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.service-scope li {
  padding: 0.5rem 0;
  color: var(--text-secondary);
  font-size: 0.9375rem;
  padding-left: 1.5rem;
  position: relative;
}

.service-scope li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--accent);
  font-weight: bold;
}

.bonus-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.bonus-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  font-size: 0.875rem;
}

.bonus-icon {
  color: var(--accent);
  font-weight: 600;
  flex-shrink: 0;
}

.bonus-text {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .bonus-grid {
    grid-template-columns: 1fr;
  }
}

/* 服务流程 */
.process-section {
  background: var(--bg-card);
  padding: var(--space-12) 0;
}

.section-title {
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 0.5rem;
}

.process-time {
  text-align: center;
  color: var(--accent);
  font-size: 0.9375rem;
  margin-bottom: 2rem;
}

.process-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.process-card {
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  text-align: center;
  transition: all 0.3s ease;
}

.process-card:hover {
  border-color: var(--accent);
  transform: translateY(-4px);
}

.warranty-card {
  width: 100%;
  margin-top: 1rem;
  padding: 1.5rem;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 2px solid var(--accent);
  text-align: center;
}

.warranty-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
}

.warranty-badge {
  padding: 0.5rem 1rem;
  background: var(--accent-light);
  color: var(--accent);
  border-radius: var(--radius-full);
  font-size: 0.9375rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .process-grid {
    grid-template-columns: 1fr;
  }

  .warranty-badges {
    flex-direction: column;
    gap: 0.75rem;
  }

  .warranty-badge {
    width: 100%;
  }
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--accent);
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.75rem;
}

.step-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.step-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 收费标准 */
.pricing-section {
  padding: var(--space-12) 0;
}

.pricing-note {
  text-align: center;
  color: var(--accent);
  font-size: 0.9375rem;
  margin-bottom: 2rem;
}

.pricing-table {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--border);
}

.table-header {
  display: grid;
  grid-template-columns: 1.5fr 2fr 1fr 1.5fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--accent-light);
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.table-row {
  display: grid;
  grid-template-columns: 1.5fr 2fr 1fr 1.5fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border);
  font-size: 0.875rem;
  transition: background 0.2s ease;
}

.table-row:hover {
  background: var(--bg-secondary);
}

.price-type {
  font-weight: 600;
  color: var(--text-primary);
}

.price-scenario {
  color: var(--text-secondary);
}

.price-value {
  font-weight: 700;
  color: var(--accent);
  font-size: 1.125rem;
}

.price-note {
  color: var(--text-muted);
  font-size: 0.8125rem;
}

.pricing-extra {
  margin-top: 1.5rem;
  padding: 1rem 1.5rem;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--accent);
}

.pricing-extra h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 0.5rem;
}

.pricing-extra p {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* 下单须知 */
.notice-section {
  background: var(--bg-card);
  padding: var(--space-12) 0;
}

.notice-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-width: 700px;
  margin: 0 auto;
}

.notice-list li {
  padding: 0.75rem 0;
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.6;
  border-bottom: 1px solid var(--border);
}

.notice-list li:last-child {
  border-bottom: none;
}

.notice-list strong {
  color: var(--text-primary);
  font-weight: 600;
}

/* 联系咨询 */
.contact-section {
  padding: var(--space-16) 0;
  text-align: center;
}

.contact-desc {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.contact-btns {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: var(--radius-full);
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.contact-btn.primary {
  background: var(--accent);
  color: white;
}
.contact-btn.primary:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: var(--glow-accent-soft);
}
.contact-btn.secondary {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border);
}
.contact-btn.secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.xianyu-btn {
  background: #f2dc2c;
  color: #854d0e;
  border: none;
  text-decoration: none;
}
.xianyu-btn:hover {
  background: #eab308;
  color: #854d0e;
  box-shadow: 0 4px 16px rgba(234,179,8,0.3);
}
.qq-btn { background: #12b7f5; }
.qq-btn:hover { background: #0ea5e9; box-shadow: 0 4px 16px rgba(14,165,233,0.3); }
.wechat-btn { background: #07c160; }
.wechat-btn:hover { background: #06ae56; box-shadow: 0 4px 16px rgba(6,190,86,0.3); }
.wechat-contact-wrapper { position: relative; }
.wechat-contact-popup {
  position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%) translateY(4px);
  opacity: 0; visibility: hidden; pointer-events: none;
  padding: 10px; background: white; border-radius: 12px; border: 1px solid #e5e7eb;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12); z-index: 200; min-width: 140px;
  transition: all 0.3s ease;
}
.wechat-contact-popup::after {
  content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
  border: 6px solid transparent; border-top-color: white;
}
.wechat-contact-wrapper:hover .wechat-contact-popup {
  opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0);
}
.wechat-contact-popup .qrcode-img { display: block; width: 120px; height: 120px; object-fit: contain; border-radius: 6px; }
.wechat-contact-popup .qrcode-tip { margin-top: 6px; font-size: 0.7rem; color: #6b7280; text-align: center; }
.contact-links { display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-top: 1rem; }
.contact-link { font-size: 0.875rem; color: var(--text-secondary); text-decoration: none; transition: color 0.2s; }
.contact-link:hover { color: var(--accent); }

.service-time {
  font-size: 0.875rem;
  color: var(--text-muted);
}

/* 响应式 */
@media (max-width: 768px) {
  .container {
    padding: 0 var(--space-4);
  }

  .section {
    padding: var(--space-8) 0;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .table-header {
    display: none;
  }

  .price-scenario,
  .price-note {
    font-size: 0.8125rem;
  }

  .price-value {
    font-size: 1.25rem;
  }

  .contact-btns {
    flex-direction: column;
    gap: 0.75rem;
  }

  .contact-btn {
    width: 100%;
    justify-content: center;
  }

  .wechat-contact-popup {
    left: auto;
    right: 0;
    transform: translateY(4px);
  }

  .wechat-contact-wrapper:hover .wechat-contact-popup {
    transform: translateY(0);
  }

  .wechat-contact-popup::after {
    left: auto;
    right: 16px;
    transform: none;
  }

  .contact-links {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
