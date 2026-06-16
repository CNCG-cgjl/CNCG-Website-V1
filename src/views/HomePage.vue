<template>
  <main class="home-page">
    <!-- Hero -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <p class="hero-label">AI Intelligence Radar</p>
          <h1 class="hero-title">
            信息雷达<br/>
            <span class="gradient-text">让决策不再靠拍脑袋</span>
          </h1>
          <p class="hero-desc">
            AI 驱动的每日情报系统 · 187 信息源 · 10 章结构简报 · 飞书/QQ 推送
          </p>
          <div class="hero-actions">
            <RouterLink to="/radar" class="btn-primary">📡 试用信息雷达</RouterLink>
            <RouterLink to="/services" class="btn-secondary">了解更多 →</RouterLink>
          </div>
        </div>
        <div class="hero-visual">
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-value">187</span>
              <span class="stat-label">信息源</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">10</span>
              <span class="stat-label">章节简报</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">4</span>
              <span class="stat-label">大雷达</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">8:50</span>
              <span class="stat-label">每日推送</span>
            </div>
          </div>
          <div class="hero-chart">
            <div class="chart-bar" v-for="i in 7" :key="i"
              :style="{ height: 20 + Math.random() * 60 + 'px' }">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Products -->
    <section class="products-section">
      <div class="container">
        <h2 class="section-title">产品与服务</h2>
        <p class="section-subtitle">帮你把信息变成决策力</p>
        <div class="products-grid">
          <RouterLink to="/radar" class="product-card">
            <div class="card-icon">📡</div>
            <h3>信息雷达</h3>
            <p>187 源每日情报 · 深层机会分析 · 飞书/QQ推送</p>
            <span class="card-tag">核心产品</span>
          </RouterLink>
          <RouterLink to="/geo" class="product-card">
            <div class="card-icon">🌐</div>
            <h3>GEO 检测</h3>
            <p>AI 可见性体检 · 结构化数据 · llm.txt 生成</p>
            <span class="card-tag">免费工具</span>
          </RouterLink>
          <RouterLink to="/services" class="product-card">
            <div class="card-icon">🛠️</div>
            <h3>网站改造</h3>
            <p>AI-ready 网站升级 · SEO 优化 · 内容结构化</p>
            <span class="card-tag">技术服务</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Pipeline Visual -->
    <section class="pipeline-section">
      <div class="container">
        <h2 class="section-title">每日情报管线</h2>
        <div class="pipeline-flow">
          <div class="pipe-step" v-for="(step, i) in pipeline" :key="i">
            <div class="step-icon">{{ step.icon }}</div>
            <div class="step-info">
              <strong>{{ step.title }}</strong>
              <span>{{ step.desc }}</span>
            </div>
            <div v-if="i < pipeline.length - 1" class="step-arrow">→</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="container">
        <h2>开始使用信息雷达</h2>
        <p>每日 8:50 自动推送 · 已处理 4 期简报 · 余额可跑 4 年</p>
        <div class="cta-actions">
          <RouterLink to="/radar" class="btn-primary">📡 立即体验</RouterLink>
          <RouterLink to="/faq" class="btn-secondary">常见问题</RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
const pipeline = [
  { icon: '📡', title: '187 信息源', desc: 'AIHOT / HN / GitHub / Reddit / Arxiv' },
  { icon: '🧠', title: '深层机会分析', desc: 'LLM 提取结构化机会 + 5维评分' },
  { icon: '📊', title: '10 章简报生成', desc: 'DIOS v1 标准输出协议' },
  { icon: '✅', title: '质量门检查', desc: '5维质检 · 低于70%自动修复' },
  { icon: '📬', title: '飞书/QQ 推送', desc: '8:50 / 16:00 定时推送' },
]
</script>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

/* Hero */
.hero-section {
  padding: 100px 0 60px;
  background: var(--gradient-hero, linear-gradient(180deg, #f8f6ff 0%, #fff 100%));
}
.hero-section .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}
.hero-label {
  color: #8b5cf6;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 16px;
}
.hero-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 20px;
}
.gradient-text {
  background: linear-gradient(135deg, #8b5cf6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-desc {
  font-size: 18px;
  color: #666;
  margin-bottom: 32px;
  line-height: 1.6;
}
.hero-actions { display: flex; gap: 12px; }
.btn-primary, .btn-secondary {
  padding: 12px 28px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-primary {
  background: linear-gradient(135deg, #8b5cf6, #06b6d4);
  color: white;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(139,92,246,0.3); }
.btn-secondary {
  background: rgba(139,92,246,0.08);
  color: #4a4a6a;
}
.btn-secondary:hover { background: rgba(139,92,246,0.15); }

/* Hero Visual */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}
.stat-card {
  background: rgba(255,255,255,0.8);
  border: 1px solid #e8e2f0;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  backdrop-filter: blur(8px);
}
.stat-value {
  display: block;
  font-size: 32px;
  font-weight: 800;
  color: #8b5cf6;
}
.stat-label {
  font-size: 13px;
  color: #888;
}
.hero-chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 120px;
  padding: 16px;
  background: rgba(255,255,255,0.5);
  border-radius: 16px;
  border: 1px solid #e8e2f0;
}
.chart-bar {
  flex: 1;
  background: linear-gradient(180deg, #8b5cf6, #06b6d4);
  border-radius: 4px 4px 0 0;
  min-height: 10px;
  transition: height 0.3s;
}

/* Products */
.products-section {
  padding: 80px 0;
}
.section-title {
  text-align: center;
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 8px;
}
.section-subtitle {
  text-align: center;
  color: #888;
  margin-bottom: 48px;
}
.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.product-card {
  padding: 32px;
  border-radius: 20px;
  border: 1px solid #e8e2f0;
  background: white;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(139,92,246,0.1);
  border-color: #c4b5fd;
}
.card-icon { font-size: 36px; margin-bottom: 16px; }
.product-card h3 { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
.product-card p { font-size: 14px; color: #666; line-height: 1.6; }
.card-tag {
  display: inline-block;
  margin-top: 16px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(139,92,246,0.1);
  color: #8b5cf6;
}

/* Pipeline */
.pipeline-section {
  padding: 80px 0;
  background: #f8f6ff;
}
.pipeline-flow {
  max-width: 800px;
  margin: 0 auto;
}
.pipe-step {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: white;
  border-radius: 14px;
  margin-bottom: 12px;
  border: 1px solid #e8e2f0;
}
.step-icon { font-size: 28px; }
.step-info { flex: 1; }
.step-info strong { display: block; font-size: 15px; }
.step-info span { font-size: 13px; color: #888; }
.step-arrow { color: #c4b5fd; font-size: 20px; font-weight: bold; }

/* CTA */
.cta-section {
  padding: 80px 0;
  text-align: center;
  background: linear-gradient(135deg, #8b5cf6, #06b6d4);
  color: white;
}
.cta-section h2 { font-size: 36px; font-weight: 800; margin-bottom: 12px; }
.cta-section p { font-size: 16px; opacity: 0.9; margin-bottom: 32px; }
.cta-actions { display: flex; gap: 12px; justify-content: center; }
.cta-section .btn-primary {
  background: white;
  color: #8b5cf6;
}
.cta-section .btn-secondary {
  background: rgba(255,255,255,0.15);
  color: white;
}
</style>
