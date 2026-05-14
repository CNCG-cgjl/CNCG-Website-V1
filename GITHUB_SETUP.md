# CNNG Website - GitHub 仓库配置指南

> 📅 创建日期：2026-05-07
> 🎯 项目版本：v1.0.0（初始框架版）

---

## 📋 目录

1. [项目概述](#项目概述)
2. [GitHub 仓库创建步骤](#github-仓库创建步骤)
3. [本地 Git 配置](#本地-git-配置)
4. [推送到 GitHub](#推送到-github)
5. [Vercel 部署配置](#vercel-部署配置)
6. [环境变量配置](#环境变量配置)
7. [常见问题](#常见问题)

---

## 项目概述

### 项目信息
- **项目名称**: CNNG-Website-Production
- **项目描述**: CNCG 专业远程技术服务平台 - 生产版本网站
- **技术栈**: Vue 3 + Vite + Tailwind CSS 4 + Vue Router 4
- **Node 版本**: >= 18.0.0
- **包管理器**: npm

### 项目结构
```
CNNG-Website-Production/
├── public/                 # 静态资源
│   ├── favicon.svg        # 网站图标
│   ├── icons.svg          # SVG图标精灵
│   ├── robots.txt         # SEO爬虫规则
│   └── sitemap.xml        # SEO站点地图
├── src/                   # 源代码
│   ├── assets/           # 资源文件
│   ├── components/      # Vue组件
│   ├── composables/      # 组合式函数
│   ├── router/          # 路由配置
│   ├── views/           # 页面组件
│   ├── App.vue         # 根组件
│   ├── main.js         # 入口文件
│   └── style.css       # 全局样式
├── .env.example         # 环境变量示例
├── .gitignore           # Git忽略配置
├── index.html           # HTML模板
├── package.json         # 依赖配置
├── vite.config.js       # Vite配置
├── vercel.json          # Vercel配置
└── README.md            # 项目说明
```

---

## GitHub 仓库创建步骤

### 步骤 1: 登录 GitHub

访问 [https://github.com](https://github.com) 并登录您的账户。

### 步骤 2: 创建新仓库

1. 点击右上角的 **"+"** 按钮
2. 选择 **"New repository"**
3. 填写仓库信息：

```
Repository name: CNNG-Website-Production
Description: CNCG 专业远程技术服务平台 - 生产版本网站
Visibility: Public (公开) / Private (私有)
```

4. ⚠️ **不要勾选** "Add a README file"（我们已有README.md）
5. ⚠️ **不要勾选** "Add .gitignore"（我们已有.gitignore）
6. 选择 **None** 作为 License（可选）
7. 点击 **"Create repository"**

### 步骤 3: 复制仓库 URL

创建成功后，GitHub 会显示仓库页面，您会看到仓库 URL：

```
https://github.com/YOUR_USERNAME/CNNG-Website-Production.git
```

---

## 本地 Git 配置

### 检查 Git 状态

```bash
cd CNNG-Website-Production
git status
```

### 添加远程仓库

将 `YOUR_USERNAME` 替换为您的 GitHub 用户名：

```bash
git remote add origin https://github.com/YOUR_USERNAME/CNNG-Website-Production.git
```

### 验证远程仓库

```bash
git remote -v
```

应该显示：
```
origin  https://github.com/YOUR_USERNAME/CNNG-Website-Production.git (fetch)
origin  https://github.com/YOUR_USERNAME/CNNG-Website-Production.git (push)
```

### 分支重命名（推荐）

将主分支从 `master` 重命名为 `main`（符合现代GitHub规范）：

```bash
git branch -M main
```

---

## 推送到 GitHub

### 首次推送

```bash
git push -u origin main
```

这会：
- 将本地 `main` 分支推送到 GitHub
- 设置上游跟踪分支（以后可以直接用 `git push`）

### 推送成功确认

推送完成后，在浏览器中刷新您的 GitHub 仓库页面，应该能看到所有文件。

---

## Vercel 部署配置

### 在 Vercel 中导入仓库

1. 登录 [https://vercel.com](https://vercel.com)
2. 点击 **"Add New..."** → **"Project"**
3. 在 "Import Git Repository" 部分找到 `CNNG-Website-Production`
4. 点击 **"Import"**

### 配置项目

在项目配置页面设置：

```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 配置环境变量

在 "Environment Variables" 部分添加：

| Name | Value | Environments |
|------|-------|--------------|
| `VITE_NOTION_TOKEN` | 您的 Notion Integration Token | Production, Preview, Development |
| `VITE_NOTION_DATABASE_ID` | 您的 Notion Database ID | Production, Preview, Development |
| `VITE_SUPABASE_URL` | 您的 Supabase URL | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | 您的 Supabase Anon Key | Production, Preview, Development |

### 部署项目

点击 **"Deploy"**，等待构建完成（约1-2分钟）。

### 自定义域名（可选）

1. 进入项目 **Settings** → **Domains**
2. 添加您的域名（如 `cncg.me`）
3. 按照提示配置 DNS 记录
4. 等待 DNS 生效

---

## 环境变量配置

### 获取环境变量

#### Notion 配置
1. 访问 [Notion](https://www.notion.so)
2. 进入 **Settings** → **Connections** → **Develop or manage integrations**
3. 创建新的 Integration，复制 Token（格式：`sk_xxxxxxxx`）
4. 创建或选择一个 Database，获取 Database ID（URL中 `workspace/` 后的字符串）

#### Supabase 配置
1. 访问 [Supabase](https://supabase.com)
2. 进入您的项目 → **Settings** → **API**
3. 复制 **Project URL** 和 **anon public** key

### 本地开发环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入真实的值：
```env
VITE_NOTION_TOKEN=sk_your_notion_integration_token
VITE_NOTION_DATABASE_ID=your_database_id
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_URL=https://cncg.me
VITE_SITE_NAME=CNCG
VITE_SITE_DESC=专注网站开发、内容创作与数字化解决方案
```

⚠️ **重要**: `.env.local` 已加入 `.gitignore`，不会推送到 GitHub！

---

## 常见问题

### Q1: 推送被拒绝？

如果看到 "refusing to push" 错误，可能是因为：
- GitHub 仓库已有初始提交
- 分支名不匹配

**解决方案**：
```bash
# 使用强制推送（仅在确认安全时使用）
git push -u origin main --force

# 或者先拉取再推送
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Q2: 忘记添加远程仓库？

```bash
git remote add origin https://github.com/YOUR_USERNAME/CNNG-Website-Production.git
git push -u origin main
```

### Q3: 如何更新代码到 GitHub？

```bash
# 1. 查看修改
git status

# 2. 添加修改的文件
git add .

# 或添加特定文件
git add src/App.vue

# 3. 提交修改
git commit -m "描述您的修改"

# 4. 推送到 GitHub
git push
```

### Q4: 如何从 GitHub 拉取最新代码？

```bash
git pull origin main
```

### Q5: 分支操作

```bash
# 创建新分支
git checkout -b feature/your-feature

# 切换分支
git checkout main

# 查看所有分支
git branch -a

# 删除分支
git branch -d feature/your-feature
```

### Q6: GitHub 认证失败？

如果推送时提示需要认证：
1. 使用 Personal Access Token 替代密码
2. 或配置 SSH Key
3. 或使用 GitHub CLI (`gh auth login`)

---

## 🎉 后续步骤

1. ✅ 创建 GitHub 仓库
2. ✅ 推送代码到 GitHub
3. ✅ 在 Vercel 导入项目
4. ✅ 配置环境变量
5. ✅ 触发首次部署
6. ✅ 访问您的网站！

---

## 📞 技术支持

如果您在配置过程中遇到问题：

1. 查看 [项目架构文档](./Doc/项目架构.md)
2. 查看 [部署指南](./Doc/部署指南.md)
3. 查看 [设计系统文档](./Doc/设计系统.md)

---

**祝您部署顺利！ 🚀**
