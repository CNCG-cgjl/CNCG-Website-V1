const QMSG_API = 'https://qmsg.zendee.cn/send'

function sanitize(str) {
  if (!str) return ''
  return String(str).replace(/[<>"'&]/g, c => ({ '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' }[c] || c))
}

async function sendQmsg(key, message, qq = '') {
  const params = new URLSearchParams()
  params.append('msg', message)
  if (qq) params.append('qq', qq)

  const url = `${QMSG_API}/${key}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  })

  const data = await response.json()

  if (data.success === false && data.code !== 0) {
    throw new Error(data.reason || 'Qmsg推送失败')
  }

  return data
}

async function sendQQBotMessage(appId, token, message) {
  if (!appId || !token) return null

  const url = `https://api.sgroup.qq.com/channels/${appId}/messages`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `QQBot ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: message,
        msg_type: 0,
        msg_id: Date.now().toString()
      })
    })

    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

async function sendFeishuWebhook(webhookUrl, message) {
  if (!webhookUrl) return null

  const unescaped = message
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")

  const card = {
    msg_type: 'interactive',
    card: {
      header: {
        title: { tag: 'plain_text', content: '📬 CNCG 网站通知' },
        template: 'blue'
      },
      elements: [
        { tag: 'markdown', content: unescaped },
        {
          tag: 'note',
          elements: [
            { tag: 'plain_text', content: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }) }
          ]
        }
      ]
    }
  }

  const body = JSON.stringify(card)

  const feishuSecret = process.env.FEISHU_WEBHOOK_SECRET
  if (feishuSecret) {
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const stringToSign = `${timestamp}\n${feishuSecret}`
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(feishuSecret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    )
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(stringToSign))
    const sign = btoa(String.fromCharCode(...new Uint8Array(signature)))
    card.timestamp = timestamp
    card.sign = sign
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card)
    })
    const data = await response.json()
    if (data.code !== 0) {
      throw new Error(data.msg || '飞书Webhook推送失败')
    }
    return data
  } catch (err) {
    console.error('飞书Webhook推送失败:', err.message)
    return { error: err.message }
  }
}

export async function notify(message) {
  const qmsgKey = process.env.QMSG_KEY
  const qqNumber = process.env.QQ_NUMBER || ''
  const qqBotAppId = process.env.QQ_BOT_APP_ID || ''
  const qqBotToken = process.env.QQ_BOT_TOKEN || ''
  const feishuWebhookUrl = process.env.FEISHU_WEBHOOK_URL || ''

  const results = {
    qmsg: null,
    qqbot: null,
    feishu: null
  }

  if (qmsgKey) {
    try {
      results.qmsg = await sendQmsg(qmsgKey, message, qqNumber)
    } catch (err) {
      console.error('Qmsg推送失败:', err.message)
      results.qmsg = { error: err.message }
    }
  }

  if (qqBotAppId && qqBotToken) {
    try {
      results.qqbot = await sendQQBotMessage(qqBotAppId, qqBotToken, message)
    } catch (err) {
      console.error('QQBot推送失败:', err.message)
      results.qqbot = { error: err.message }
    }
  }

  if (feishuWebhookUrl) {
    results.feishu = await sendFeishuWebhook(feishuWebhookUrl, message)
  }

  return results
}

export function formatUpdateMessage(type, data) {
  const templates = {
    new_article: () => {
      return `📝 CNCG 网站更新\n\n📰 新文章发布：${sanitize(data.title)}\n${data.summary ? '📋 ' + sanitize(data.summary) + '\n' : ''}🔗 https://cncg.me/blog/${sanitize(data.slug)}\n\n⏰ ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`
    },
    new_note: () => {
      return `📌 CNCG 网站更新\n\n📖 知识库更新：${sanitize(data.title)}\n${data.summary ? '📋 ' + sanitize(data.summary) + '\n' : ''}🔗 https://cncg.me/doc\n\n⏰ ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`
    },
    new_comment: () => {
      return `💬 CNCG 新评论\n\n👤 ${sanitize(data.author)} 在「${sanitize(data.page)}」评论：\n"${sanitize(data.content)}"\n\n🔗 https://cncg.me${sanitize(data.url)}\n⏰ ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`
    },
    new_guestbook: () => {
      return `💌 CNCG 新留言\n\n👤 ${sanitize(data.author)}：\n"${sanitize(data.content)}"\n\n🔗 https://cncg.me/contact\n⏰ ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`
    },
    site_update: () => {
      return `🔧 CNCG 网站更新\n\n${sanitize(data.content)}\n\n🔗 https://cncg.me\n⏰ ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`
    },
    custom: () => {
      return `📢 CNCG 通知\n\n${sanitize(data.content)}\n\n⏰ ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`
    }
  }

  const formatter = templates[type] || templates.custom
  return formatter()
}
