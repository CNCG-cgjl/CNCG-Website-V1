# 首页笔记显示修复说明

## 问题描述

首页的"最新笔记"区域显示为空，即使笔记页面（`/note`）有笔记内容。

## 问题原因

`ContentPreview.vue` 组件中的 `notes` 数组初始化为空数组，但没有加载本地笔记的逻辑：

```javascript
const notes = ref([])  // 空数组，没有加载逻辑
```

## 修复方案

### 1. 导入笔记工具函数

```javascript
import { getAllNotes } from '@/utils/notes.js'
```

### 2. 在 onMounted 中加载笔记

```javascript
onMounted(async () => {
  // 加载本地笔记
  try {
    const allNotes = getAllNotes()
    // 只显示最新的 4 篇笔记
    notes.value = allNotes.slice(0, 4).map(note => ({
      id: note.slug,
      slug: note.slug,
      title: note.title,
      date: note.dateLabel,
      tag: note.tags[0] || '笔记'
    }))
  } catch (error) {
    console.error('Failed to load notes:', error)
    notes.value = []
  }

  // ... 知识库加载逻辑
})
```

## 修改文件

- `src/components/home/ContentPreview.vue`

## 验证方法

1. 访问首页：`http://localhost:5174/`
2. 滚动到"最新笔记"区域
3. 应该能看到笔记列表，包括：
   - 笔记标题："网站第一篇笔记"
   - 日期："2026/05/18"
   - 标签："随笔"

## 笔记数据来源

笔记数据来自 `src/content/notes/` 目录下的 Markdown 文件：

```
src/content/notes/
└── 2026.5.18-第一篇笔记.md
```

## 笔记文件格式

每个笔记文件需要包含 frontmatter 元数据：

```markdown
---
title: 网站第一篇笔记
date: 2026-05-18
tags: 随笔, 建站记录
summary: 记录这个个人网站从最初想法、反复推倒，到逐渐成型的过程。
---

# 笔记内容...
```

## 显示逻辑

- 首页显示最新的 **4 篇**笔记
- 按日期倒序排列（最新的在前）
- 每个笔记卡片显示：
  - 标题
  - 日期
  - 第一个标签

## 添加更多笔记

要添加更多笔记，只需在 `src/content/notes/` 目录下创建新的 `.md` 文件：

```markdown
---
title: 第二篇笔记
date: 2026-05-20
tags: 技术, Vue
summary: 关于 Vue 3 的学习笔记
---

# 内容...
```

文件会自动被 `notes.js` 工具函数读取和解析。

## 相关文件

- `src/components/home/ContentPreview.vue` - 首页内容预览组件
- `src/utils/notes.js` - 笔记工具函数
- `src/content/notes/` - 笔记文件目录
- `src/views/NotePage.vue` - 笔记列表页
- `src/views/NoteDetailPage.vue` - 笔记详情页

## 测试结果

✅ 笔记加载成功  
✅ 首页显示正常  
✅ 点击笔记可跳转到详情页  
✅ 热更新正常工作

---

**修复日期**：2026-05-20  
**修复者**：Kiro AI
