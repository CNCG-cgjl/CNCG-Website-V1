<template>
  <main class="radar-page">
    <!-- Hero -->
    <section class="radar-hero">
      <div class="container">
        <h1>📡 信息雷达</h1>
        <p>每日 8:50 自动推送 · 187 信息源 · 10 章简报 · 飞书/QQ 推送</p>
      </div>
    </section>

    <!-- Input Section -->
    <section class="input-section">
      <div class="container">
        <div class="input-grid">
          <div class="input-card">
            <h3>📋 画像信息</h3>
            <div class="field">
              <label>行业</label>
              <input v-model="profile.industry" placeholder="如: 服装跨境、AI工具" />
            </div>
            <div class="field">
              <label>关注领域</label>
              <input v-model="profile.focus" placeholder="如: 市场机会、技术趋势" />
            </div>
            <div class="field">
              <label>模糊需求 / 一句话描述</label>
              <textarea v-model="profile.fuzzy" rows="3"
                placeholder="输入任意想法，系统会自动做关键词意图识别..."></textarea>
            </div>
            <div class="field">
              <label>上传文件 (可选)</label>
              <input type="file" @change="handleFile" accept=".pdf,.docx,.txt,.md" />
              <span v-if="fileName" class="file-name">{{ fileName }}</span>
            </div>
            <button class="btn-analyze" @click="analyze" :disabled="loading">
              {{ loading ? '分析中...' : '🚀 开始分析' }}
            </button>
          </div>

          <div class="insight-card">
            <h3>🧠 意图识别</h3>
            <div v-if="intentResult" class="intent-result">
              <div class="tag" v-for="tag in intentResult.tags" :key="tag">{{ tag }}</div>
              <p class="intent-summary">{{ intentResult.summary }}</p>
            </div>
            <div v-else class="intent-placeholder">
              <p>输入需求后，系统会自动进行语义解析和关键词意图识别</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Results -->
    <section v-if="results" class="results-section">
      <div class="container">
        <div class="result-tabs">
          <button v-for="tab in tabs" :key="tab.key"
            :class="['tab', { active: activeTab === tab.key }]"
            @click="activeTab = tab.key">
            {{ tab.label }}
          </button>
        </div>

        <div class="result-content">
          <!-- Market Phase Gauge -->
          <div v-if="activeTab === 'overview'" class="overview-grid">
            <div class="gauge-card">
              <h4>市场阶段</h4>
              <div class="gauge" :style="{ background: phaseColor }">
                <span>{{ results.phase || '分析中' }}</span>
              </div>
            </div>
            <div class="stat-card" v-for="s in stats" :key="s.label">
              <span class="stat-num">{{ s.value }}</span>
              <span class="stat-desc">{{ s.label }}</span>
            </div>
          </div>

          <!-- Radar Chart -->
          <div v-if="activeTab === 'radar'" class="radar-viz">
            <div class="radar-grid">
              <div class="radar-item" v-for="r in radarData" :key="r.name">
                <div class="radar-label">{{ r.name }}</div>
                <div class="radar-bar-bg">
                  <div class="radar-bar-fill" :style="{ width: r.score + '%', background: r.color }"></div>
                </div>
                <span class="radar-score">{{ r.score }}</span>
              </div>
            </div>
          </div>

          <!-- Signals -->
          <div v-if="activeTab === 'signals'" class="signals-list">
            <div class="signal-card" v-for="s in signals" :key="s.title">
              <div class="signal-source">{{ s.source }}</div>
              <h4>{{ s.title }}</h4>
              <p>{{ s.desc }}</p>
              <a v-if="s.url" :href="s.url" target="_blank" class="signal-link">查看原文 →</a>
            </div>
          </div>

          <!-- JSON -->
          <div v-if="activeTab === 'json'" class="json-view">
            <pre>{{ JSON.stringify(results, null, 2) }}</pre>
            <button class="btn-copy" @click="copyJson">📋 复制 JSON</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Weekly Trend -->
    <section v-if="signals.length" class="trend-section">
      <div class="container">
        <h3>📈 信号时间分布</h3>
        <div class="trend-chart">
          <div class="trend-bar" v-for="(day, i) in trendDays" :key="i">
            <div class="trend-fill" :style="{ height: day.count * 20 + '%' }"></div>
            <span class="trend-label">{{ day.label }}</span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, reactive } from 'vue'

const profile = reactive({ industry: '', focus: '', fuzzy: '' })
const loading = ref(false)
const results = ref(null)
const activeTab = ref('overview')
const fileName = ref('')
const intentResult = ref(null)
const signals = ref([])

const tabs = [
  { key: 'overview', label: '📊 概览' },
  { key: 'radar', label: '🎯 雷达' },
  { key: 'signals', label: '📡 信号' },
  { key: 'json', label: '{ } JSON' },
]

const stats = [
  { label: '信息源覆盖', value: '187' },
  { label: '风险因子', value: '6' },
  { label: '推送通道', value: '2' },
  { label: '余额可用', value: '4年' },
]

const radarData = [
  { name: '行业雷达', score: 85, color: '#8b5cf6' },
  { name: '设计雷达', score: 72, color: '#06b6d4' },
  { name: '安全雷达', score: 68, color: '#22c55e' },
  { name: '心理雷达', score: 45, color: '#f59e0b' },
]

const phaseColor = '#22c55e'
const trendDays = [
  { label: '周一', count: 3 },
  { label: '周二', count: 5 },
  { label: '周三', count: 2 },
  { label: '周四', count: 4 },
  { label: '周五', count: 6 },
  { label: '周六', count: 1 },
  { label: '周日', count: 2 },
]

function handleFile(e) {
  const file = e.target.files[0]
  fileName.value = file ? file.name : ''
}

function analyze() {
  loading.value = true
  intentResult.value = {
    tags: ['市场分析', '趋势研判', '风险扫描'],
    summary: `检测到核心意图: ${profile.industry || profile.fuzzy || '通用市场分析'} — 正在进行多源信号采集...`
  }
  
  // Simulate results
  setTimeout(() => {
    results.value = {
      phase: '供不应求',
      gap: 0.18,
      demand: 0.72,
      supply: 0.54,
      signals_count: 42,
      sources: ['HackerNews', 'GitHub', 'AIHOT', 'Arxiv'],
    }
    signals.value = [
      { source: 'HN', title: 'AI 算力瓶颈显现', desc: '微软将 GitHub 负载迁移至 AWS，揭示云基础设施的供需矛盾', url: '#' },
      { source: 'GitHub', title: '新框架 Iroh 1.0 发布', desc: '去中心化点对点网络库，API 稳定可用于生产', url: '#' },
      { source: 'AIHOT', title: 'Salesforce 收购 Fin', desc: '36亿美元收购 AI 客服平台，CRM 巨头加速整合', url: '#' },
    ]
    loading.value = false
  }, 1500)
}

function copyJson() {
  navigator.clipboard.writeText(JSON.stringify(results.value, null, 2))
}
</script>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

.radar-hero {
  padding: 80px 0 40px;
  text-align: center;
  background: linear-gradient(180deg, #f8f6ff 0%, #fff 100%);
}
.radar-hero h1 { font-size: 42px; font-weight: 800; margin-bottom: 12px; }
.radar-hero p { color: #666; font-size: 16px; }

.input-section { padding: 40px 0; }
.input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.input-card, .insight-card {
  padding: 28px; border-radius: 16px;
  border: 1px solid #e8e2f0; background: white;
}
.field { margin-bottom: 16px; }
.field label { display: block; font-size: 13px; font-weight: 600; color: #555; margin-bottom: 6px; }
.field input, .field textarea {
  width: 100%; padding: 10px 14px;
  border: 1px solid #ddd; border-radius: 10px;
  font-size: 14px; outline: none;
}
.field input:focus, .field textarea:focus { border-color: #8b5cf6; }
.file-name { display: block; font-size: 12px; color: #8b5cf6; margin-top: 4px; }
.btn-analyze {
  width: 100%; padding: 14px; border: none; border-radius: 12px;
  background: linear-gradient(135deg, #8b5cf6, #06b6d4); color: white;
  font-size: 16px; font-weight: 600; cursor: pointer;
}
.btn-analyze:disabled { opacity: 0.6; cursor: not-allowed; }

.insight-card h3 { margin-bottom: 16px; }
.tag {
  display: inline-block; padding: 4px 12px; border-radius: 20px;
  background: rgba(139,92,246,0.1); color: #8b5cf6;
  font-size: 12px; font-weight: 600; margin: 0 4px 8px 0;
}
.intent-summary { font-size: 14px; color: #555; line-height: 1.6; }
.intent-placeholder p { color: #aaa; text-align: center; padding: 40px 0; }

.results-section { padding: 40px 0; background: #f8f6ff; }
.result-tabs { display: flex; gap: 8px; margin-bottom: 24px; }
.tab { padding: 10px 20px; border: 1px solid #e8e2f0; border-radius: 10px;
  background: white; cursor: pointer; font-size: 14px; }
.tab.active { background: #8b5cf6; color: white; border-color: #8b5cf6; }

.overview-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.gauge-card { grid-column: 1 / -1; padding: 24px; background: white; border-radius: 16px; }
.gauge { padding: 20px; border-radius: 12px; text-align: center; color: white; font-size: 24px; font-weight: 700; }
.stat-card { padding: 20px; background: white; border-radius: 12px; text-align: center; }
.stat-num { display: block; font-size: 28px; font-weight: 800; color: #8b5cf6; }
.stat-desc { font-size: 13px; color: #888; }

.radar-grid { display: grid; gap: 16px; }
.radar-item { display: flex; align-items: center; gap: 12px; }
.radar-label { width: 100px; font-size: 14px; font-weight: 600; }
.radar-bar-bg { flex: 1; height: 20px; background: #eee; border-radius: 10px; overflow: hidden; }
.radar-bar-fill { height: 100%; border-radius: 10px; transition: width 0.6s; }
.radar-score { width: 40px; text-align: right; font-weight: 700; }

.signals-list { display: grid; gap: 12px; }
.signal-card { padding: 20px; background: white; border-radius: 12px; }
.signal-source { font-size: 11px; color: #8b5cf6; font-weight: 600; margin-bottom: 4px; }
.signal-card h4 { font-size: 15px; margin-bottom: 4px; }
.signal-card p { font-size: 13px; color: #666; }
.signal-link { font-size: 12px; color: #8b5cf6; text-decoration: none; }

.json-view pre { background: #1a1a2e; color: #a5d6ff; padding: 20px; border-radius: 12px; font-size: 13px; overflow: auto; max-height: 400px; }
.btn-copy { margin-top: 12px; padding: 8px 16px; border: 1px solid #ddd; border-radius: 8px; background: white; cursor: pointer; }

.trend-section { padding: 60px 0; }
.trend-chart { display: flex; justify-content: center; align-items: flex-end; gap: 12px; height: 200px; padding: 20px 0; }
.trend-bar { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.trend-fill { width: 40px; background: linear-gradient(180deg, #8b5cf6, #06b6d4); border-radius: 6px 6px 0 0; min-height: 10px; }
.trend-label { font-size: 12px; color: #888; }
</style>
