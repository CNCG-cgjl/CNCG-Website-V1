# 飞书内容模板示例

> 📅 创建日期：2026-05-07
> 🎯 用途：快速创建飞书知识库和文档的参考模板

---

## 📚 知识库结构模板

### 01-技术文档

#### 📖 Vue 3 最佳实践

```markdown
# Vue 3 最佳实践

> 作者：CNCG
> 创建时间：2026-05-07
> 标签：Vue3, 前端, Composition API

## 概述

Vue 3 引入了 Composition API，为开发者提供了更灵活的代码组织方式。

## 核心概念

### 1. 组合式函数 (Composables)

组合式函数是 Vue 3 最重要的特性之一：

```javascript
// src/composables/useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue

  const doubled = computed(() => count.value * 2)

  return {
    count,
    increment,
    decrement,
    reset,
    doubled
  }
}
```

### 2. 响应式系统

Vue 3 的响应式系统基于 Proxy：

```javascript
import { reactive, ref, watch } from 'vue'

// reactive 用于对象
const state = reactive({
  name: 'CNCG',
  items: []
})

// ref 用于基本类型
const count = ref(0)

// 监听变化
watch(count, (newValue, oldValue) => {
  console.log(`count changed from ${oldValue} to ${newValue}`)
})
```

## 最佳实践

1. ✅ 使用 `<script setup>` 语法糖
2. ✅ 使用组合式函数复用逻辑
3. ✅ 合理拆分组件
4. ✅ 使用 TypeScript 获得更好的类型提示
5. ❌ 避免在模板中使用复杂计算

## 相关资源

- [Vue 3 官方文档](https://vuejs.org/)
- [VueUse - 组合式工具库](https://vueuse.org/)

---

## 总结

Vue 3 的 Composition API 提供了更强大的代码组织和复用能力，值得深入学习。
```

---

#### 📖 Vite 性能优化

```markdown
# Vite 性能优化实战

> 作者：CNCG
> 创建时间：2026-05-07
> 标签：Vite, 构建工具, 性能优化

## 为什么选择 Vite？

Vite 提供了极快的开发体验：
- ⚡ 极速冷启动
- 🔥 热模块替换 (HMR)
- 📦 优化的生产构建

## 开发环境优化

### 1. 依赖预构建

Vite 会自动对依赖进行预构建：

```javascript
// vite.config.js
export default defineConfig({
  optimizeDeps: {
    include: ['vue', 'vue-router', 'lodash']
  }
})
```

### 2. 并行构建

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'utils': ['lodash', 'axios']
        }
      }
    }
  }
})
```

## 生产环境优化

### 1. 代码分割

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  }
})
```

### 2. 资源内联

```html
<!-- 小于 4KB 的资源内联 -->
<img src="data:image/svg+xml,..." />
```

### 3. 压缩

```javascript
import terser from '@rollup/plugin-terser'
import gzipPlugin from 'rollup-plugin-gzip'

export default defineConfig({
  plugins: [
    vue(),
    terser(),
    gzipPlugin()
  ]
})
```

## 监控与测量

使用 Lighthouse 测量性能：

```bash
npm install -g lighthouse
lighthouse https://your-site.com --view
```

---

## 总结

Vite 的性能优化主要从以下方面入手：
1. 依赖预构建
2. 代码分割
3. 资源压缩
4. 懒加载
```

---

### 📖 Tailwind CSS 设计系统

```markdown
# Tailwind CSS 设计系统

> 作者：CNCG
> 创建时间：2026-05-07
> 标签：Tailwind CSS, CSS, 设计系统

## 设计原则

1. **移动优先**：从最小屏幕开始，逐步增强
2. **响应式设计**：使用断点前缀（sm, md, lg, xl, 2xl）
3. **暗色模式**：使用 `dark:` 前缀

## 颜色系统

### 主色调

```css
/* tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // 主色
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        }
      }
    }
  }
}
```

### 使用方式

```html
<button class="bg-primary-500 hover:bg-primary-600 text-white">
  Primary Button
</button>
```

## 字体系统

```css
theme: {
  extend: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    }
  }
}
```

## 间距系统

使用 4px 基准网格：
- `p-4` = 1rem (16px)
- `m-4` = 1rem (16px)
- `gap-4` = 1rem (16px)

## 阴影系统

```css
theme: {
  extend: {
    boxShadow: {
      'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07)',
      'hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    }
  }
}
```

## 动画系统

```css
theme: {
  extend: {
    animation: {
      'fade-in': 'fadeIn 0.5s ease-in-out',
      'slide-up': 'slideUp 0.3s ease-out',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      slideUp: {
        '0%': { transform: 'translateY(10px)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
    }
  }
}
```

---

## 使用示例

```html
<!-- 卡片组件 -->
<div class="bg-white rounded-lg shadow-soft hover:shadow-hover transition-shadow p-6">
  <h3 class="text-xl font-semibold text-gray-800 mb-2">
    卡片标题
  </h3>
  <p class="text-gray-600">
    这是卡片内容描述文字。
  </p>
</div>
```

---

## 最佳实践

1. ✅ 使用工具类组合而非自定义 CSS
2. ✅ 使用 `@apply` 提取重复样式
3. ✅ 使用 CSS 变量实现主题切换
4. ❌ 避免过深的嵌套
5. ❌ 不要滥用 `!important`
```

---

### 📖 Git 工作流

```markdown
# Git 工作流最佳实践

> 作者：CNCG
> 创建时间：2026-05-07
> 标签：Git, 版本控制, 开发流程

## 分支策略

### Git Flow

```
main (生产环境)
  └── develop (开发分支)
        ├── feature/xxx (功能分支)
        ├── release/xxx (发布分支)
        └── hotfix/xxx (热修复分支)
```

### 简化版：GitHub Flow

```
main (主分支，随时可部署)
  └── feature/xxx (功能分支)
```

## 提交规范

### Commit Message 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- ✨ `feat`: 新功能
- 🐛 `fix`: 修复 bug
- 📝 `docs`: 文档更新
- 🎨 `style`: 代码格式（不影响功能）
- ♻️ `refactor`: 重构
- ⚡ `perf`: 性能优化
- ✅ `test`: 测试
- 🔧 `chore`: 构建或辅助工具

### 示例

```
feat(auth): 添加用户登录功能

- 实现用户名密码登录
- 添加 Token 刷新机制
- 集成第三方登录（微信）

Closes #123
```

## 常用命令

```bash
# 创建并切换分支
git checkout -b feature/user-auth

# 暂存修改
git add .
git commit -m "feat: 添加用户认证"

# 拉取最新代码
git pull origin main

# 推送分支
git push -u origin feature/user-auth

# 合并分支
git checkout main
git merge feature/user-auth
```

## 冲突解决

```bash
# 1. 更新本地 main
git checkout main
git pull origin main

# 2. 合并 feature 分支
git merge feature/user-auth

# 3. 解决冲突后
git add .
git commit -m "merge: 解决合并冲突"

# 4. 推送
git push origin main
```

---

## 最佳实践

1. ✅ 频繁提交，小步提交
2. ✅ 提交前先拉取最新代码
3. ✅ 写清楚提交信息
4. ✅ 合并前进行代码审查
5. ❌ 不要直接修改 main 分支
6. ❌ 不要提交敏感信息
```

---

### 📖 Docker 容器化

```markdown
# Docker 容器化实践

> 作者：CNCG
> 创建时间：2026-05-07
> 标签：Docker, 容器化, DevOps

## 什么是 Docker？

Docker 是一个开源的容器化平台，允许开发者将应用及其依赖打包成容器。

## 核心概念

### 镜像 (Image)

镜像是一个只读模板，用于创建容器。

```dockerfile
# 示例：Node.js 应用
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
```

### 容器 (Container)

容器是镜像的运行实例。

```bash
# 构建镜像
docker build -t my-app .

# 运行容器
docker run -d -p 3000:3000 --name my-app my-app

# 查看运行中的容器
docker ps

# 停止容器
docker stop my-app

# 删除容器
docker rm my-app
```

### Dockerfile 最佳实践

```dockerfile
# 1. 使用多阶段构建减小体积
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2. 生产镜像使用轻量基础镜像
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]

# 3. 使用 .dockerignore
```

## Docker Compose

用于定义多容器应用：

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://db:5432/myapp
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:14-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=secret

volumes:
  postgres_data:
```

## 常用命令

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止所有服务
docker-compose down

# 重新构建镜像
docker-compose up -d --build

# 进入容器
docker exec -it my-app sh
```

---

## 应用场景

### 1. 本地开发环境

```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  app:
    build:
      context: .
      target: development
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    command: npm run dev
```

### 2. CI/CD 集成

```yaml
# .github/workflows/docker.yml
name: Docker Build

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_TOKEN }}
          push: true
          tags: myapp:latest
```

---

## 总结

Docker 简化了应用的部署和扩展，是现代 DevOps 的重要工具。

**关键点**：
1. 使用多阶段构建减小镜像体积
2. 使用 .dockerignore 排除不需要的文件
3. 使用 Docker Compose 编排多容器应用
4. 生产环境使用 Docker Swarm 或 Kubernetes
```

---

## 📝 文档元信息模板

每个文档开头建议包含以下元信息：

```markdown
---
title: 文档标题
description: 文档简短描述
author: CNCG
created: 2026-05-07
updated: 2026-05-07
tags: [标签1, 标签2, 标签3]
category: 技术文档
cover: /images/cover.jpg
difficulty: 中级
readingTime: 10分钟
---
```

---

## 💡 使用技巧

### 1. 使用模板快速创建

在飞书中创建模板文档，然后每次创建新文档时基于模板复制。

### 2. 利用多维表格管理

创建多维表格来管理文档元信息：

| 文档名称 | 分类 | 标签 | 状态 | 创建时间 |
|---------|------|------|------|---------|
| Vue3最佳实践 | 技术文档 | Vue3 | 已发布 | 2026-05-07 |
| Vite优化 | 技术文档 | Vite | 草稿 | 2026-05-07 |

### 3. 使用双向链接

飞书支持双向链接，可以建立知识网络：

```markdown
参见：[[Vue 3 最佳实践]]

相关文档：
- [[Vite 性能优化]]
- [[Tailwind CSS 设计系统]]
```

### 4. 定期整理

建议每月整理一次知识库：
- 归档旧文档
- 更新过时内容
- 删除无用文档
- 补充新内容

---

## 📥 导入导出

### 导出为 Markdown

飞书支持导出为多种格式，包括 Markdown。

### 批量导入

可以使用飞书开放 API 批量创建文档：

```javascript
const createDocument = async (title, content) => {
  const token = await getAccessToken()

  const response = await fetch('https://open.feishu.cn/open-apis/docx/v1/documents', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title
    })
  })

  return await response.json()
}
```

---

**希望这些模板对您有帮助！** 🚀
