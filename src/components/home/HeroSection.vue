<template>
  <section class="hero-section">
    <!-- ═══ 第一层：基础渐变底色 ═══ -->
    <div class="hero-bg-base" aria-hidden="true"></div>

    <!-- ═══ 第二层：细网格图案（mask边缘隐去）═══ -->
    <div class="hero-grid" aria-hidden="true"></div>

    <!-- ═══ 第三层：光斑（漂浮动画）═══ -->
    <div class="hero-blob b-1" aria-hidden="true"></div>
    <div class="hero-blob b-2" aria-hidden="true"></div>
    <div class="hero-blob b-3" aria-hidden="true"></div>

    <!-- ═══ 第四层：赛博朋克线条装饰（人脸轮廓抽象）═══ -->
    <svg class="hero-cyber-lines" viewBox="0 0 1200 800" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <!-- 外圈椭圆轨道 -->
      <ellipse cx="600" cy="400" rx="380" ry="280" class="cyber-orbit o-1"/>
      <ellipse cx="600" cy="400" rx="300" ry="220" class="cyber-orbit o-2"/>
      <ellipse cx="600" cy="400" rx="220" ry="160" class="cyber-orbit o-3"/>

      <!-- 左侧面部线条 -->
      <path d="M340,320 Q360,260 420,240 T520,250" class="cyber-line cl-1" stroke-dasharray="200" stroke-dashoffset="200"/>
      <path d="M300,380 Q330,350 390,355 T480,370" class="cyber-line cl-2" stroke-dasharray="180" stroke-dashoffset="180"/>
      <path d="M310,450 Q350,430 410,440 T500,455" class="cyber-line cl-3" stroke-dasharray="190" stroke-dashoffset="190"/>

      <!-- 右侧面部线条 -->
      <path d="M860,320 Q840,260 780,240 T680,250" class="cyber-line cl-4" stroke-dasharray="200" stroke-dashoffset="200"/>
      <path d="M900,380 Q870,350 810,355 T720,370" class="cyber-line cl-5" stroke-dasharray="180" stroke-dashoffset="180"/>
      <path d="M890,450 Q850,430 790,440 T700,455" class="cyber-line cl-6" stroke-dasharray="190" stroke-dashoffset="190"/>

      <!-- 中轴对称线 -->
      <line x1="600" y1="160" x2="600" y2="640" class="cyber-axis"/>

      <!-- 节点圆点 -->
      <circle cx="600" cy="220" r="4" class="cyber-node n-1"/>
      <circle cx="600" cy="400" r="5" class="cyber-node n-2"/>
      <circle cx="600" cy="580" r="4" class="cyber-node n-3"/>
      <circle cx="420" cy="245" r="3" class="cyber-node n-4"/>
      <circle cx="780" cy="245" r="3" class="cyber-node n-5"/>
      <circle cx="350" cy="365" r="3" class="cyber-node n-6"/>
      <circle cx="850" cy="365" r="3" class="cyber-node n-7"/>

      <!-- 数据流粒子 -->
      <circle class="particle p-1" cx="0" cy="0" r="2"/>
      <circle class="particle p-2" cx="0" cy="0" r="1.5"/>
      <circle class="particle p-3" cx="0" cy="0" r="2.5"/>
      <circle class="particle p-4" cx="0" cy="0" r="1.5"/>
    </svg>

    <!-- ═══ 第五层：噪点纹理（极低透明度）═══ -->
    <div class="hero-noise" aria-hidden="true"></div>

    <!-- ═══ 闪烁星点 ═══ -->
    <span class="sparkle s-1" aria-hidden="true"></span>
    <span class="sparkle s-2" aria-hidden="true"></span>
    <span class="sparkle s-3" aria-hidden="true"></span>
    <span class="sparkle s-4" aria-hidden="true"></span>
    <span class="sparkle s-5" aria-hidden="true"></span>

    <!-- ═══ 主内容区 ═══ -->
    <div class="hero-content">
      <!-- 品牌标识条 -->
      <div class="brand-bar fade-in-up">
        <span class="brand-dot"></span>
        <span class="brand-text">CNCG DIGITAL STUDIO</span>
        <span class="brand-dot"></span>
      </div>

      <!-- 主标题 -->
      <h1 class="hero-title fade-in-up" style="animation-delay: 0.08s">
        <span class="title-line t-l1">创意</span>
        <span class="title-line t-l2"><span class="title-accent">驱动</span>数字未来</span>
      </h1>

      <!-- 副标题 -->
      <p class="hero-subtitle fade-in-up" style="animation-delay: 0.18s">
        网站开发 · 内容创作 · 技术咨询 · 数字化解决方案
      </p>

      <!-- 搜索框 -->
      <div class="search-wrap fade-in-up" style="animation-delay: 0.28s">
        <div class="search-box" :class="{ focused: isFocused }">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input v-model="query" type="text" placeholder="搜索服务、文章或文档..."
                 class="search-input" aria-label="搜索"
                 @focus="isFocused = true" @blur="isFocused = false" />
          <button v-if="query" type="button" class="search-clear" @click="query = ''" aria-label="清除">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <button type="submit" class="search-btn">搜索</button>
          <!-- focus 渐变描边 -->
          <span class="search-border-glow"></span>
        </div>
      </div>

      <!-- 热门标签 -->
      <div class="tags-wrap fade-in-up" style="animation-delay: 0.38s">
        <span class="tags-label">热门</span>
        <button v-for="tag in hotTags" :key="tag" class="tag-pill" @click="query = tag">
          <span class="tag-txt">{{ tag }}</span>
        </button>
      </div>

      <!-- CTA按钮组 -->
      <div class="cta-group fade-in-up" style="animation-delay: 0.48s">
        <RouterLink to="/doc" class="cta-primary">
          浏览知识库
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </RouterLink>
        <RouterLink to="/about" class="cta-secondary">
          关于 CNCG
        </RouterLink>
      </div>

      <!-- 滚动提示 -->
      <div class="scroll-hint fade-in-up" style="animation-delay: 0.65s" aria-hidden="true">
        <div class="scroll-mouse">
          <div class="scroll-wheel"></div>
        </div>
        <span class="scroll-text">向下滚动</span>
      </div>
    </div>

    <!-- 音频响应控制按钮 -->
    <button 
      class="audio-toggle-btn fade-in-up" 
      style="animation-delay: 0.75s"
      @click="toggleAudio"
      :class="{ active: audioEnabled }"
      :title="audioEnabled ? '关闭音频响应' : '开启音频响应'"
    >
      <svg v-if="!audioEnabled" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18V5l12-2v13"></path>
        <circle cx="6" cy="18" r="3"></circle>
        <circle cx="18" cy="16" r="3"></circle>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
      </svg>
      <span class="audio-label">{{ audioEnabled ? '音频响应中' : '音频响应' }}</span>
      <span v-if="audioEnabled" class="audio-pulse"></span>
    </button>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const query = ref('')
const isFocused = ref(false)

const hotTags = ['Vue 3', '网站开发', '技术咨询', '飞书', '闲鱼店铺']

// 音频响应相关
const audioEnabled = ref(false)
const audioContext = ref(null)
const analyser = ref(null)
const dataArray = ref(null)
const animationId = ref(null)
const audioSource = ref(null)

function handleSearch() {
  if (!query.value.trim()) return
  router.push({ path: '/doc', query: { q: query.value.trim() } })
}

// 初始化音频上下文
async function initAudio() {
  try {
    // 请求麦克风权限
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    
    // 创建音频上下文
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
    analyser.value = audioContext.value.createAnalyser()
    analyser.value.fftSize = 256
    
    const bufferLength = analyser.value.frequencyBinCount
    dataArray.value = new Uint8Array(bufferLength)
    
    // 连接音频源
    audioSource.value = audioContext.value.createMediaStreamSource(stream)
    audioSource.value.connect(analyser.value)
    
    audioEnabled.value = true
    
    // 开始音频可视化循环
    visualize()
  } catch (error) {
    console.error('音频初始化失败:', error)
    alert('无法访问麦克风，请检查浏览器权限设置')
  }
}

// 停止音频
function stopAudio() {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
  
  if (audioSource.value && audioSource.value.mediaStream) {
    audioSource.value.mediaStream.getTracks().forEach(track => track.stop())
  }
  
  if (audioContext.value) {
    audioContext.value.close()
  }
  
  audioEnabled.value = false
  
  // 重置所有元素样式
  resetVisuals()
}

// 音频可视化主循环
function visualize() {
  animationId.value = requestAnimationFrame(visualize)
  
  if (!analyser.value || !dataArray.value) return
  
  analyser.value.getByteFrequencyData(dataArray.value)
  
  // 计算不同频段的平均值
  const bass = getAverageFrequency(0, 10) // 低频
  const mid = getAverageFrequency(10, 40) // 中频
  const treble = getAverageFrequency(40, 100) // 高频
  const overall = getAverageFrequency(0, 100) // 整体
  
  // 更新视觉元素
  updateOrbits(bass, mid, treble)
  updateParticles(overall)
  updateBlobs(bass, mid, treble)
  updateNodes(mid)
  updateSparkles(treble)
}

// 获取频段平均值（0-255）
function getAverageFrequency(start, end) {
  if (!dataArray.value) return 0
  let sum = 0
  const count = end - start
  for (let i = start; i < end; i++) {
    sum += dataArray.value[i]
  }
  return sum / count / 255 // 归一化到 0-1
}

// 更新圆环
function updateOrbits(bass, mid, treble) {
  const orbit1 = document.querySelector('.cyber-orbit.o-1')
  const orbit2 = document.querySelector('.cyber-orbit.o-2')
  const orbit3 = document.querySelector('.cyber-orbit.o-3')
  
  if (orbit1) {
    const scale = 1 + bass * 0.15
    const opacity = 0.12 + bass * 0.2
    orbit1.style.transform = `scale(${scale})`
    orbit1.style.opacity = opacity
    orbit1.style.strokeWidth = 0.5 + bass * 1.5
  }
  
  if (orbit2) {
    const scale = 1 + mid * 0.12
    const opacity = 0.09 + mid * 0.18
    orbit2.style.transform = `scale(${scale})`
    orbit2.style.opacity = opacity
    orbit2.style.strokeWidth = 0.5 + mid * 1.2
  }
  
  if (orbit3) {
    const scale = 1 + treble * 0.1
    const opacity = 0.06 + treble * 0.15
    orbit3.style.transform = `scale(${scale})`
    orbit3.style.opacity = opacity
    orbit3.style.strokeWidth = 0.5 + treble * 1
  }
}

// 更新粒子
function updateParticles(intensity) {
  const particles = document.querySelectorAll('.particle')
  particles.forEach((particle, index) => {
    const scale = 1 + intensity * 2
    const opacity = 0.7 + intensity * 0.3
    particle.style.transform = `scale(${scale})`
    particle.style.opacity = opacity
    
    // 根据强度改变滤镜
    const blur = 4 + intensity * 8
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    const colors = isDark 
      ? ['74,222,128', '34,211,238', '167,139,250']
      : ['167,139,250', '244,114,182', '96,165,250']
    const color = colors[index % colors.length]
    particle.style.filter = `drop-shadow(0 0 ${blur}px rgba(${color},${0.5 + intensity * 0.5}))`
  })
}

// 更新光斑
function updateBlobs(bass, mid, treble) {
  const blob1 = document.querySelector('.hero-blob.b-1')
  const blob2 = document.querySelector('.hero-blob.b-2')
  const blob3 = document.querySelector('.hero-blob.b-3')
  
  if (blob1) {
    const scale = 1 + bass * 0.2
    blob1.style.transform = `scale(${scale})`
    blob1.style.opacity = 0.18 + bass * 0.15
  }
  
  if (blob2) {
    const scale = 1 + mid * 0.18
    blob2.style.transform = `scale(${scale})`
    blob2.style.opacity = 0.12 + mid * 0.12
  }
  
  if (blob3) {
    const scale = 1 + treble * 0.15
    blob3.style.transform = `scale(${scale})`
    blob3.style.opacity = 0.10 + treble * 0.1
  }
}

// 更新节点
function updateNodes(intensity) {
  const nodes = document.querySelectorAll('.cyber-node')
  nodes.forEach((node) => {
    const scale = 1 + intensity * 1.5
    const opacity = 0.7 + intensity * 0.3
    node.style.transform = `scale(${scale})`
    node.style.opacity = opacity
  })
}

// 更新星点
function updateSparkles(intensity) {
  const sparkles = document.querySelectorAll('.sparkle')
  sparkles.forEach((sparkle) => {
    const scale = 1 + intensity * 0.8
    sparkle.style.transform = `scale(${scale})`
    sparkle.style.opacity = intensity * 0.9
  })
}

// 重置视觉效果
function resetVisuals() {
  const orbits = document.querySelectorAll('.cyber-orbit')
  const particles = document.querySelectorAll('.particle')
  const blobs = document.querySelectorAll('.hero-blob')
  const nodes = document.querySelectorAll('.cyber-node')
  const sparkles = document.querySelectorAll('.sparkle')
  
  orbits.forEach(orbit => {
    orbit.style.transform = ''
    orbit.style.opacity = ''
    orbit.style.strokeWidth = ''
  })
  
  particles.forEach(particle => {
    particle.style.transform = ''
    particle.style.opacity = ''
    particle.style.filter = ''
  })
  
  blobs.forEach(blob => {
    blob.style.transform = ''
    blob.style.opacity = ''
  })
  
  nodes.forEach(node => {
    node.style.transform = ''
    node.style.opacity = ''
  })
  
  sparkles.forEach(sparkle => {
    sparkle.style.transform = ''
    sparkle.style.opacity = ''
  })
}

// 切换音频响应
function toggleAudio() {
  if (audioEnabled.value) {
    stopAudio()
  } else {
    initAudio()
  }
}

onUnmounted(() => {
  if (audioEnabled.value) {
    stopAudio()
  }
})
</script>

<style scoped>
/* =============================================
   Hero 容器
   ============================================= */
.hero-section {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 64px;
}

/* ── 第一层：径向渐变底色（青春温馨风）── */
.hero-bg-base {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 55% at 20% 10%, rgba(167,139,250,0.14) 0%, transparent 55%),
    radial-gradient(ellipse 55% 45% at 80% 20%, rgba(244,114,182,0.09) 0%, transparent 50%),
    radial-gradient(ellipse 60% 50% at 70% 75%, rgba(96,165,250,0.08) 0%, transparent 50%),
    radial-gradient(ellipse 50% 40% at 25% 85%, rgba(167,139,250,0.06) 0%, transparent 48%);
  pointer-events: none;
}
[data-theme="dark"] .hero-bg-base {
  background:
    radial-gradient(ellipse 80% 60% at 50% 30%, rgba(74,222,128,.10) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 75% 70%, rgba(34,211,238,.07) 0%, transparent 55%),
    radial-gradient(ellipse 50% 40% at 25% 80%, rgba(167,139,250,.05) 0%, transparent 50%);
}

/* ── 第二层：网格 ── */
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--border-subtle) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 55% 45% at 50% 42%, rgba(0,0,0,.30) 0%, transparent 72%);
  -webkit-mask-image: radial-gradient(ellipse 55% 45% at 50% 42%, rgba(0,0,0,.30) 0%, transparent 72%);
  pointer-events: none;
}
[data-theme="dark"] .hero-grid {
  mask-image: radial-gradient(ellipse 55% 45% at 50% 42%, rgba(255,255,255,.05) 0%, transparent 68%);
  -webkit-mask-image: radial-gradient(ellipse 55% 45% at 50% 42%, rgba(255,255,255,.05) 0%, transparent 68%);
}

/* ── 第三层：光斑 ── */
.hero-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
}
.b-1 {
  width: 650px; height: 650px;
  background: radial-gradient(circle at 30% 30%, rgba(167,139,250,.18) 0%, transparent 55%);
  top: -200px; right: -120px;
  animation: blobFloat 12s ease-in-out infinite;
}
.b-2 {
  width: 480px; height: 480px;
  background: radial-gradient(circle at 70% 60%, rgba(244,114,182,.12) 0%, transparent 50%);
  bottom: -120px; left: -100px;
  animation: blobFloat 15s ease-in-out infinite reverse;
}
.b-3 {
  width: 320px; height: 320px;
  background: radial-gradient(circle at 50% 50%, rgba(96,165,250,.10) 0%, transparent 50%);
  top: 40%; left: 35%;
  animation: blobFloat 18s ease-in-out infinite;
}
[data-theme="dark"] .b-1 { background: radial-gradient(circle at 30% 30%, rgba(74,222,128,.16) 0%, transparent 55%); }
[data-theme="dark"] .b-2 { background: radial-gradient(circle at 70% 60%, rgba(34,211,238,.11) 0%, transparent 50%); }
[data-theme="dark"] .b-3 { background: radial-gradient(circle at 50% 50%, rgba(167,139,250,.09) 0%, transparent 50%); }

@keyframes blobFloat {
  0%,100% { transform: translate(0,0) scale(1); }
  33%     { transform: translate(30px,-20px) scale(1.05); }
  66%     { transform: translate(-20px,25px) scale(0.95); }
}

/* ── 第四层：赛博朋克线条 ── */
.hero-cyber-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.cyber-orbit {
  fill: none;
  stroke-width: 0.5;
  opacity: 0;
  animation: orbitIn 1.8s ease-out forwards, orbitRotate 60s linear infinite;
}
.o-1 { stroke: var(--accent); opacity: .12; animation-delay: 0.3s; }
.o-2 { stroke: #06b6d4; opacity: .09; animation-delay: 0.5s; }
.o-3 { stroke: #a78bfa; opacity: .06; animation-delay: 0.7s; }

@keyframes orbitIn { from { stroke-dasharray: 0 3000; opacity: 0; } to { stroke-dasharray: 2400 600; opacity: 1; } }
@keyframes orbitRotate { from { transform: rotate(0deg); transform-origin: 600px 400px; } to { transform: rotate(360deg); transform-origin: 600px 400px; } }

/* 面部线条 — 描边动画（温馨紫粉） */
.cyber-line {
  fill: none;
  stroke-width: 1;
  opacity: 0;
  animation: lineDraw 2.5s ease-out forwards;
}
.cl-1, .cl-4 { stroke: rgba(167,139,250,.22); animation-delay: 0.5s; }
.cl-2, .cl-5 { stroke: rgba(244,114,182,.16); animation-delay: 0.8s; }
.cl-3, .cl-6 { stroke: rgba(96,165,250,.14); animation-delay: 1.1s; }

@keyframes lineDraw { to { stroke-dashoffset: 0; opacity: 1; } }

/* 中轴线 */
.cyber-axis {
  stroke: url(#axisGradient);
  stroke-width: 0.6;
  opacity: 0;
  animation: axisFadeIn 2s ease-out 1.3s forwards;
  stroke-dasharray: 4 8;
}
@keyframes axisFadeIn { to { opacity: 0.15; } }

/* 节点 */
.cyber-node {
  fill: var(--accent);
  opacity: 0;
  animation: nodePop 0.4s cubic-bezier(.34,1.56,.64,1) forwards;
}
.n-1, .n-3 { animation-delay: 1.6s; }
.n-2 { animation-delay: 1.9s; r: 6; fill: #06b6d4; }
.n-4, .n-5 { animation-delay: 2.2s; }
.n-6, .n-7 { animation-delay: 2.5s; }

@keyframes nodePop { from { opacity: 0; transform: scale(0); } to { opacity: 0.7; transform: scale(1); } }

/* 粒子沿轨道运动（温馨色系） */
.particle {
  fill: #A78BFA;
  opacity: 0;
  filter: drop-shadow(0 0 4px rgba(167,139,250,.5));
}
.p-1 { animation: particleOrbit1 8s linear infinite 2s; }
.p-2 { animation: particleOrbit2 11s linear infinite 3s; fill: #F472B6; }
.p-3 { animation: particleOrbit3 9s linear infinite 4s; fill: #60A5FA; }
.p-4 { animation: particleOrbit1 13s linear infinite reverse 5s; opacity: 0 !important; animation: particleOrbit2 13s linear infinite 5s; fill: #A78BFA; }

@keyframes particleOrbit1 {
  0%   { opacity: 0; transform: translate(220px, 120px); }
  10%  { opacity: .9; }
  90%  { opacity: .7; }
  100% { opacity: 0; transform: translate(980px, 680px); }
}
@keyframes particleOrbit2 {
  0%   { opacity: 0; transform: translate(950px, 200px); }
  10%  { opacity: .8; }
  90%  { opacity: .6; }
  100% { opacity: 0; transform: translate(250px, 600px); }
}
@keyframes particleOrbit3 {
  0%   { opacity: 0; transform: translate(550px, 150px); }
  10%  { opacity: .85; }
  90%  { opacity: .65; }
  100% { opacity: 0; transform: translate(700px, 620px); }
}

[data-theme="dark"] .cyber-orbit.o-1 { opacity: .15; }
[data-theme="dark"] .cyber-orbit.o-2 { opacity: .11; }
[data-theme="dark"] .cyber-orbit.o-3 { opacity: .08; }
[data-theme="dark"] .cyber-line.cl-1,[data-theme="dark"] .cyber-line.cl-4 { stroke: rgba(74,222,128,.25); }
[data-theme="dark"] .cyber-line.cl-2,[data-theme="dark"] .cyber-line.cl-5 { stroke: rgba(34,211,238,.18); }
[data-theme="dark"] .cyber-line.cl-3,[data-theme="dark"] .cyber-line.cl-6 { stroke: rgba(167,139,250,.14); }
[data-theme="dark"] .cyber-node { opacity: 0.9 !important; }
[data-theme="dark"] .cyber-axis { stroke-dasharray: 6 12; }

/* ── 第五层：噪点 ── */
.hero-noise {
  position: absolute;
  inset: 0;
  opacity: .018;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ── 星点 ── */
.sparkle {
  position: absolute;
  border-radius: 50%;
  background: #A78BFA;
  box-shadow: 0 0 6px rgba(167,139,250,.5), 0 0 16px rgba(167,139,250,.2);
  opacity: 0;
  animation: sparkleAnim 3.5s ease-in-out infinite;
  pointer-events: none;
}
.s-1 { top: 20%; left: 12%; width: 4px; height: 4px; animation-delay: 0s; }
.s-2 { top: 35%; right: 18%; width: 3px; height: 3px; animation-delay: 1.2s; }
.s-3 { top: 60%; left: 28%; width: 5px; height: 5px; animation-delay: 2.1s; }
.s-4 { bottom: 30%; right: 25%; width: 3px; height: 3px; animation-delay: 0.7s; }
.s-5 { top: 48%; left: 55%; width: 2px; height: 2px; animation-delay: 2.8s; }

@keyframes sparkleAnim {
  0%,100% { opacity: 0; transform: scale(0); }
  50%     { opacity: 1; transform: scale(1); }
}

/* =============================================
   内容区
   ============================================= */
.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 1rem 6rem;
  max-width: 720px;
  margin: 0 auto;
}

/* ── 品牌条 ── */
.brand-bar {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 0.4rem 1.2rem;
  border: 1px solid rgba(200,190,230,0.45);
  border-radius: var(--radius-full);
  background: rgba(255,255,255,.60);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
[data-theme="dark"] .brand-bar {
  background: rgba(10,10,15,.55);
  border-color: var(--border);
}
.brand-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px rgba(34,197,94,.4);
  animation: dotPulse 2s ease-in-out infinite;
}
.brand-dot:last-child { animation-delay: 1s; }
@keyframes dotPulse {
  0%,100% { opacity: 1; box-shadow: 0 0 8px rgba(34,197,94,.4); }
  50%     { opacity: .5; box-shadow: 0 0 4px rgba(34,197,94,.2); }
}
.brand-text {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  text-transform: uppercase;
}

/* ── 标题 ── */
.hero-title {
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.1em;
}
.title-line {
  display: block;
  font-size: clamp(2.5rem, 7vw, 4.75rem);
  font-weight: 800;
  letter-spacing: var(--letter-tighter);
  line-height: var(--line-height-tight);
  color: var(--text-primary);
}
.title-accent {
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
[data-theme="dark"] .title-accent {
  filter: drop-shadow(0 2px 12px rgba(74,222,128,.18));
}

/* ── 副标题 ── */
.hero-subtitle {
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  line-height: var(--line-height-normal);
  letter-spacing: 0.03em;
}

/* ── 搜索框 ── */
.search-wrap { width: 100%; max-width: 560px; margin-bottom: 1.25rem; }
.search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  /* 搜索框温馨底色 */
  background: var(--bg-warm-gray-100);
  border: 1.5px solid #DDD5E8;
  border-radius: var(--radius-full);
  padding: 0.7rem 0.85rem 0.7rem 1.35rem;
  transition: all var(--duration-slow) var(--ease-out);
  box-shadow: inset 0 1px 2px rgba(0,0,0,.02), 0 2px 8px rgba(139,92,246,0.06);
  position: relative;
}
.search-box.focused {
  border-color: transparent;
  box-shadow: inset 0 1px 2px rgba(0,0,0,.01), 0 0 0 2px #C4BAD6, 0 4px 18px rgba(139,92,246,.15);
  transform: translateY(-2px);
}
.search-border-glow {
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: var(--gradient-border);
  z-index: -1;
  opacity: 0;
  transition: opacity var(--duration-slow) ease;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  padding: 2px;
}
.search-box.focused .search-border-glow { opacity: 1; }

[data-theme="dark"] .search-box {
  box-shadow: inset 0 1px 4px rgba(0,0,0,.2), 0 0 0 1px var(--border);
}
[data-theme="dark"] .search-box.focused {
  box-shadow: inset 0 1px 3px rgba(0,0,0,.15), 0 0 0 2px var(--accent), var(--glow-accent-md);
}

.search-icon { color: var(--text-muted); flex-shrink: 0; transition: color var(--duration-normal) ease; }
.search-box.focused .search-icon { color: var(--accent); }
.search-input { flex: 1; border: none; outline: none; background: transparent; font-size: 0.9375rem; color: var(--text-primary); min-width: 0; }
.search-input::placeholder { color: var(--text-muted); }
.search-clear {
  display: flex; align-items: center; background: none; border: none;
  color: var(--text-muted); cursor: pointer; padding: 2px; border-radius: 50%;
  transition: all var(--duration-fast) ease;
}
.search-clear:hover { color: var(--text-secondary); background: var(--bg-tertiary); }
.search-btn {
  background: var(--accent); color: white; border: none; border-radius: var(--radius-full);
  padding: 0.55rem 1.35rem; font-size: 0.875rem; font-weight: 500; cursor: pointer;
  flex-shrink: 0; transition: all var(--duration-normal) ease;
}
.search-btn:hover { background: var(--accent-hover); box-shadow: var(--glow-accent-soft); transform: translateY(-1px); }

/* ── 标签 ── */
.tags-wrap {
  display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem;
  justify-content: center; margin-bottom: 2.5rem;
}
.tags-label { font-size: 0.78rem; color: var(--text-muted); }
.tag-pill {
  position: relative; display: inline-flex; align-items: center; justify-content: center;
  padding: 0.35rem 1rem;
  background: linear-gradient(135deg, rgba(200,195,230,0.35) 0%, rgba(245,220,220,0.30) 50%, rgba(220,235,250,0.28) 100%);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(200,195,220,0.40);
  border-radius: var(--radius-full); font-size: 0.8rem; color: #3D3830;
  cursor: pointer; transition: all 0.3s cubic-bezier(.4,0,.2,1);
}
.tag-txt { position: relative; z-index: 1; color: #3D3830; }
.tag-pill:hover {
  border-color: rgba(167,139,250,0.45);
  background: linear-gradient(135deg, rgba(190,182,230,0.50) 0%, rgba(240,205,205,0.45) 50%, rgba(210,228,245,0.42) 100%);
  color: #2D2620; transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139,92,246,0.12), 0 2px 6px rgba(149,149,149,.10);
}
.tag-pill:hover .tag-txt { color: #2D2620; }
/* 暗色模式标签 */
[data-theme="dark"] .tag-pill {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  color: var(--text-muted);
}
[data-theme="dark"] .tag-pill .tag-txt { color: var(--text-muted); }
[data-theme="dark"] .tag-pill:hover {
  border-color: rgba(74,222,128,0.25);
  background: rgba(74,222,128,0.08);
  color: var(--accent);
  box-shadow: 0 4px 14px rgba(74,222,128,0.08), 0 2px 4px rgba(0,0,0,.3);
}
[data-theme="dark"] .tag-pill:hover .tag-txt { color: var(--accent); }

/* ── CTA按钮组 ── */
.cta-group { display: flex; align-items: center; gap: 1rem; margin-bottom: 3.5rem; flex-wrap: wrap; justify-content: center; }
.cta-primary {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.8rem 1.75rem; background: var(--accent); color: white;
  border-radius: var(--radius-full); font-weight: 600; font-size: 0.9rem;
  text-decoration: none; transition: all var(--duration-normal) var(--ease-out);
  position: relative; overflow: hidden;
}
.cta-primary:hover { background: var(--accent-hover); transform: translateY(-2px); box-shadow: var(--glow-accent-md); }
.cta-secondary {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.8rem 1.75rem; background: transparent; color: var(--text-primary);
  border: 1.5px solid var(--border); border-radius: var(--radius-full);
  font-weight: 500; font-size: 0.9rem; text-decoration: none;
  transition: all var(--duration-normal) var(--ease-out);
}
.cta-secondary:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); box-shadow: var(--glow-accent-sm); }

/* ── 鼠标滚动提示 ── */
.scroll-hint { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.scroll-mouse {
  width: 22px; height: 34px; border: 2px solid var(--text-muted); border-radius: 11px;
  display: flex; justify-content: center; padding-top: 6px;
}
.scroll-wheel {
  width: 3px; height: 8px; border-radius: 2px; background: var(--accent);
  animation: wheelScroll 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
@keyframes wheelScroll {
  0%   { transform: translateY(0); opacity: 0.6; }
  25%  { transform: translateY(10px); opacity: 1; }
  50%  { transform: translateY(12px); opacity: 0.8; }
  75%  { transform: translateY(14px); opacity: 0.15; }
  100% { transform: translateY(16px); opacity: 0; }
}
.scroll-text { font-size: 0.72rem; color: var(--text-muted); letter-spacing: 0.08em; }

/* ── 音频响应控制按钮 ── */
.audio-toggle-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1.5px solid rgba(200,195,230,0.45);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(139,92,246,0.08), 0 2px 4px rgba(0,0,0,0.04);
}

.audio-toggle-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(167,139,250,0.6);
  box-shadow: 0 8px 24px rgba(139,92,246,0.15), 0 4px 8px rgba(0,0,0,0.06);
  color: var(--text-primary);
}

.audio-toggle-btn.active {
  background: linear-gradient(135deg, rgba(167,139,250,0.15) 0%, rgba(244,114,182,0.12) 100%);
  border-color: rgba(167,139,250,0.7);
  color: var(--accent);
  box-shadow: 0 6px 20px rgba(139,92,246,0.2), 0 3px 6px rgba(0,0,0,0.08);
}

.audio-toggle-btn.active:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 10px 28px rgba(139,92,246,0.25), 0 4px 10px rgba(0,0,0,0.1);
}

.audio-label {
  position: relative;
  z-index: 1;
}

.audio-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: rgba(167,139,250,0.3);
  animation: audioPulse 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes audioPulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.15);
    opacity: 0;
  }
}

[data-theme="dark"] .audio-toggle-btn {
  background: rgba(10,10,15,0.65);
  border-color: rgba(255,255,255,0.1);
  color: var(--text-muted);
  box-shadow: 0 4px 16px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2);
}

[data-theme="dark"] .audio-toggle-btn:hover {
  border-color: rgba(74,222,128,0.4);
  color: var(--text-secondary);
  box-shadow: 0 8px 24px rgba(74,222,128,0.15), 0 4px 8px rgba(0,0,0,0.4);
}

[data-theme="dark"] .audio-toggle-btn.active {
  background: rgba(74,222,128,0.12);
  border-color: rgba(74,222,128,0.5);
  color: var(--accent);
  box-shadow: 0 6px 20px rgba(74,222,128,0.25), 0 3px 6px rgba(0,0,0,0.3);
}

[data-theme="dark"] .audio-toggle-btn.active:hover {
  box-shadow: 0 10px 28px rgba(74,222,128,0.3), 0 4px 10px rgba(0,0,0,0.4);
}

[data-theme="dark"] .audio-pulse {
  background: rgba(74,222,128,0.3);
}

/* =============================================
   响应式
   ============================================= */
@media (max-width: 768px) {
  .hero-section { min-height: auto; padding: 64px 0 2.5rem; }
  .hero-content { padding-top: 2.5rem; padding-bottom: 2.5rem; }
  .brand-bar { margin-bottom: 1.5rem; }
  .hero-title { margin-bottom: 1rem; }
  .hero-subtitle { margin-bottom: 2rem; }
  .tags-wrap {
    margin-bottom: 2rem;
    flex-wrap: nowrap;
    justify-content: flex-start;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding: 0 0.25rem 0.35rem;
    mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  }
  .tags-wrap::-webkit-scrollbar { display: none; }
  .tags-label { flex-shrink: 0; }
  .tag-pill { flex-shrink: 0; }
  .cta-group { margin-bottom: 2.5rem; }
  .scroll-hint { display: none; }
  .sparkle { display: none; }

  /* 移动端简化赛博线条 */
  .hero-cyber-lines { opacity: 0.3; }
  .cyber-line { stroke-width: 0.5; }
  .cyber-node { display: none; }
  .particle { display: none; }

  /* 移动端音频按钮 */
  .audio-toggle-btn {
    bottom: 1rem;
    right: 1rem;
    padding: 0.65rem 1rem;
    font-size: 0.8rem;
  }
  
  .audio-label {
    display: none;
  }
  
  .audio-toggle-btn svg {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 1024px) and (min-width: 769px) {
  .hero-cyber-lines { opacity: 0.6; }
}
</style>
