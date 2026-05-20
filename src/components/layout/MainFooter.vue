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
        <p class="footer-shortcuts-title">快捷联系</p>

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

          <button
            type="button"
            class="shortcut-icon-btn"
            title="添加微信"
            aria-label="添加微信"
            @click="wechatModalOpen = true"
          >
            <span v-html="svgWeixin" class="icon-weixin"></span>
            <transition name="fade">
              <span v-if="wechatCopied" class="copy-toast">已复制</span>
            </transition>
          </button>

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

    <transition name="fade">
      <div v-if="wechatModalOpen" class="wechat-modal-overlay" @click.self="wechatModalOpen = false">
        <div class="wechat-modal">
          <button
            type="button"
            class="wechat-modal-close"
            aria-label="关闭微信弹窗"
            @click="wechatModalOpen = false"
          >
            ×
          </button>

          <div class="wechat-modal-header">
            <span v-html="svgWeixin" class="wechat-modal-icon"></span>
            <div class="wechat-modal-meta">
              <h3 class="wechat-modal-title">微信联系</h3>
              <p class="wechat-modal-subtitle">扫码添加，截图保存也方便</p>
            </div>
          </div>

          <img src="@/assets/wechat-qrcode.jpg" alt="微信二维码" class="wechat-modal-image" />

          <div class="wechat-modal-actions">
            <div class="wechat-id-box">
              <span class="wechat-id-label">微信号</span>
              <span class="wechat-id-value">{{ wechatId || '未配置' }}</span>
            </div>
            <button
              type="button"
              class="wechat-copy-btn"
              :disabled="!wechatId"
              @click="copyWeChatId"
            >
              复制微信号
            </button>
          </div>
        </div>
      </div>
    </transition>

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
const wechatCopied = ref(false)
const wechatModalOpen = ref(false)
const wechatId = import.meta.env.VITE_WECHAT_ID || ''

const copyText = async (text, onSuccess) => {
  try {
    await navigator.clipboard.writeText(text)
    onSuccess()
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    onSuccess()
  }
}

const showCopied = state => {
  state.value = true
  setTimeout(() => { state.value = false }, 2000)
}

const copyQQ = () => copyText('3230801354', () => showCopied(qqCopied))
const copyWeChatId = () => {
  if (!wechatId) return
  copyText(wechatId, () => showCopied(wechatCopied))
}

const svgQQ = `<svg class="icon-svg icon-qq-svg" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z" fill="currentColor"/></svg>`
const svgWeixin = `<svg class="icon-svg icon-weixin-svg" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M664.250054 368.541681c10.015098 0 19.892049 0.732687 29.67281 1.795902-26.647917-122.810047-159.358451-214.077703-310.826188-214.077703-169.353083 0-308.085774 114.232694-308.085774 259.274068 0 83.708494 46.165436 152.460344 123.281791 205.78483l-30.80868 91.730191 107.688651-53.455469c38.558178 7.53665 69.459978 15.308661 107.924012 15.308661 9.66308 0 19.230993-0.470721 28.752858-1.225921-6.025227-20.36584-9.521864-41.723264-9.521864-63.862493C402.328693 476.632491 517.908058 368.541681 664.250054 368.541681zM498.62897 285.87389c23.200398 0 38.557154 15.120372 38.557154 38.061874 0 22.846334-15.356756 38.156018-38.557154 38.156018-23.107277 0-46.260603-15.309684-46.260603-38.156018C452.368366 300.994262 475.522716 285.87389 498.62897 285.87389zM283.016307 362.090758c-23.107277 0-46.402843-15.309684-46.402843-38.156018 0-22.941502 23.295566-38.061874 46.402843-38.061874 23.081695 0 38.46301 15.120372 38.46301 38.061874C321.479317 346.782098 306.098002 362.090758 283.016307 362.090758zM945.448458 606.151333c0-121.888048-123.258255-221.236753-261.683954-221.236753-146.57838 0-262.015505 99.348706-262.015505 221.236753 0 122.06508 115.437126 221.200938 262.015505 221.200938 30.66644 0 61.617359-7.609305 92.423993-15.262612l84.513836 45.786813-23.178909-76.17082C899.379213 735.776599 945.448458 674.90216 945.448458 606.151333zM598.803483 567.994292c-15.332197 0-30.807656-15.096836-30.807656-30.501688 0-15.190981 15.47546-30.477129 30.807656-30.477129 23.295566 0 38.558178 15.286148 38.558178 30.477129C637.361661 552.897456 622.099049 567.994292 598.803483 567.994292zM768.25071 567.994292c-15.213493 0-30.594809-15.096836-30.594809-30.501688 0-15.190981 15.381315-30.477129 30.594809-30.477129 23.107277 0 38.558178 15.286148 38.558178 30.477129C806.808888 552.897456 791.357987 567.994292 768.25071 567.994292z" fill="currentColor"/></svg>`
const svgQQGroup = `<svg class="icon-svg icon-qqgroup-svg" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M939.300571 480.329143c0.512-49.152-6.582857-132.534857-53.467428-190.317714-27.428571-33.865143-64.219429-53.686857-109.202286-59.465143 6.948571 15.286857 11.922286 30.72 16.603429 46.299428 24.210286 7.021714 44.470857 19.675429 60.635428 39.643429 39.350857 48.493714 44.544 123.172571 44.105143 163.401143a41.398857 41.398857 0 0 0 12.434286 30.281143c6.217143 6.656 31.305143 29.622857 35.254857 110.738285a26.989714 26.989714 0 0 1-3.218286-2.413714 41.033143 41.033143 0 0 0-56.100571 2.925714 42.057143 42.057143 0 0 0-1.316572 56.758857c3.072 3.657143 10.825143 13.165714 14.921143 20.114286 1.097143 1.828571 1.462857 4.022857 1.097143 5.705143-1.024 3.730286-6.144 7.899429-13.531428 10.971429-21.723429 9.142857-40.96 14.043429-55.369143 14.043428-6.144 0-11.922286-0.585143-17.334857-1.243428 4.022857 12.580571 6.948571 28.379429 7.826285 42.276571 3.218286 0.219429 6.144 0.731429 9.508572 0.731429 21.577143 0 46.08-6.656 71.241143-17.261715 19.748571-8.118857 32.987429-21.796571 37.522285-38.546285a49.810286 49.810286 0 0 0-5.632-38.326858c-7.168-12.214857-19.309714-26.038857-19.309714-26.038857a56.32 56.32 0 0 0 35.474286 14.336 45.202286 45.202286 0 0 0 16.457143-3.145143c11.190857-4.608 18.212571-18.724571 19.382857-30.354285l0.073143-2.048c-2.706286-98.377143-33.499429-134.802286-48.054858-149.065143z m-737.645714 289.645714c-0.146286-13.458286 1.536-29.110857 6.729143-42.276571a127.268571 127.268571 0 0 1-16.822857 1.170285c-17.554286 0-35.474286-3.510857-53.540572-10.459428a25.307429 25.307429 0 0 1-15.213714-15.652572c-0.512-2.121143-0.512-4.169143 1.682286-7.68l5.412571-9.289142a57.782857 57.782857 0 0 1 6.729143-10.020572 42.057143 42.057143 0 0 0-2.194286-54.857143 41.033143 41.033143 0 0 0-54.125714-5.266285l-1.974857 1.389714c-4.169143-68.534857 29.257143-98.011429 36.352-105.325714a41.984 41.984 0 0 0 11.776-29.842286c-0.731429-50.322286 6.144-119.954286 43.154286-165.668572 15.433143-19.090286 35.474286-31.451429 58.953143-38.619428a296.96 296.96 0 0 1 17.92-47.030857c-44.909714 5.705143-81.481143 25.380571-108.982858 59.245714-44.470857 55.003429-53.248 133.851429-52.370285 192.731429-15.652571 16.091429-56.758857 61.44-47.030857 148.699428a14.482286 14.482286 0 0 0 0.585142 2.852572l0.585143 2.706285a33.426286 33.426286 0 0 0 9.728 19.382857 31.305143 31.305143 0 0 0 24.502857 8.777143c11.044571-0.877714 31.012571-15.36 31.012572-15.36-8.411429 10.386286-8.777143 13.165714-15.213714 23.552a50.395429 50.395429 0 0 0-6.436572 40.374857c4.827429 17.993143 19.236571 35.84 40.521143 43.885715 25.161143 9.801143 48.201143 13.312 68.242286 13.312 3.657143-0.073143 6.656-0.585143 10.020571-0.731429z m-18.358857-106.788571a22.454857 22.454857 0 0 0 0.731429 3.876571c0.365714 1.170286 0.658286 2.413714 0.877714 3.657143 1.316571 6.582857 3.584 17.700571 13.385143 26.697143a43.154286 43.154286 0 0 0 33.718857 11.922286c15.36-1.170286 42.715429-21.138286 42.715428-21.138286-11.483429 14.336-12.068571 18.066286-20.918857 32.402286a68.973714 68.973714 0 0 0-8.850285 55.369142c6.656 24.649143 26.477714 49.152 55.808 60.269715a260.388571 260.388571 0 0 0 94.061714 18.139428c48.128 0 83.748571-14.409143 100.937143-23.113143a34.377143 34.377143 0 0 1 15.579428-4.096c5.339429 0 10.678857 1.462857 16.091429 4.534858 14.116571 7.899429 52.443429 22.893714 101.376 22.893714 29.842286 0 63.634286-9.069714 98.304-23.625143 27.062857-11.190857 45.348571-29.915429 51.638857-52.809143a67.949714 67.949714 0 0 0-7.753143-52.662857c-9.874286-16.676571-26.624-35.766857-26.624-35.766857 13.312 11.190857 30.427429 19.675429 48.859429 19.675428 7.314286 0 14.848-1.316571 22.674285-4.388571 15.36-6.217143 25.088-25.6 26.770286-41.545143a24.576 24.576 0 0 0 0.073143-2.779428c-3.657143-135.021714-46.153143-192.731429-66.194286-212.260572 0.731429-67.437714-9.069714-181.76-73.728-261.12-45.494857-55.881143-109.348571-84.260571-189.732571-84.260571H509.220571C429.348571 103.058286 365.714286 131.291429 320.365714 186.953143c-61.366857 75.483429-73.508571 183.588571-72.265143 264.411428-21.504 22.162286-78.189714 92.086857-64.804571 211.821715zM291.108571 480.475429a39.643429 39.643429 0 0 0 11.117715-28.16c-1.024-67.437714 8.411429-160.987429 59.245714-223.597715 35.474286-43.593143 83.894857-64.731429 147.602286-64.731428h3.949714c64.438857 0 113.078857 21.284571 148.772571 65.097143 54.052571 66.267429 61.147429 166.765714 60.562286 220.672a39.497143 39.497143 0 0 0 11.922286 28.745142c9.142857 8.923429 46.884571 51.346286 50.468571 171.154286a19.236571 19.236571 0 0 1-2.486857 6.363429 19.017143 19.017143 0 0 1-5.12 0.731428 35.547429 35.547429 0 0 1-21.211428-9.508571 38.692571 38.692571 0 0 0-52.882286 2.925714 39.643429 39.643429 0 0 0-1.170286 53.467429c3.657143 4.315429 14.774857 17.554286 20.918857 28.086857 3.584 5.851429 4.608 12.653714 2.925715 18.724571-2.486857 9.508571-11.702857 17.993143-25.965715 23.844572-30.500571 12.8-56.612571 19.236571-77.677714 19.236571-38.473143 0-68.315429-11.995429-76.653714-16.603428a69.485714 69.485714 0 0 0-34.084572-9.216 71.241143 71.241143 0 0 0-32.256 8.045714c-12.946286 6.582857-40.228571 17.627429-77.531428 17.627428-24.576 0-49.737143-4.900571-74.898286-14.628571a47.396571 47.396571 0 0 1-28.672-30.134857 25.6 25.6 0 0 1 3.803429-21.211429 340.114286 340.114286 0 0 0 6.802285-11.556571c3.145143-5.558857 4.608-8.045714 10.093715-14.921143a39.643429 39.643429 0 0 0-1.974858-51.712 38.765714 38.765714 0 0 0-51.053714-5.12c-7.094857 5.12-16.969143 10.971429-21.577143 12.653714a4.608 4.608 0 0 1-1.243428-0.804571 45.275429 45.275429 0 0 1-1.024-4.681143 70.217143 70.217143 0 0 0-1.097143-4.608c-10.459429-99.328 37.814857-153.161143 50.395428-166.180571z" fill="#1f8bff"/></svg>`
const svgXianyu = `<svg class="icon-svg icon-xianyu-svg" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M81 48m139 0l650 0q139 0 139 139l0 650q0 139-139 139l-650 0q-139 0-139-139l0-650q0-139 139-139Z" fill="#FFDA44"></path><path d="M869 469h-94v33h94v-33z m47.995-23.5c0.003 0.166 0.005 0.333 0.005 0.5v161c0 13.255-10.745 24-24 24-2.39 0-4.699-0.35-6.878-1H607c-13.255 0-24-10.745-24-24V445c0-13.255 10.745-24 24-24h130.729c3.801-2.527 8.364-4 13.271-4s9.47 1.473 13.271 4H893c13.255 0 24 10.745 24 24 0 0.167-0.002 0.334-0.005 0.5zM869 582v-32h-94v32h94zM727 469h-96v33h96v-33z m0 113v-32h-96v32h96z m141-205H630v3c0 13.255-10.745 24-24 24s-24-10.745-24-24v-27c0-13.255 10.745-24 24-24h286c13.255 0 24 10.745 24 24v27c0 13.255-10.745 24-24 24s-24-10.745-24-24v-3z m-384-30c13.255 0 24 10.745 24 24v300c0 13.255-10.745 24-24 24s-24-10.745-24-24V508h-95v163c0 13.255-10.745 24-24 24s-24-10.745-24-24V508h-96v163c0 13.255-10.745 24-24 24s-24-10.745-24-24V371c0-13.255 10.745-24 24-24s24 10.745 24 24v89h96v-8c0-13.255 10.745-24 24-24s24 10.745 24 24v8h95v-65H333c-13.255 0-24-10.745-24-24s10.745-24 24-24h151zM269 565c13.255 0 24 10.745 24 24v82c0 13.255-10.745 24-24 24s-24-10.745-24-24v-82c0-13.255 10.745-24 24-24z m-4-236c13.255 0 24 10.745 24 24v27c0 13.255-10.745 24-24 24s-24-10.745-24-24v-27c0-13.255 10.745-24 24-24z m341 318c13.255 0 24 10.745 24 24s-10.745 24-24 24-24-10.745-24-24 10.745-24 24-24z m97 0c13.255 0 24 10.745 24 24s-10.745 24-24 24-24-10.745-24-24 10.745-24 24-24z m95 0c13.255 0 24 10.745 24 24s-10.745 24-24 24-24-10.745-24-24 10.745-24 24-24z m95 0c13.255 0 24 10.745 24 24s-10.745 24-24 24-24-10.745-24-24 10.745-24 24-24z m-481-82c13.255 0 24 10.745 24 24v82c0 13.255-10.745 24-24 24s-24-10.745-24-24v-82c0-13.255 10.745-24 24-24z" fill="#000000"></path></svg>`

const svgNote = `<svg class="icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`
const svgDoc = `<svg class="icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`
const svgShop = `<svg class="icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`
const svgAbout = `<svg class="icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`

const friendLinks = []
</script>

<style scoped>
.main-footer {
  background: var(--bg-secondary);
  border-top: none;
  margin-top: auto;
}

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

.footer-service-links {
  margin-top: 0.75rem;
}

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
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.shortcut-icon-btn :deep(svg) {
  width: 20px;
  height: 20px;
}

.shortcut-icon-btn:hover,
.shortcut-icon-btn:focus-visible {
  transform: translateY(-2px) scale(1.06);
  border-color: rgba(6, 182, 212, 0.32);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12), 0 6px 14px rgba(6, 182, 212, 0.1);
}

.shortcut-icon-btn:focus-visible,
.wechat-copy-btn:focus-visible,
.wechat-modal-close:focus-visible {
  outline: none;
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

.wechat-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.48);
  backdrop-filter: blur(6px);
}

.wechat-modal {
  position: relative;
  width: min(100%, 360px);
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: var(--bg-card);
  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.22);
}

.wechat-modal-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 32px;
  height: 32px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
}

.wechat-modal-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.wechat-modal-icon {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(34,197,94,0.16), rgba(16,185,129,0.2));
  color: var(--text-primary);
}

.wechat-modal-icon :deep(svg) {
  width: 22px;
  height: 22px;
}

.wechat-modal-meta {
  min-width: 0;
}

.wechat-modal-title {
  margin: 0 0 0.15rem;
  color: var(--text-primary);
  font-size: 1rem;
}

.wechat-modal-subtitle {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.84rem;
}

.wechat-modal-image {
  display: block;
  width: min(100%, 240px);
  margin: 0 auto 1rem;
  border-radius: 14px;
  border: 1px solid var(--border);
}

.wechat-modal-actions {
  display: grid;
  gap: 0.75rem;
}

.wechat-id-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.7rem 0.85rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg-secondary);
}

.wechat-id-label {
  color: var(--text-muted);
  font-size: 0.82rem;
}

.wechat-id-value {
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 600;
}

.wechat-copy-btn {
  height: 40px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.wechat-copy-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.wechat-copy-btn:hover:not(:disabled),
.wechat-modal-close:hover {
  transform: translateY(-1px);
  border-color: rgba(6, 182, 212, 0.32);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
}

[data-theme="dark"] .shortcut-icon-btn:hover,
[data-theme="dark"] .shortcut-icon-btn:focus-visible {
  transform: translateY(-1px) scale(1.03);
  border-color: rgba(34, 197, 94, 0.42);
  box-shadow:
    0 0 0 1px rgba(34, 197, 94, 0.16),
    0 0 18px rgba(34, 197, 94, 0.12),
    0 0 28px rgba(6, 182, 212, 0.08);
}

[data-theme="dark"] .wechat-copy-btn:hover:not(:disabled),
[data-theme="dark"] .wechat-modal-close:hover {
  border-color: rgba(34, 197, 94, 0.42);
  box-shadow:
    0 0 0 1px rgba(34, 197, 94, 0.14),
    0 0 18px rgba(34, 197, 94, 0.1);
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
