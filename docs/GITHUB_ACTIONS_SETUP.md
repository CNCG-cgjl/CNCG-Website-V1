# GitHub Actions 配置（v1.1）

## 工作流

| 文件 | 触发 | 作用 |
|------|------|------|
| `.github/workflows/ci.yml` | push/PR `main` | `npm ci` + build + dist 校验 + 产物 artifact |
| `.github/workflows/deploy-vps.yml` | 标签 `v1.*` 或手动 | rsync 到 `releases/dist-{sha}` + symlink |

## 所需 Secrets（Repository → Settings → Secrets）

| Name | 示例 |
|------|------|
| `SSH_PRIVATE_KEY` | 部署用私钥全文 |
| `SERVER_HOST` | `154.219.108.233` |
| `SERVER_USER` | `root` |
| `DEPLOY_PATH` | `/opt/cncg-website` |

## 服务器首次准备

```bash
mkdir -p /opt/cncg-website/releases /opt/cncg-website/backups
# 若当前 dist 为目录，可先备份再改为软链：
mv /opt/cncg-website/dist /opt/cncg-website/backups/dist-legacy-$(date +%Y%m%d)
mkdir -p /opt/cncg-website/releases/dist-initial
ln -sfn /opt/cncg-website/releases/dist-initial /opt/cncg-website/dist
```

## 无 Secrets 时本机部署

```powershell
npm run release:pack
npm run release:upload
# 或指定: .\scripts\deploy-upload.ps1 -Server root@你的IP
```

## 回滚

```bash
DEPLOY_PATH=/opt/cncg-website ./scripts/server-switch-release.sh dist-<上一版sha7>
```
