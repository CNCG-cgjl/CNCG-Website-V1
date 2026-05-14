# 项目状态报告

> 📅 创建日期：2026-05-07
> 📅 最后更新：2026-05-14
> 📊 版本：v2.0.0
> 🎯 状态：✅ 安全修复完成 + Supabase 评论/留言集成

---

## 📋 v2.0.0 更新日志（2026-05-14）

### 🔴 安全修复（P0）

| 问题 | 修复方案 |
|------|---------|
| 飞书 App Secret 前端暴露（VITE_ 前缀） | 创建 Vercel Serverless Function 后端代理 |
| Notion Token 前端暴露 | 同上，移除 Notion 改用飞书统一管理 |
| GitHub Token 前端暴露 | 移除 VITE_ 前缀，改为后端变量 |
| FeishuRenderer.vue XSS 风险（v-html 未消毒） | 创建 sanitize.js，所有文本 escapeHtml + escapeAttr |
| FeishuDocViewer.vue XSS 风险 | 改用 FeishuRenderer 组件渲染 |
| FeishuTestPage.vue XSS 风险 | 改用 FeishuRenderer 组件渲染 |
| 联系表单 Webhook URL 前端暴露 | 创建 api/contact.js 后端代理 + 输入验证 |
| 飞书图片 internal-api 域名不可访问 | 后端图片代理 /api/feishu?action=image |

### 🟠 架构优化（P1）

| 变更 | 说明 |
|------|------|
| 统一飞书 API 封装 | 新建 feishuProxy.js，useFeishu.js 改为调用代理 |
| 移除 Notion 依赖 | 删除 useNotion.js / notionProxy.js / api/notion.js，全站改用飞书 |
| 飞书图片代理 | 通过后端获取飞书图片二进制数据并转发，解决 CORS 和认证问题 |

### 🟢 新功能

| 功能 | 说明 |
|------|------|
| Supabase 评论系统 | CommentSection + CommentItem 组件，支持嵌套回复、审核机制 |
| Supabase 留言板 | GuestbookSection 组件，卡片式留言展示 |
| 评论集成 | NoteDetailPage / BlogDetailPage 底部 |
| 留言集成 | ContactPage 底部 |

### 📝 其他修复

| 修复 | 说明 |
|------|------|
| index.html Twitter meta 标签 | `@cncg_dev` → `content="@cncg_dev"` |
| FeishuTestPage 硬编码 App ID | 移除，改为提示在 Vercel 配置 |
| vercel.json 环境变量 | 补全飞书/QQ Webhook 映射，移除 Notion |
| .env.example | 区分前端/后端变量，移除 VITE_ 前缀密钥 |
| 全站 Notion → 飞书 | HeroSection/ServicesSection/ContentPreview/ServicesPage/AboutPage/index.html |

---

## 📁 项目文件结构（v2.0.0）

```
CNNG-Website-Production/
├── 📄 配置文件
│   ├── .env.example
│   ├── .env.local                # 本地环境变量（不提交）
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── 🔌 API 后端代理（Vercel Serverless Functions）
│   ├── api/feishu.js             # 飞书 API 代理（Token/文档/知识库/图片）
│   ├── api/contact.js            # 联系表单 Webhook 代理
│   └── (api/notion.js 已删除)
│
├── 🌐 源代码
│   ├── src/
│   │   ├── lib/
│   │   │   └── supabase.js       # Supabase 客户端初始化
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── CommentSection.vue  # 评论组件
│   │   │   │   ├── CommentItem.vue     # 单条评论
│   │   │   │   ├── GuestbookSection.vue # 留言板组件
│   │   │   │   ├── FeishuDocViewer.vue  # 飞书文档查看器（已修复XSS）
│   │   │   │   ├── Logo.vue
│   │   │   │   └── SplashScreen.vue
│   │   │   ├── FeishuRenderer.vue      # 飞书内容渲染器（已修复XSS）
│   │   │   ├── home/
│   │   │   │   ├── HeroSection.vue
│   │   │   │   ├── ServicesSection.vue
│   │   │   │   └── ContentPreview.vue
│   │   │   └── layout/
│   │   │       ├── MainHeader.vue
│   │   │       └── MainFooter.vue
│   │   ├── composables/
│   │   │   ├── useComments.js     # 评论 API
│   │   │   ├── useGuestbook.js    # 留言 API
│   │   │   ├── useFeishu.js       # 飞书 API（已改为代理）
│   │   │   ├── useIntersectionObserver.js
│   │   │   └── useTheme.js
│   │   ├── utils/
│   │   │   ├── feishuProxy.js     # 飞书前端代理
│   │   │   ├── feishuApi.js       # 旧版飞书API（待清理）
│   │   │   └── sanitize.js        # HTML 转义/消毒工具
│   │   ├── views/
│   │   │   ├── HomePage.vue
│   │   │   ├── AboutPage.vue
│   │   │   ├── BlogPage.vue
│   │   │   ├── BlogDetailPage.vue  # 已集成评论
│   │   │   ├── NotePage.vue
│   │   │   ├── NoteDetailPage.vue  # 已集成评论
│   │   │   ├── DocPage.vue
│   │   │   ├── ServicesPage.vue
│   │   │   ├── ContactPage.vue     # 已集成留言板
│   │   │   ├── ShopPage.vue
│   │   │   ├── FeishuTestPage.vue  # 已修复XSS
│   │   │   └── NotFoundPage.vue
│   │   ├── router/index.js
│   │   ├── App.vue
│   │   ├── main.js
│   │   └── style.css
│   ├── public/
│   └── index.html
```

---

## 🔧 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.5.32 | 前端框架 |
| Vite | ^8.0.10 | 构建工具 |
| Tailwind CSS | ^4.2.4 | 样式框架 |
| Vue Router | ^4.6.4 | 路由管理 |
| Supabase JS | ^2.49.8 | 评论/留言数据库 |
| 飞书 API | v1 | 内容管理（后端代理） |
| Vercel | - | 部署平台 + Serverless Functions |

---

## 🗄️ Supabase 数据库

### comments 表

| 列名 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| page_id | TEXT | 页面标识（如 note-slug, blog-slug） |
| author_name | TEXT | 昵称 |
| author_email | TEXT | 邮箱（不公开） |
| content | TEXT | 评论内容 |
| parent_id | UUID | 父评论ID（嵌套回复） |
| is_approved | BOOLEAN | 审核状态 |
| created_at | TIMESTAMPTZ | 创建时间 |

### guestbook 表

| 列名 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| author_name | TEXT | 昵称 |
| content | TEXT | 留言内容 |
| is_approved | BOOLEAN | 审核状态 |
| created_at | TIMESTAMPTZ | 创建时间 |

### RLS 策略

- 匿名用户可读取 `is_approved = true` 的记录
- 匿名用户可插入新记录（默认 `is_approved = false`）

---

## 🎯 下一步工作计划

### Phase 1: 基础功能 ✅

- [x] 创建 GitHub 仓库
- [x] 配置飞书开放平台
- [x] 测试飞书 API
- [x] 安全漏洞修复
- [x] 后端 API 代理
- [x] Supabase 评论/留言集成

### Phase 2: 内容展示 🚧

- [ ] 完善 DocPage（知识库页面）
- [ ] 完善 NoteDetailPage（笔记详情）
- [ ] 完善 BlogDetailPage（博客详情）
- [ ] 完善 AboutPage（关于页面）
- [ ] 完善 ShopPage（商店页面）

### Phase 3: 优化和完善 🎨

- [ ] 清理旧版 feishuApi.js
- [ ] 移动端系统性适配审查
- [ ] 暗色模式配色重做
- [ ] 图片优化（懒加载/图床迁移）
- [ ] Lighthouse 性能评分优化
- [ ] 配置自定义域名 cncg.me

---

## 🚨 安全注意事项

1. **.env.local**：包含敏感信息，已加入 .gitignore，**永远不要提交**
2. **App Secret**：仅存储在后端环境变量中，前端不可见
3. **Supabase anon key**：设计为公开的客户端密钥，RLS 策略保护数据安全
4. **评论/留言审核**：新内容默认 `is_approved = false`，需在 Supabase Dashboard 审核

---

**最后更新**：2026-05-14
**维护者**：CNCG Team
**版本**：v2.0.0