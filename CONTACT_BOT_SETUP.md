# 联系表单机器人推送配置指南

## 📋 概述

本功能可以将网站联系表单的提交实时推送到你的QQ或企业微信，让你随时随地收到访客咨询。

---

## 🚀 快速开始

### 步骤1：配置环境变量

编辑项目根目录下的 `.env` 文件：

```bash
# QQ机器人 Webhook 地址
VITE_QQ_BOT_WEBHOOK=https://your-qq-bot-webhook-url

# 企业微信机器人 Webhook 地址（可选）
VITE_WECOM_BOT_WEBHOOK=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxxx
```

### 步骤2：获取机器人地址

#### 方案一：酷推QQ机器人（推荐）

1. 访问 [酷推官网](https://cpuid.top/)
2. 注册并登录账号
3. 创建机器人
4. 复制Webhook地址

#### 方案二：企业微信机器人

1. 打开企业微信
2. 创建或选择一个群聊
3. 点击群设置 → 群机器人 → 添加机器人
4. 复制Webhook地址

#### 方案三：龙虾（OpenClaw）

根据 [龙虾实验室教程](https://longxialab.cn)：

1. 配置企业微信群机器人
2. 在龙虾中设置Webhook推送
3. 实现更智能的消息处理

### 步骤3：测试功能

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 访问联系页面
3. 填写表单并提交
4. 检查是否收到推送消息

---

## 🎨 消息样式

推送的消息包含以下信息：

```
📬 网站新咨询

👤 姓名：张三
📧 邮箱：zhangsan@example.com
📝 主题：网站定制开发
💬 留言：
我想定制一个企业官网，请问价格是多少？

⏰ 时间：2026/5/8 14:30:00
```

---

## 🔒 安全说明

### 为什么要用环境变量？

1. **保护密钥安全**：Webhook地址不会暴露在代码仓库中
2. **环境隔离**：开发、测试、生产环境使用不同配置
3. **易于管理**：集中管理敏感配置

### .gitignore已配置

`.env` 文件已添加到 `.gitignore`，不会意外提交到Git仓库。

### 建议

- 定期更换机器人Webhook地址
- 不要在公开场合分享你的Webhook地址
- 监控机器人的消息发送记录

---

## 🐛 常见问题

### Q: 提交表单后没有收到消息？

A: 检查以下几点：
1. `.env` 文件是否配置了正确的Webhook地址
2. 开发服务器是否重启（环境变量需要重启生效）
3. 浏览器控制台是否有错误信息
4. 机器人是否正常工作

### Q: 提示"提交失败"？

A: 
1. 检查网络连接
2. 确认Webhook地址是否正确
3. 查看浏览器开发者工具的网络请求详情

### Q: 想同时推送到多个平台？

A: 可以在 `handleSubmit` 函数中添加多个Webhook调用：

```javascript
const qqWebhook = import.meta.env.VITE_QQ_BOT_WEBHOOK
const wecomWebhook = import.meta.env.VITE_WECOM_BOT_WEBHOOK

// 并行发送
await Promise.all([
  qqWebhook && sendToQQ(qqWebhook, message),
  wecomWebhook && sendToWeCom(wecomWebhook, message)
])
```

---

## 📚 相关资源

- [酷推QQ机器人](https://cpuid.top/)
- [企业微信接入指南](https://developer.work.weixin.qq.com/document/path/91770)
- [龙虾实验室](https://longxialab.cn)
- [OpenClaw文档](https://github.com/openclaw/openclaw)

---

## 🔄 更新日志

### 2026-05-08
- 实现QQ机器人消息推送
- 添加表单验证
- 完成安全审计
- 编写配置文档
