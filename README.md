# CNNG Website - Production Version

> 🎯 CNCG 专业远程技术服务平台 - 生产版本网站

![Vue](https://img.shields.io/badge/Vue-3.5.32-4FC08D?style=flat-square&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-8.0.10-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.4-06B6D4?style=flat-square&logo=tailwind-css)
![Vue Router](https://img.shields.io/badge/Vue_Router-4.6.4-4FC08D?style=flat-square)

## 🚀 项目简介

CNCG 官网是一个现代化的单页应用（SPA），集成了多种功能模块，包括：

- 🏠 **首页展示**：品牌形象、服务介绍、内容预览
- 📝 **博客系统**：技术博客、学习笔记
- 📚 **知识库**：结构化文档（Notion API 同步）
- 🛒 **在线店铺**：产品/服务销售
- 👤 **关于页面**：个人介绍与联系方式

### ✨ 核心特性

- 🌓 **明暗模式切换**：支持亮色/暗色双主题
- 📱 **响应式设计**：完美适配桌面端和移动端
- 🎨 **现代化 UI**：简约 + 科技感 + 线条哲学
- ⚡ **快速加载**：Vite 构建，秒级热重载
- 🔍 **SEO 友好**：支持 robots.txt 和 sitemap.xml
- 🎭 **动效丰富**：流畅的页面过渡和交互效果

## 🛠️ 技术栈

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 前端框架 | Vue 3 | ^3.5.32 | 用户界面（Composition API）|
| 构建工具 | Vite | ^8.0.10 | 开发服务器 & 生产构建 |
| 样式框架 | Tailwind CSS | ^4.2.4 | 原子化 CSS（@tailwindcss/vite 插件）|
| 路由管理 | Vue Router | ^4.6.4 | 单页应用路由 |
| 数据存储 | Supabase | - | 后端即服务（评论系统）|
| 内容管理 | Notion API | - | 知识库数据源 |
| 部署平台 | Vercel | - | 静态站点托管 + CI/CD |

## 📦 安装与运行

### 环境要求

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **包管理器**: npm / yarn / pnpm（推荐使用 npm）

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/YOUR_USERNAME/CNNG-Website-Production.git

# 2. 进入项目目录
cd CNNG-Website-Production

# 3. 安装依赖
npm install

# 4. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入真实的 API 密钥

# 5. 启动开发服务器
npm run dev
```

### 开发脚本

```bash
# 开发服务器（热重载）
npm run dev

# 生产构建
npm run build

# 预览生产版本
npm run preview

# 代码检查（可选）
npm run lint
```

## 📁 项目结构

```
CNNG-Website-Production/
├── public/                      # 静态公共资源
│   ├── favicon.svg            # 网站图标（紫色闪电）
│   ├── icons.svg              # SVG 图标精灵
│   ├── robots.txt             # SEO 爬虫规则
│   └── sitemap.xml            # SEO 站点地图
├── src/                       # 源代码
│   ├── assets/               # 资源文件
│   │   ├── logo.jpg         # CNCG Logo（蓝紫渐变）
│   │   └── wechat-qrcode.jpg # 微信二维码
│   ├── components/           # Vue 组件
│   │   ├── common/          # 通用组件
│   │   │   ├── Logo.vue     # Logo 组件
│   │   │   └── SplashScreen.vue # 启动画面
│   │   ├── home/            # 首页组件
│   │   │   ├── HeroSection.vue      # Hero 区域
│   │   │   ├── ServicesSection.vue  # 服务卡片
│   │   │   └── ContentPreview.vue   # 内容预览
│   │   └── layout/          # 布局组件
│   │       ├── MainHeader.vue # 顶部导航
│   │       └── MainFooter.vue # 页脚
│   ├── composables/         # Vue 3 组合式函数
│   │   ├── useTheme.js      # 主题切换逻辑
│   │   ├── useIntersectionObserver.js # 滚动渐入动画
│   │   └── useNotion.js     # Notion API 集成
│   ├── router/              # 路由配置
│   │   └── index.js         # 路由定义
│   ├── views/              # 页面组件
│   │   ├── HomePage.vue     # 首页
│   │   ├── AboutPage.vue    # 关于页
│   │   ├── BlogPage.vue     # 博客列表
│   │   ├── BlogDetailPage.vue # 博客详情
│   │   ├── NotePage.vue     # 笔记列表
│   │   ├── NoteDetailPage.vue # 笔记详情
│   │   ├── DocPage.vue      # 知识库
│   │   ├── ServicesPage.vue # 服务页
│   │   ├── ContactPage.vue  # 联系页
│   │   ├── ShopPage.vue     # 商店页
│   │   └── NotFoundPage.vue # 404 页面
│   ├── App.vue              # 根组件
│   ├── main.js              # 入口文件
│   └── style.css            # 全局样式（Design Token）
├── .env.example             # 环境变量示例
├── .gitignore               # Git 忽略规则
├── index.html               # HTML 入口模板
├── package.json             # 依赖配置
├── vite.config.js          # Vite 构建配置
├── vercel.json             # Vercel 部署配置
└── README.md                # 项目说明文档
```

## ⚙️ 配置说明

### 环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

编辑 `.env.local`，配置以下变量：

```env
# Notion 集成
VITE_NOTION_TOKEN=sk_your_notion_integration_token
VITE_NOTION_DATABASE_ID=your_notion_database_id

# Supabase 配置
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 网站信息
VITE_SITE_URL=https://cncg.me
VITE_SITE_NAME=CNCG
VITE_SITE_DESC=专注网站开发、内容创作与数字化解决方案
```

⚠️ **注意**: `.env.local` 不会推送到 GitHub（已加入 `.gitignore`）

### Notion Database 结构

在 Notion 中创建 Database，需包含以下属性：

| 属性名 | 类型 | 说明 |
|--------|------|------|
| Name / title | Title | 文章标题（必需）|
| Summary | Text | 摘要 |
| Tags | Multi-select | 标签 |
| Category | Select | 分类 |
| Created | Created time | 自动生成 |
| Last edited | Last edited time | 自动生成 |

## 🌐 部署指南

### Vercel 部署（推荐）

1. **导入仓库**
   - 登录 [Vercel](https://vercel.com)
   - 点击 "Add New..." → "Project"
   - 选择 `CNNG-Website-Production` 仓库

2. **配置项目**
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   ```

3. **配置环境变量**
   - 在 Vercel 项目设置中添加环境变量
   - 参考上面的 `.env.example` 配置

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成（1-2分钟）
   - 访问分配的域名预览网站

5. **自定义域名**（可选）
   - 进入 Settings → Domains
   - 添加您的域名（如 cncg.me）
   - 配置 DNS 记录

### GitHub Pages 部署

1. 修改 `vite.config.js`：
   ```javascript
   export default defineConfig({
     base: './',
     // ... 其他配置
   })
   ```

2. 构建项目：
   ```bash
   npm run build
   ```

3. 推送 `dist` 文件夹到 GitHub Pages

## 🧪 开发指南

### 组件开发

在 `src/components/` 下创建组件：

```vue
<template>
  <div class="your-component">
    <!-- 组件内容 -->
  </div>
</template>

<script setup>
// 组合式 API
</script>

<style scoped>
.your-component {
  /* 组件样式 */
}
</style>
```

### 路由配置

在 `src/router/index.js` 中添加路由：

```javascript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue')
    },
    // 添加更多路由...
  ]
})

export default router
```

### 组合式函数

使用 `composables/` 目录下的可复用逻辑：

```javascript
import { useTheme } from '@/composables/useTheme'

// 在组件中使用
const { theme, toggleTheme } = useTheme()
```

## 🎨 设计系统

### 颜色

- **主色**: `#7C3AED` (紫色)
- **次色**: `#4F46E5` (深紫色)
- **强调色**: `#06B6D4` (青色)
- **成功色**: `#10B981` (绿色)
- **警告色**: `#F59E0B` (橙色)
- **错误色**: `#EF4444` (红色)

### 字体

- **标题**: Inter, system-ui, sans-serif
- **正文**: Inter, system-ui, sans-serif
- **代码**: 'Fira Code', monospace

### 间距

使用 Tailwind CSS 的间距系统：
- `p-4` = 1rem (16px)
- `m-4` = 1rem (16px)
- `gap-4` = 1rem (16px)

## 📄 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | Hero、服务介绍、内容预览 |
| `/about` | 关于页 | 个人介绍 |
| `/blog` | 博客列表 | 技术文章列表 |
| `/blog/:id` | 博客详情 | 单篇文章 |
| `/notes` | 笔记列表 | 学习笔记 |
| `/notes/:id` | 笔记详情 | 笔记详情 |
| `/docs` | 知识库 | Notion 同步文档 |
| `/services` | 服务页 | 服务介绍 |
| `/contact` | 联系页 | 联系方式 |
| `/shop` | 商店页 | 产品展示 |
| `*` | 404 页 | 页面未找到 |

## 🐛 问题排查

### 常见问题

1. **依赖安装失败**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Vite 启动失败**
   - 检查 Node.js 版本（>= 18.0.0）
   - 清除缓存：`npm cache clean --force`

3. **API 请求失败**
   - 确认环境变量配置正确
   - 检查 API 密钥是否有效
   - 查看浏览器控制台错误信息

4. **样式不生效**
   - 检查 Tailwind CSS 配置
   - 确认类名拼写正确
   - 清除浏览器缓存

## 📈 性能优化

- ⚡ Vite 快速构建和热重载
- 🎭 组件懒加载（路由级别代码分割）
- 📦 资源压缩和 Tree-shaking
- 🖼️ 图片优化和 WebP 格式支持
- 💾 浏览器缓存策略配置
- 🔄 自动部署和 CDN 分发

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 创建 Pull Request

## 📝 更新日志

查看 [CHANGELOG](./CHANGELOG.md) 了解项目更新历史。

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](./LICENSE) 文件

## 👥 作者

**CNCG Team**

- 网站：[https://cncg.me](https://cncg.me)
- 邮箱：contact@cncg.me

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Supabase](https://supabase.com/) - 开源 Firebase 替代方案
- [Notion](https://www.notion.so/) - 协作文档工具
- [Vercel](https://vercel.com/) - 前端云平台

---

**Made with ❤️ by CNCG Team**
