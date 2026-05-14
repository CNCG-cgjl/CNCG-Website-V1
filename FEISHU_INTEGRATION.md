# 飞书集成配置指南

> 📅 创建日期：2026-05-07
> 🎯 版本：v1.0.0

---

## 📋 目录

1. [飞书开放平台配置](#飞书开放平台配置)
2. [权限配置说明](#权限配置说明)
3. [环境变量配置](#环境变量配置)
4. [测试连接](#测试连接)
5. [创建飞书内容结构](#创建飞书内容结构)
6. [集成到网站](#集成到网站)
7. [常见问题](#常见问题)

---

## 飞书开放平台配置

### 创建应用

1. 访问 [飞书开放平台](https://open.feishu.cn/)
2. 登录飞书账号
3. 点击 **"开发者后台"**
4. 选择 **"创建应用"** → **"企业自建应用"**
5. 填写应用信息：
   ```
   应用名称：CNCG 内容管理系统
   应用描述：用于获取飞书知识库和文档内容
   ```

### 获取凭证

1. 进入应用详情
2. 左侧菜单 → **"凭证与基础信息"**
3. 复制 **App ID** 和 **App Secret**

**您的应用凭证**：
```
App ID: cli_a97693b0d3381cba
App Secret: [请查看您的飞书开放平台应用]
```

⚠️ **重要**：App Secret 类似密码，请妥善保管，不要泄露给他人！

---

## 权限配置说明

### 为什么找不到某些权限？

飞书开放平台的权限名称可能与文档中描述的不完全一致。请按以下方法查找：

### 查找权限的方法

1. 进入应用的 **"权限管理"** 页面
2. 在搜索框中尝试以下关键词：

**中文关键词**：
- 文档
- 文档阅读
- 知识库
- 云文档
- 查看
- 只读

**英文关键词**：
- docx
- document
- drive
- wiki
- read

### 推荐的权限列表

#### 文档类权限（docx）

| 权限名称 | 权限标识 | 说明 | 必需程度 |
|---------|---------|------|---------|
| 获取文档内容 | docx:document:readonly | 读取文档正文内容 | ⭐⭐⭐⭐⭐ 必需 |
| 获取文档元信息 | docx:document.meta:readonly | 读取文档标题等信息 | ⭐⭐⭐⭐⭐ 必需 |

#### 云文档类权限（drive）

| 权限名称 | 权限标识 | 说明 | 必需程度 |
|---------|---------|------|---------|
| 获取文件列表 | drive:file:readonly | 列出云文档文件 | ⭐⭐⭐⭐ 推荐 |
| 获取文件夹列表 | drive:folder:readonly | 列出云文档文件夹 | ⭐⭐⭐⭐ 推荐 |

#### 知识库类权限（wiki）

| 权限名称 | 权限标识 | 说明 | 必需程度 |
|---------|---------|------|---------|
| 获取知识库节点 | wiki:node:readonly | 读取知识库中的文档 | ⭐⭐⭐⭐ 推荐 |
| 获取知识库空间 | wiki:space:readonly | 获取知识库列表 | ⭐⭐⭐⭐ 推荐 |

### 如果权限找不到怎么办？

#### 方案 1：搜索相似权限

有时权限名称略有不同，例如：
- "获取文档内容" 可能显示为 "查看新版文档"
- "读取" 可能显示为 "查看" 或 "访问"

**建议**：先添加您能找到的权限，然后进行测试。

#### 方案 2：使用 iframe 嵌入

如果 API 权限受限，可以使用飞书文档的嵌入功能：

```html
<iframe
  src="https://your-company.feishu.cn/docx/xxxxxxxxxxxxxx"
  width="100%"
  height="600"
  frameborder="0"
></iframe>
```

#### 方案 3：发布应用

某些权限需要在应用发布后才能使用：

1. 左侧菜单 → **"版本管理与发布"**
2. 点击 **"创建版本"**
3. 填写版本信息并 **"申请发布"**
4. 等待管理员审批（或如果你是管理员，直接审批通过）

---

## 环境变量配置

### 创建 .env.local 文件

在项目根目录创建 `.env.local` 文件：

```bash
touch .env.local
```

### 添加配置

```env
# 飞书开放平台配置（必需）
VITE_FEISHU_APP_ID=cli_a97693b0d3381cba
VITE_FEISHU_APP_SECRET=你的App Secret

# 知识库配置（可选，如果使用知识库）
VITE_FEISHU_KNOWLEDGE_BASE_ID=你的知识库ID

# 网站基础信息
VITE_SITE_URL=https://cncg.me
VITE_SITE_NAME=CNCG
VITE_SITE_DESC=专注网站开发、内容创作与数字化解决方案
```

⚠️ **重要**：
- `.env.local` 不会推送到 GitHub（已加入 .gitignore）
- 确保 App Secret 不泄露

---

## 测试连接

### 方法 1：访问测试页面

启动开发服务器后，访问：

```
http://localhost:5173/feishu-test
```

这个页面提供了：
- ✅ 连接状态测试
- ✅ 文档获取测试
- ✅ 权限验证
- ✅ 配置说明

### 方法 2：使用命令行测试

```bash
# 测试获取 Access Token
curl -X POST 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal' \
  -H 'Content-Type: application/json' \
  -d '{
    "app_id": "cli_a97693b0d3381cba",
    "app_secret": "你的App Secret"
  }'
```

如果成功，返回：
```json
{
  "code": 0,
  "msg": "ok",
  "tenant_access_token": "xxx",
  "expire": 7200
}
```

---

## 创建飞书内容结构

### 推荐的飞书知识库结构

```
📚 CNCG 知识库
│
├── 🗂️ 01-技术文档
│   ├── 📖 前端开发
│   │   ├── Vue 3 最佳实践
│   │   ├── Vite 性能优化
│   │   └── Tailwind CSS 设计系统
│   ├── 📖 后端技术
│   │   ├── Node.js 实践
│   │   └── API 设计规范
│   └── 📖 开发工具
│       ├── Git 工作流
│       └── Docker 容器化
│
├── 🗂️ 02-项目经验
│   ├── 📁 项目复盘
│   │   ├── CNCG 网站重构总结
│   │   └── AI 工具集成记录
│   ├── 📁 踩坑记录
│   │   ├── 性能优化之路
│   │   └── 样式兼容问题
│   └── 📁 解决方案
│       ├── SSO 单点登录
│       └── 微服务架构
│
├── 🗂️ 03-碎片化记录
│   ├── 🌸 生活随笔
│   │   ├── 今日感想
│   │   └── 学习心得
│   ├── 📚 读书笔记
│   │   ├── 《代码大全》摘录
│   │   └── 《架构整洁之道》要点
│   └── 💡 灵感记录
│       ├── 创业想法
│       └── 产品创意
│
└── 🗂️ 04-草稿箱
    ├── 待发布文章
    └── 素材收集
```

### 获取文档 ID

1. 打开飞书文档或知识库
2. 复制浏览器地址栏的 URL：

```
https://xxx.feishu.cn/docx/BrGWdXXXXXXiLgBd
                    ↑ 这里就是文档 Token

https://xxx.feishu.cn/wiki/BrGWdXXXXXXiLgBd
                    ↑ 知识库的 Node Token
```

3. 记录这些 ID，后续用于配置

---

## 集成到网站

### 代码文件说明

项目已创建以下文件：

#### 1. 飞书 API 封装
**文件**: `src/composables/useFeishu.js`

提供以下功能：
- `getAccessToken()` - 获取访问令牌
- `fetchDocuments()` - 获取文档列表
- `fetchDocumentContent()` - 获取单个文档内容
- `fetchKnowledgeBase()` - 获取知识库节点

#### 2. 飞书文档查看器
**文件**: `src/components/common/FeishuDocViewer.vue`

使用方法：
```vue
<template>
  <FeishuDocViewer :docId="documentId" />
</template>

<script setup>
import FeishuDocViewer from '@/components/common/FeishuDocViewer.vue'

const documentId = 'BrGWdXXXXXXiLgBd'
</script>
```

#### 3. 飞书测试页面
**文件**: `src/views/FeishuTestPage.vue`

访问路径：`/feishu-test`

提供：
- 连接状态测试
- 文档获取测试
- 配置说明

---

### 在页面中使用

#### 示例 1：知识库列表页

```vue
<template>
  <div class="knowledge-base">
    <h1>知识库</h1>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else class="doc-list">
      <div
        v-for="doc in documents"
        :key="doc.token"
        class="doc-item"
        @click="viewDocument(doc.token)"
      >
        <h3>{{ doc.title }}</h3>
        <p>{{ doc.summary }}</p>
      </div>
    </div>

    <!-- 文档详情弹窗 -->
    <div v-if="selectedDoc" class="modal">
      <button @click="selectedDoc = null">关闭</button>
      <FeishuDocViewer :docId="selectedDoc" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFeishu } from '@/composables/useFeishu'
import FeishuDocViewer from '@/components/common/FeishuDocViewer.vue'

const { fetchDocuments, loading } = useFeishu()
const documents = ref([])
const selectedDoc = ref(null)

onMounted(async () => {
  documents.value = await fetchDocuments()
})

const viewDocument = (docId) => {
  selectedDoc.value = docId
}
</script>
```

#### 示例 2：笔记列表页

```vue
<template>
  <div class="notes-page">
    <h1>我的笔记</h1>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else class="notes-grid">
      <div
        v-for="note in notes"
        :key="note.id"
        class="note-card"
        @click="openNote(note)"
      >
        <h3>{{ note.title }}</h3>
        <div class="tags">
          <span v-for="tag in note.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
        <p class="summary">{{ note.summary }}</p>
        <time>{{ formatDate(note.created) }}</time>
      </div>
    </div>
  </div>
</template>
```

---

## 常见问题

### Q1: 权限申请后多久生效？

**回答**：通常情况下，权限申请后立即生效。如果需要管理员审批，可能需要 1-24 小时。

### Q2: Token 有效期是多久？

**回答**：tenant_access_token 有效期为 2 小时。代码中已实现自动刷新机制。

### Q3: API 请求频率有限制吗？

**回答**：是的，飞书 API 有以下限制：

| 级别 | 限制 |
|------|------|
| 免费版 | 每应用每秒 5 次调用 |
| 付费版 | 每应用每秒 20 次调用 |

**建议**：
- 实现请求缓存
- 批量获取数据
- 避免频繁调用

### Q4: 如何处理文档内容渲染？

**回答**：飞书返回的内容是 JSON 格式，需要转换为 HTML。有以下方案：

**方案 1：使用官方渲染库（推荐）**
```bash
npm install @feishu/docx-sdk
```

**方案 2：使用 Markdown 转换**
飞书文档支持导出为 Markdown，可以：
1. 调用导出 API
2. 使用 markdown-it 渲染

**方案 3：使用 iframe 嵌入（最简单）**
```html
<iframe
  :src="`https://your-company.feishu.cn/docx/${docId}?embed=true`"
  width="100%"
  height="800"
/>
```

### Q5: 如何获取知识库的根节点？

**回答**：需要先创建知识库，然后获取知识库 ID：

1. 打开知识库
2. 浏览器地址栏 URL：
```
https://xxx.feishu.cn/wiki/xxxxx
```
3. `xxxxx` 就是知识库的 Space ID

### Q6: 本地开发正常，部署后报错？

**回答**：可能的原因：

1. **环境变量未配置**
   - Vercel 需要在项目设置中添加环境变量

2. **域名白名单**
   - 飞书应用可能限制了请求来源
   - 在飞书开放平台 → 安全设置 → IP 白名单（如果启用了）

3. **CORS 问题**
   - 确保飞书应用的请求域名已添加
   - 在飞书开放平台 → 安全设置 → 重定向 URL

### Q7: 如何实现内容的实时同步？

**回答**：有以下方案：

**方案 1：客户端实时获取（推荐小访问量）**
- 用户访问时，实时从飞书获取
- 优点：实时性高
- 缺点：受 API 限制

**方案 2：服务端定时同步（推荐大访问量）**
- 使用 Vercel Cron Jobs 或其他定时任务
- 定时从飞书拉取数据
- 存储到 CDN 或数据库
- 优点：性能好，访问快
- 缺点：有延迟

**方案 3：混合方案**
- 实时获取 + 本地缓存
- 首次访问时获取并缓存
- 后续访问使用缓存
- 定时更新缓存

---

## 📞 技术支持

如果遇到问题：

1. 查看浏览器控制台错误信息
2. 检查飞书开放平台的应用日志
3. 确认权限是否已开通
4. 检查环境变量配置是否正确

---

## 🎯 下一步

1. ✅ 完成飞书开放平台配置
2. ⏳ 申请必要的权限
3. ⏳ 创建知识库和内容
4. ⏳ 测试 API 连接
5. ⏳ 集成到网站页面
6. ⏳ 优化性能和缓存

---

**祝您配置顺利！有任何问题随时联系我！** 🚀
