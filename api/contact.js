export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const webhookUrl = process.env.QQ_BOT_WEBHOOK

  if (!webhookUrl) {
    return res.status(500).json({ error: 'Webhook 未配置' })
  }

  const { name, email, subject, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: '缺少必填字段' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: '邮箱格式不正确' })
  }

  if (message.length > 2000) {
    return res.status(400).json({ error: '留言内容过长' })
  }

  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })

  const content = `📬 网站新咨询\n\n👤 姓名：${name}\n📧 链箱：${email}\n📝 主题：${subject || '未填写'}\n💬 留言：\n${message}\n\n⏰ 时间：${now}`

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        msgtype: 'text',
        text: { content }
      })
    })

    if (!response.ok) {
      throw new Error(`Webhook 请求失败: ${response.status}`)
    }

    return res.status(200).json({ code: 0, message: '消息已发送' })
  } catch (err) {
    console.error('Webhook 推送失败:', err)
    return res.status(500).json({ error: '消息推送失败' })
  }
}