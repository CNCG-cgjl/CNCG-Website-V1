import { notify, formatUpdateMessage } from '../lib/notify.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const deployToken = process.env.DEPLOY_HOOK_TOKEN
  if (deployToken) {
    const clientToken = req.headers['x-deploy-token'] || req.query?.token
    if (clientToken !== deployToken) {
      return res.status(401).json({ error: '未授权' })
    }
  }

  const { state, url, commit, branch, message } = req.body

  const stateMap = {
    READY: '✅ 部署成功',
    ERROR: '❌ 部署失败',
    BUILDING: '🔨 正在构建...',
    QUEUED: '⏳ 等待构建',
  }

  const status = stateMap[state] || `📦 状态: ${state}`

  try {
    await notify(formatUpdateMessage('site_update', {
      content: `${status}\n\n🔗 ${url || 'https://cncg.me'}\n📝 ${commit ? `提交: ${commit}` : ''}\n🌿 ${branch ? `分支: ${branch}` : ''}\n📋 ${message || '网站更新'}`
    }))

    return res.status(200).json({ code: 0, message: '部署通知已推送' })
  } catch (err) {
    console.error('部署通知推送失败:', err)
    return res.status(500).json({ error: err.message })
  }
}