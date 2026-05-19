<template>
  <footer class="main-footer">
    <div class="footer-top-line" aria-hidden="true"></div>

    <div class="container footer-inner">
      <div class="footer-left">
        <RouterLink to="/" class="footer-logo" aria-label="返回首页">
          <span class="footer-logo-ring">
            <img src="@/assets/logo.jpg" alt="CNCG Logo" class="footer-logo-img" />
          </span>
        </RouterLink>
        <p class="footer-desc">专注网站开发、内容创作与数字化解决方案。</p>
        <p class="footer-copy">&copy; 2026 CNCG. All rights reserved.</p>
        <div v-if="friendLinks.length" class="footer-links">
          <span class="footer-links-label">友情链接</span>
          <a
            v-for="link in friendLinks"
            :key="link.name"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="footer-link"
          >
            {{ link.name }}
          </a>
        </div>
        <div class="footer-links footer-service-links">
          <span class="footer-links-label">售后支持</span>
          <RouterLink to="/contact" class="footer-link">联系客服</RouterLink>
          <a href="#" class="footer-link disabled" title="即将上线">提交工单</a>
        </div>
      </div>

      <div class="footer-right">
        <p class="footer-shortcuts-title">快捷方式</p>

        <div class="footer-shortcuts-group">
          <button
            class="shortcut-icon-btn"
            title="点击复制 QQ 号 3230801354"
            aria-label="复制 QQ 号"
            @click="copyQQ"
          >
            <span v-html="svgQQ" class="icon-qq"></span>
            <transition name="fade">
              <span v-if="qqCopied" class="copy-toast">已复制</span>
            </transition>
          </button>

          <div class="shortcut-icon-btn wechat-wrapper" title="添加微信" aria-label="添加微信">
            <span v-html="svgWeixin" class="icon-weixin"></span>
            <div class="wechat-qrcode-popup">
              <img src="@/assets/wechat-qrcode.jpg" alt="微信二维码" class="qrcode-img" />
              <p class="qrcode-tip">扫码添加微信</p>
            </div>
          </div>

          <a
            href="https://qm.qq.com/cgi-bin/qm/qr?k=zzJ02JO6xDIwtgLFF2ZNmtIIXQKKk81j&jump_from=webapi&authKey=RJGZ5O+qA/qe7pkDbICLL3VOd1dzVmeyDGACjsinraACAO0my9W9qitkjmXpfBxf"
            target="_blank"
            rel="noopener noreferrer"
            class="shortcut-icon-btn"
            title="加入 QQ 群"
            aria-label="加入 QQ 群"
          >
            <span v-html="svgQQGroup" class="icon-qqgroup"></span>
          </a>

          <a
            href="https://www.goofish.com/personal?spm=a21ybx.home.nav.1.4c053da6c7Qiup"
            target="_blank"
            rel="noopener noreferrer"
            class="shortcut-icon-btn icon-xianyu"
            title="访问闲鱼主页"
            aria-label="访问闲鱼主页"
          >
            <span v-html="svgXianyu" class="icon-xianyu"></span>
          </a>
        </div>

        <div class="footer-shortcuts-group nav-group">
          <RouterLink to="/note" class="shortcut-icon-btn nav-btn" title="笔记" aria-label="笔记">
            <span v-html="svgNote"></span>
          </RouterLink>
          <RouterLink to="/doc" class="shortcut-icon-btn nav-btn" title="知识库" aria-label="知识库">
            <span v-html="svgDoc"></span>
          </RouterLink>
          <RouterLink to="/shop" class="shortcut-icon-btn nav-btn" title="商店" aria-label="商店">
            <span v-html="svgShop"></span>
          </RouterLink>
          <RouterLink to="/about" class="shortcut-icon-btn nav-btn" title="关于" aria-label="关于">
            <span v-html="svgAbout"></span>
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <span class="footer-icp">ICP 备案号待补充</span>
        <span class="footer-separator">&middot;</span>
        <span class="footer-powered">Powered by Vue 3 + Vercel</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const qqCopied = ref(false)

const copyQQ = async () => {
  try {
    await navigator.clipboard.writeText('3230801354')
    qqCopied.value = true
    setTimeout(() => { qqCopied.value = false }, 2000)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = '3230801354'
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    qqCopied.value = true
    setTimeout(() => { qqCopied.value = false }, 2000)
  }
}

const svgQQ = `<svg class="icon-svg icon-qq-svg" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z" fill="currentColor"/></svg>`
const svgWeixin = `<svg class="icon-svg icon-weixin-svg" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M664.250054 368.541681c10.015098 0 19.892049 0.732687 29.67281 1.795902-26.647917-122.810047-159.358451-214.077703-310.826188-214.077703-169.353083 0-308.085774 114.232694-308.085774 259.274068 0 83.708494 46.165436 152.460344 123.281791 205.78483l-30.80868 91.730191 107.688651-53.455469c38.558178 7.53665 69.459978 15.308661 107.924012 15.308661 9.66308 0 19.230993-0.470721 28.752858-1.225921-6.025227-20.36584-9.521864-41.723264-9.521864-63.862493C402.328693 476.632491 517.908058 368.541681 664.250054 368.541681zM498.62897 285.87389c23.200398 0 38.557154 15.120372 38.557154 38.061874 0 22.846334-15.356756 38.156018-38.557154 38.156018-23.107277 0-46.260603-15.309684-46.260603-38.156018C452.368366 300.994262 475.522716 285.87389 498.62897 285.87389zM283.016307 362.090758c-23.107277 0-46.402843-15.309684-46.402843-38.156018 0-22.941502 23.295566-38.061874 46.402843-38.061874 23.081695 0 38.46301 15.120372 38.46301 38.061874C321.479317 346.782098 306.098002 362.090758 283.016307 362.090758zM945.448458 606.151333c0-121.888048-123.258255-221.236753-261.683954-221.236753-146.57838 0-262.015505 99.348706-262.015505 221.236753 0 122.06508 115.437126 221.200938 262.015505 221.200938 30.66644 0 61.617359-7.609305 92.423993-15.262612l84.513836 45.786813-23.178909-76.17082C899.379213 735.776599 945.448458 674.90216 945.448458 606.151333zM598.803483 567.994292c-15.332197 0-30.807656-15.096836-30.807656-30.501688 0-15.190981 15.47546-30.477129 30.807656-30.477129 23.295566 0 38.558178 15.286148 38.558178 30.477129C637.361661 552.897456 622.099049 567.994292 598.803483 567.994292zM768.25071 567.994292c-15.213493 0-30.594809-15.096836-30.594809-30.501688 0-15.190981 15.381315-30.477129 30.594809-30.477129 23.107277 0 38.558178 15.286148 38.558178 30.477129C806.808888 552.897456 791.357987 567.994292 768.25071 567.994292z" fill="currentColor"/></svg>`
const svgQQGroup = `<svg class="icon-svg icon-qqgroup-svg" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M939.300571 480.329143c0.512-49.152-6.582857-132.534857-53.467428-190.317714-27.428571-33.865143-64.292571-54.930286-109.714286-62.098286-61.878857-74.24-152.429714-109.933714-264.899428-109.933714-111.688571 0-201.996571 35.328-263.801143 108.617142-44.909714 5.705143-81.481143 25.380571-108.982857 59.245715-44.470857 55.003429-53.248 133.851429-52.370286 192.731428-15.652571 16.091429-56.758857 61.44-47.030857 148.699429a14.482286 14.482286 0 0 0 0.585143 2.852571l0.585143 2.706286a33.426286 33.426286 0 0 0 9.728 19.382857 31.305143 31.305143 0 0 0 24.502857 8.777143c11.044571-0.877714 31.012571-15.36 31.012571-15.36-8.411429 10.386286-8.777143 13.165714-15.213714 23.552a50.395429 50.395429 0 0 0-6.436571 40.374857c4.827429 17.993143 19.236571 35.84 40.521143 43.885714 25.161143 9.801143 48.201143 13.312 68.242286 13.312 3.657143-0.073143 6.656-0.585143 10.020571-0.731428z" fill="currentColor"></path></svg>`
const svgXianyu = `<svg class="icon-svg icon-xianyu-svg" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M81 48m139 0l650 0q139 0 139 139l0 650q0 139-139 139l-650 0q-139 0-139-139l0-650q0-139 139-139Z" fill="#FFDA44"></path><path d="M869 469h-94v33h94v-33z m47.995-23.5c0.003 0.166 0.005 0.333 0.005 0.5v161c0 13.255-10.745 24-24 24-2.39 0-4.699-0.35-6.878-1H607c-13.255 0-24-10.745-24-24V445c0-13.255 10.745-24 24-24h130.729c3.801-2.527 8.364-4 13.271-4s9.47 1.473 13.271 4H893c13.255 0 24 10.745 24 24 0 0.167-0.002 0.334-0.005 0.5zM869 582v-32h-94v32h94zM727 469h-96v33h96v-33z m0 113v-32h-96v32h96z m141-205H630v3c0 13.255-10.745 24-24 24s-24-10.745-24-24v-27c0-13.255 10.745-24 24-24h286c13.255 0 24 10.745 24 24v27c0 13.255-10.745 24-24 24s-24-10.745-24-24v-3z m-384-30c13.255 0 24 10.745 24 24v300c0 13.255-10.745 24-24 24s-24-10.745-24-24V508h-95v163c0 13.255-10.745 24-24 24s-24-10.745-24-24V508h-96v163c0 13.255-10.745 24-24 24s-24-10.745-24-24V371c0-13.255 10.745-24 24-24s24 10.745 24 24v89h96v-8c0-13.255 10.745-24 24-24s24 10.745 24 24v8h95v-65H333c-13.255 0-24-10.745-24-24s10.745-24 24-24h151zM269 565c13.255 0 24 10.745 24 24v82c0 13.255-10.745 24-24 24s-24-10.745-24-24v-82c0-13.255 10.745-24 24-24z m-4-236c13.255 0 24 10.745 24 24v27c0 13.255-10.745 24-24 24s-24-10.745-24-24v-27c0-13.255 10.745-24 24-24z m341 318c13.255 0 24 10.745 24 24s-10.745 24-24 24-24-10.745-24-24 10.745-24 24-24z m97 0c13.255 0 24 10.745 24 24s-10.745 24-24 24-24-10.745-24-24 10.745-24 24-24z m95 0c13.255 0 24 10.745 24 24s-10.745 24-24 24-24-10.745-24-24 10.745-24 24-24z m95 0c13.255 0 24 10.745 24 24s-10.745 24-24 24-24-10.745-24-24 10.745-24 24-24z m-481-82c13.255 0 24 10.745 24 24v82c0 13.255-10.745 24-24 24s-24-10.745-24-24v-82c0-13.255 10.745-24 24-24z" fill="#000000"></path></svg>`

const svgNote = `<svg class="icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`
const svgDoc = `<svg class="icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`
const svgShop = `<svg class="icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`
const svgAbout = `<svg class="icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`

const friendLinks = []
</script>

<style scoped>
/* ---- Footer 瀹瑰櫒 ---- */
.main-footer {
  background: var(--bg-secondary);
  border-top: none;
  margin-top: auto;
}

/* 鈹€鈹€ 娓愬彉椤剁嚎瑁呴グ 鈹€鈹€ */
.footer-top-line {
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--border) 15%,
    var(--accent) 40%,
    #06b6d4 50%,
    var(--accent) 60%,
    var(--border) 85%,
    transparent 100%
  );
  opacity: 0.5;
}
[data-theme="dark"] .footer-top-line {
  opacity: 0.3;
}

.footer-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  padding: 3.5rem 0 2.5rem;
}

/* ---- 宸﹀尯 Logo ---- */
.footer-logo {
  display: inline-flex;
  align-items: center;
  margin-bottom: 0.875rem;
  text-decoration: none;
}

.footer-logo-ring {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 999px;
  border: 1px solid rgba(6, 182, 212, 0.15);
  background: rgba(6, 182, 212, 0.04);
}

.footer-logo-img {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  object-fit: cover;
}

.footer-desc {
  margin: 0 0 0.75rem;
  color: var(--text-secondary);
  line-height: 1.7;
  max-width: 420px;
}

.footer-copy {
  margin: 0 0 1rem;
  color: var(--text-muted);
  font-size: 0.92rem;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem 0.8rem;
}

.footer-links-label {
  color: var(--text-muted);
  font-size: 0.92rem;
}

.footer-link {
  color: var(--text-secondary);
  text-decoration: none;
}

.footer-link:hover {
  color: var(--accent);
}

.footer-link.disabled {
  opacity: 0.65;
  cursor: default;
}

.footer-service-links { margin-top: 0.75rem; }

.footer-right {
  justify-self: end;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
}

.footer-shortcuts-title {
  margin: 0;
  color: var(--text-primary);
  font-weight: 600;
}

.footer-shortcuts-group {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.shortcut-icon-btn {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg-card);
  color: var(--text-primary);
  text-decoration: none;
  cursor: pointer;
}

.shortcut-icon-btn :deep(svg) {
  width: 20px;
  height: 20px;
}

.copy-toast {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  font-size: 0.75rem;
  white-space: nowrap;
}

.wechat-wrapper { position: relative; }

.wechat-qrcode-popup {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  pointer-events: none;
  padding: 0.75rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--shadow-md);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.wechat-wrapper:hover .wechat-qrcode-popup {
  opacity: 1;
  transform: translateX(-50%) translateY(-4px);
}

.qrcode-img {
  width: 132px;
  height: 132px;
  object-fit: cover;
  border-radius: 10px;
}

.qrcode-tip {
  margin: 0.5rem 0 0;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.82rem;
}

.footer-bottom {
  border-top: 1px solid var(--border);
  padding: 1rem 0;
}

.footer-bottom .container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  color: var(--text-muted);
  font-size: 0.88rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 860px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .footer-right {
    justify-self: start;
    align-items: flex-start;
  }
  .footer-bottom .container {
    flex-wrap: wrap;
  }
}
</style>
