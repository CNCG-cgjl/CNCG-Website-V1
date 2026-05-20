# 飞书集成配置指南

## 📋 概述

本文档介绍如何将飞书云文档集成到网站，用于笔记和知识库功能。

---

## 🚀 快速开始

### 步骤1：创建飞书应用

1. 访问 [飞书开放平台](https://open.feishu.cn/)
2. 点击「创建企业自建应用」
3. 填写应用信息：
   - 应用名称：CNCG Website
   - 应用描述：网站内容数据源
4. 创建后进入应用详情页

### 步骤2：获取凭证

在「凭证与基础信息」页面获取：
- `App ID`: `cli_xxxxxxxxxxxxxxxx`
- `App Secret`: `xxxxxxxxxxxxxxxxxxxxxxxx`

### 步骤3：配置权限

在「权限管理」中添加以下权限：

| 权限名称 | 权限标识 | 说明 |
|---------|---------|------|
| 获取文档内容 | docx:document:readonly | 读取文档内容 |
| 获取文档列表 | docx:document:readonly | 获取知识库文档列表 |
| 查看评论 | docx:comment:readonly | 读取文档评论 |

### 步骤4：发布应用

1. 点击「版本管理与发布」
2. 创建版本并发布
3. 需要管理员审批（如果是自建应用可能不需要）

---

## 🔧 环境变量配置

在 `.env` 文件中添加：

```bash
# 飞书应用凭证
VITE_FEISHU_APP_ID=cli_xxxxxxxxxxxxxxxx
VITE_FEISHU_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# 笔记知识库 ID
VITE_FEISHU_NOTE_FOLDER_ID=xxxxxxxxxxxxxxxx

# 博客知识库 ID
VITE_FEISHU_BLOG_FOLDER_ID=xxxxxxxxxxxxxxxx
```

---

## 📁 飞书知识库结构

### 建议的文件夹结构

```
CNCG 网站内容/
├── 📝 笔记/
│   ├── 2026-05-08-我的第一篇笔记
│   ├── 2026-05-09-Git使用技巧
│   └── ...
└── 📚 博客/
    ├── Vue3 Composition API 入门
    ├── Git 常用命令速查
    └── ...
```

---

## 🔌 API 接口说明

### 获取 tenant_access_token

```javascript
POST https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal

{
  "app_id": "cli_xxx",
  "app_secret": "xxx"
}
```

### 获取文件夹下的文档列表

```javascript
GET https://open.feishu.cn/open-apis/drive/v1/files?folder_token={folder_token}
Authorization: Bearer {tenant_access_token}
```

### 获取文档内容

```javascript
GET https://open.feishu.cn/open-apis/docx/v1/documents/{document_id}
Authorization: Bearer {tenant_access_token}
```

---

## 🎨 渲染组件

已创建 `FeishuRenderer.vue` 组件，支持渲染飞书 Block 格式：

- 标题（H1-H6）
- 段落
- 列表（有序、无序、任务列表）
- 代码块
- 引用
- 表格
- 图片
- 链接

---

## 📝 字段映射

### 文档元数据

| 飞书字段 | 网站字段 | 说明 |
|---------|---------|------|
| document_id | slug | 文档ID作为URL标识 |
| title | title | 文档标题 |
| update_time | date | 最后更新时间 |
| create_time | created | 创建时间 |

### 内容块类型

| 飞书Block类型 | 渲染方式 |
|--------------|---------|
| paragraph | `<p>` |
| heading1-6 | `<h1>` - `<h6>` |
| bullet | `<ul><li>` |
| ordered | `<ol><li>` |
| code | `<pre><code>` |
| quote | `<blockquote>` |
| table | `<table>` |
| image | `<img>` |

---

## 🔒 安全说明

### 前端安全

- ✅ App Secret 不暴露在前端（使用后端代理或服务端渲染）
- ✅ 仅使用公开/已授权的文档
- ⚠️ 建议添加访问控制

### 建议的生产环境架构

```bash
用户浏览器
    ↓ HTTPS
网站前端（仅读取）
    ↓
后端服务（持有飞书凭证）
    ↓
飞书开放平台 API
```

---

## 🐛 常见问题

### Q: 获取 token 失败？

A: 检查：
1. App ID 和 App Secret 是否正确
2. 应用是否已发布
3. 权限是否已添加

### Q: 文档内容获取不到？

A: 检查：
1. 文档是否在正确的文件夹下
2. 是否有文档读取权限
3. 文档是否为飞书文档（非旧版文档）

### Q: 图片不显示？

A: 飞书图片需要通过专门的接口获取临时链接。

---

## 📚 相关资源

- [飞书开放平台文档](https://open.feishu.cn/document/home/introduction-to-developing-an-application-in-feishu)
- [docx API 文档](https://open.feishu.cn/document/server-docs/docs/docs/docx-v1/document/get)
- [飞书Block类型](https://open.feishu.cn/document/server-docs/docs/docs/docx-v1/document-content-block/overview)

---

**更新时间**: 2026-05-08

---

## Contact Form Bitable Setup

The contact form writes directly to a Feishu Bitable table through the server API in `api/contact.js`.

Required environment variables:

```env
FEISHU_APP_ID=
FEISHU_APP_SECRET=
FEISHU_WEBHOOK_URL=
FEISHU_WEBHOOK_SECRET=
FEISHU_BITABLE_APP_TOKEN=
FEISHU_BITABLE_TABLE_ID=
QMSG_KEY=
```

Recommended checks when wiring the contact form:

1. Open the Feishu Open Platform app and enable scopes:
   - `bitable:app`
   - `base:record:create`
2. Publish the updated app permissions.
3. In the target Bitable document, use `添加文档应用` and add this app with edit access.
4. Confirm `FEISHU_BITABLE_TABLE_ID` uses the `table=tbl...` value from the URL, not `view=vew...`.
5. Build the Bitable columns horizontally, not as row content.

Expected Bitable columns for the current contact form:

- `姓名`
- `邮箱`
- `主题`
- `留言内容`
- `提交时间`
- `处理状态`

Common failures seen during local setup:

- `99991672`: missing app scopes
- `91403 Forbidden`: app not added to the document as a document app
- `TableIdNotFound`: wrong `FEISHU_BITABLE_TABLE_ID`
- `FieldNameNotFound`: columns were missing, misnamed, or created as rows instead of fields

After changing `.env.local`, restart the dev server before testing again.
