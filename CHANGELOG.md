# Changelog

## [1.1.0] - 2026-05-21

### 架构

- 移除站内 `/note` 模块与本地 Markdown 构建；内容单源飞书 Wiki → `/doc`
- `/note`、`/note/*` 路由重定向至 `/doc`
- 评论 `page_id` 严格 ASCII；支持 `doc-{obj_token}`；通知链接修正

### 移动端与体验（P0）

- 全局 `container` safe-area 与防贴边；禁止整页横向滚动
- 移动菜单遮罩 + iOS 滚动锁定
- 首页「立即咨询」→ `/contact`；Hero 标签横向滚动
- 知识库弹窗小屏近全屏；飞书正文表格/长链防溢出
- 联系页 QQ 改为复制号；深色模式卡片对比度优化

### 工程

- GitHub Actions `ci.yml`（构建 + dist 校验）
- `deploy-vps.yml`（releases 目录 + symlink，需 Secrets）
- 本地脚本：`release:pack`、`release:upload`、`backup-full-project.ps1`

### 待定（v1.2+）

- 站点内容定位 / IA（商店 vs 知识库）
- 知识库阅读弹窗评论 UI
- `/doc?q=` 搜索筛选
- 飞书 Wiki 多层子节点索引
