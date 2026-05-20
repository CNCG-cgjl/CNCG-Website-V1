# 🤖 飞书机器人 Webhook 配置指南

**Last Updated**: 2026-05-20  
**Purpose**: 将网站的评论/留言通知推送到飞书群组

---

## 📋 概述

通过配置飞书机器人 Webhook，你可以：

✅ 当用户提交评论时，机器人自动推送到飞书群  
✅ 群里的人可以直接点链接查看内容  
✅ 管理员可以在群里快速审核和批准  
✅ 实时接收新提交的通知  

---

## 🚀 快速开始（5 分钟）

### 第 1 步：在飞书群里添加机器人

1. **打开飞书群聊**
   - 找到你想接收通知的群组

2. **点击群设置**
   - 右上角 "..." → "群设置"
   - 或者直接点群名称

3. **添加机器人**
   - 找到 "添加机器人" 或 "Bot" 选项
   - 搜索 "自定义机器人" 或 "Custom Bot"
   - 点击 "添加"

4. **获取 Webhook URL**
   - 机器人会生成一个 Webhook URL
   - 格式：`https://open.feishu.cn/open-apis/bot/v2/hook/[TOKEN]`
   - **复制这个 URL**

### 第 2 步：配置环境变量

在 `.env.local` 中添加：

```env
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/[你的TOKEN]
FEISHU_WEBHOOK_SECRET=（如果启用了签名验证，填入密钥）
```

### 第 3 步：测试

提交一条测试评论，检查是否收到飞书通知。

---

## 📖 详细步骤

### 方法 A：使用飞书内置机器人（推荐）

#### 1. 打开飞书群聊

```
飞书 App → 找到你的群组 → 打开
```

#### 2. 进入群设置

```
点击群名称 → 群设置 → 机器人
```

或者：

```
右上角 "..." → 群设置 → 机器人
```

#### 3. 添加自定义机器人

```
点击 "添加机器人" 或 "+" 按钮
选择 "自定义机器人"
点击 "创建"
```

#### 4. 配置机器人

- **机器人名称**：CNCG 网站通知
- **描述**：接收网站评论和留言通知
- **权限**：选择 "发送消息"

#### 5. 获取 Webhook URL

```
机器人创建后，会显示 Webhook URL
格式：https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxxxxxxxxxx
```

**复制这个 URL**

#### 6. 配置签名验证（可选但推荐）

```
如果启用了 "签名验证"：
- 会生成一个 Secret
- 复制 Secret 值
```

---

### 方法 B：使用飞书开放平台创建机器人

如果你想要更多功能和控制：

#### 1. 打开飞书开放平台

```
https://open.feishu.cn/
```

#### 2. 创建应用

```
点击 "创建应用"
选择 "机器人"
填写应用信息
```

#### 3. 配置权限

```
需要的权限：
- im:message:create_personal_message
- im:message:create_group_message
```

#### 4. 获取 Webhook URL

```
在应用设置中找到 "Webhook URL"
复制 URL
```

---

## 🔧 环境变量配置

### 基础配置

```env
# 必需
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxxxxxxxxxx

# 可选（如果启用了签名验证）
FEISHU_WEBHOOK_SECRET=your_secret_key_here
```

### 完整配置示例

```env
# 飞书机器人 Webhook（用于群通知）
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# 飞书机器人签名密钥（可选）
FEISHU_WEBHOOK_SECRET=secret_key_12345678

# 其他飞书配置
FEISHU_APP_ID=cli_aa8c5ed786b41bd4
FEISHU_APP_SECRET=yyM7D2YBuN0Pq57YS07TNfawYHtRUJbH
FEISHU_WIKI_TOKEN=SPpmwNv5TibrNNkG6Onc4cjPnAF
FEISHU_BITABLE_APP_TOKEN=UR3pwtjiii4rGrkHIpfcS1zpnkl
FEISHU_BITABLE_TABLE_ID=tblhOs1D8ESPeroU
```

---

## 📤 通知格式

当用户提交评论或留言时，机器人会发送这样的消息：

### 评论通知

```
【新评论】
作者: 张三
内容: 这个网站很不错！
页面: note-my-first-note
状态: 待审核
链接: https://cncg.me/note/my-first-note

👉 点击链接查看完整内容
```

### 留言通知

```
【新留言】
作者: 李四
内容: 很喜欢你的工作！
状态: 待审核

👉 点击链接查看完整内容
```

---

## 🔐 安全性

### 签名验证

如果启用了签名验证：

1. **获取 Secret**
   - 在机器人设置中找到 Secret
   - 复制到 `FEISHU_WEBHOOK_SECRET`

2. **验证流程**
   - 飞书会在请求头中发送签名
   - 服务器验证签名的有效性
   - 防止未授权的请求

### 最佳实践

✅ **启用签名验证** - 增加安全性  
✅ **限制机器人权限** - 只给必要的权限  
✅ **定期检查日志** - 监控异常活动  
✅ **保护 Webhook URL** - 不要公开分享  
✅ **使用 HTTPS** - 所有通信都加密  

---

## 🧪 测试

### 本地测试

1. **设置环境变量**
   ```env
   FEISHU_WEBHOOK_URL=your_webhook_url
   ```

2. **提交测试评论**
   ```
   访问 http://localhost:5174
   提交一条测试评论
   ```

3. **检查飞书群**
   ```
   应该收到机器人的通知消息
   ```

### 生产测试

1. **部署到 Vercel**
   ```
   设置 FEISHU_WEBHOOK_URL 环境变量
   部署代码
   ```

2. **提交测试内容**
   ```
   访问 https://cncg.me
   提交评论或留言
   ```

3. **验证通知**
   ```
   检查飞书群是否收到通知
   ```

---

## 🐛 故障排除

### 问题 1：没有收到通知

**可能原因**：
- Webhook URL 配置错误
- 机器人没有发送消息权限
- 网络连接问题

**解决方案**：
1. 检查 `FEISHU_WEBHOOK_URL` 是否正确
2. 验证机器人权限设置
3. 检查服务器日志

### 问题 2：收到错误消息

**可能原因**：
- 签名验证失败
- 消息格式不正确
- 机器人被禁用

**解决方案**：
1. 检查 `FEISHU_WEBHOOK_SECRET` 是否正确
2. 查看飞书机器人日志
3. 重新启用机器人

### 问题 3：消息格式不对

**可能原因**：
- 飞书 API 版本不同
- 消息字段不支持

**解决方案**：
1. 查看飞书 API 文档
2. 更新消息格式
3. 测试不同的字段组合

---

## 📚 相关文档

- [飞书开放平台](https://open.feishu.cn/)
- [飞书机器人文档](https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot)
- [Webhook 文档](https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot)

---

## 💡 使用场景

### 场景 1：实时通知

```
用户提交评论 → 机器人立即推送到群 → 管理员看到通知
```

### 场景 2：群里审核

```
机器人推送通知 → 管理员在群里点链接 → 查看完整内容 → 在 Supabase 批准
```

### 场景 3：团队协作

```
多个管理员在群里 → 看到新提交 → 讨论是否批准 → 统一决策
```

---

## ✨ 高级配置

### 多个群组通知

如果你想向多个群组发送通知：

```env
# 群组 1
FEISHU_WEBHOOK_URL_GROUP1=https://open.feishu.cn/open-apis/bot/v2/hook/xxx

# 群组 2
FEISHU_WEBHOOK_URL_GROUP2=https://open.feishu.cn/open-apis/bot/v2/hook/yyy

# 群组 3
FEISHU_WEBHOOK_URL_GROUP3=https://open.feishu.cn/open-apis/bot/v2/hook/zzz
```

然后在代码中循环发送。

### 自定义消息模板

你可以自定义通知消息的格式：

```javascript
// 在 api/lib/notify.js 中修改
const message = {
  msg_type: "text",
  content: {
    text: `【新评论】\n作者: ${author}\n内容: ${content}\n...`
  }
}
```

---

## 🎯 总结

| 步骤 | 说明 |
|------|------|
| 1 | 在飞书群里添加机器人 |
| 2 | 获取 Webhook URL |
| 3 | 配置 `.env.local` |
| 4 | 测试通知 |
| 5 | 部署到生产环境 |

---

**Last Updated**: 2026-05-20  
**Maintained By**: CNCG Team
