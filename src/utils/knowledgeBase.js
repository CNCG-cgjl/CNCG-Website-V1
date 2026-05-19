import { formatDocumentDate, getWikiMeta, getWikiSpaceNodes } from '@/utils/feishuProxy.js'

export const KNOWLEDGE_BASE_CATEGORIES = [
  {
    key: 'tools',
    title: '工具分享',
    shortLabel: 'TOOLS',
    description: 'AI 工具、效率工具、工作流与常用插件整理。',
    keywords: ['工具', 'ai', '插件', '效率', '工作流', 'workflow', 'prompt', '自动化']
  },
  {
    key: 'resources',
    title: '资料整理',
    shortLabel: 'RESOURCES',
    description: '教程、资源入口、配置说明和长期可查的参考资料。',
    keywords: ['资料', '教程', '资源', '配置', '权限', '接口', '说明', '指南', '汇总', '文档']
  },
  {
    key: 'projects',
    title: '项目经验',
    shortLabel: 'PROJECTS',
    description: '项目实践、技术方案、排查记录与复盘沉淀。',
    keywords: ['项目', '经验', '方案', '排查', '部署', '开发', '实战', '复盘', '踩坑']
  },
  {
    key: 'business',
    title: '副业相关',
    shortLabel: 'BUSINESS',
    description: '副业方向、内容运营、试错记录和阶段复盘。',
    keywords: ['副业', '运营', '内容', '变现', '接单', '商业', '客户']
  },
  {
    key: 'site',
    title: '建站记录',
    shortLabel: 'SITE',
    description: '网站更新、结构调整、页面迭代与上线记录。',
    keywords: ['建站', '网站', '页面', '上线', 'seo', 'vite', 'vue', 'cncg']
  },
  {
    key: 'essays',
    title: '自由随笔',
    shortLabel: 'ESSAYS',
    description: '阅读、观察、生活记录与更完整的图文随笔内容。',
    keywords: ['随笔', '阅读', '生活', '观察', '思考', '书单', '碎碎念', '自由']
  }
]

const FEISHU_BASE_URL = 'https://rcn17b9k6gos.feishu.cn/wiki'

function getCategoryByKey(key) {
  return KNOWLEDGE_BASE_CATEGORIES.find(category => category.key === key) || KNOWLEDGE_BASE_CATEGORIES[KNOWLEDGE_BASE_CATEGORIES.length - 1]
}

function inferCategoryKey(...texts) {
  const normalizedTexts = texts
    .filter(Boolean)
    .map(text => String(text).toLowerCase())

  for (const category of KNOWLEDGE_BASE_CATEGORIES) {
    if (normalizedTexts.some(text => category.keywords.some(keyword => text.includes(keyword)))) {
      return category.key
    }
  }

  return 'essays'
}

function getNodeTypeName(objType) {
  const names = {
    doc: '普通文档',
    docx: '飞书文档',
    sheet: '电子表格',
    bitable: '多维表格',
    file: '附件文件',
    mindnote: '思维导图',
    wiki: '知识库页面'
  }

  return names[objType] || '文档'
}

function extractTimestamp(node) {
  return (
    node?.obj_edit_time ||
    node?.origin_node_edit_time ||
    node?.origin_node_update_time ||
    node?.obj_modified_time ||
    node?.modified_time ||
    node?.update_time ||
    node?.obj_create_time ||
    node?.origin_node_create_time ||
    node?.created_time ||
    ''
  )
}

function buildSummary(title, categoryTitle) {
  if (!title) {
    return `${categoryTitle}分类内容，支持站内阅读与飞书原文查看。`
  }

  if (title.includes('指南') || title.includes('说明')) return '适合按步骤查阅的操作说明，方便后续快速复用。'
  if (title.includes('配置') || title.includes('接入')) return '偏向配置与接入细节，适合落地时对照排查。'
  if (title.includes('整理') || title.includes('汇总')) return '以资料归档和信息收口为主，适合集中浏览。'
  if (title.includes('记录') || title.includes('复盘')) return '保留过程与结果，方便回看判断和延续迭代。'
  if (title.includes('方案') || title.includes('架构')) return '聚焦实现思路与结构设计，便于项目推进时参考。'

  return `${categoryTitle}分类内容，支持站内阅读与飞书原文查看。`
}

function isReadableNode(node) {
  return Boolean(node?.node_token && node?.title && (node?.obj_token || node?.obj_type))
}

function normalizeNode(node, categoryKey, parentTitle = '') {
  const resolvedCategoryKey = categoryKey || inferCategoryKey(parentTitle, node?.title)
  const category = getCategoryByKey(resolvedCategoryKey)
  const timestamp = extractTimestamp(node)

  return {
    id: node.node_token || node.obj_token,
    nodeToken: node.node_token,
    objToken: node.obj_token || node.node_token,
    title: node.title || '未命名文档',
    objType: node.obj_type,
    typeName: getNodeTypeName(node.obj_type),
    categoryKey: category.key,
    categoryTitle: category.title,
    categoryLabel: category.shortLabel,
    categoryDescription: category.description,
    summary: buildSummary(node.title, category.title),
    updatedAt: formatDocumentDate(timestamp),
    updatedAtRaw: timestamp ? new Date(timestamp).getTime() : 0,
    editUrl: `${FEISHU_BASE_URL}/${node.node_token}`
  }
}

export function createKnowledgeGroups(docs = []) {
  const grouped = KNOWLEDGE_BASE_CATEGORIES.map(category => ({
    ...category,
    items: []
  }))

  for (const doc of docs) {
    const target = grouped.find(category => category.key === doc.categoryKey) || grouped[grouped.length - 1]
    target.items.push(doc)
  }

  for (const group of grouped) {
    group.items.sort((left, right) => {
      if (right.updatedAtRaw !== left.updatedAtRaw) return right.updatedAtRaw - left.updatedAtRaw
      return left.title.localeCompare(right.title, 'zh-CN')
    })
  }

  return grouped
}

export async function loadKnowledgeBaseIndex() {
  const meta = await getWikiMeta()
  const wikiToken = meta.wiki_token || ''
  const spaceId = meta.space_id || ''

  if (!wikiToken || !spaceId) {
    return {
      configured: false,
      meta,
      docs: [],
      groups: createKnowledgeGroups([])
    }
  }

  const rootData = await getWikiSpaceNodes(spaceId, wikiToken)
  const rootItems = rootData.items || []

  const nestedEntries = await Promise.all(
    rootItems.map(async rootNode => {
      try {
        const childData = await getWikiSpaceNodes(spaceId, rootNode.node_token)
        return {
          rootNode,
          children: childData.items || []
        }
      } catch {
        return {
          rootNode,
          children: []
        }
      }
    })
  )

  const docs = []

  for (const entry of nestedEntries) {
    const inferredRootCategory = inferCategoryKey(entry.rootNode?.title)
    const readableChildren = entry.children.filter(isReadableNode)

    if (readableChildren.length) {
      for (const child of readableChildren) {
        docs.push(normalizeNode(child, inferredRootCategory, entry.rootNode.title))
      }
      continue
    }

    if (isReadableNode(entry.rootNode)) {
      docs.push(normalizeNode(entry.rootNode, inferredRootCategory))
    }
  }

  const uniqueDocs = Array.from(new Map(docs.map(doc => [doc.id, doc])).values())
  const groups = createKnowledgeGroups(uniqueDocs)

  return {
    configured: true,
    meta,
    docs: uniqueDocs.sort((left, right) => {
      if (right.updatedAtRaw !== left.updatedAtRaw) return right.updatedAtRaw - left.updatedAtRaw
      return left.title.localeCompare(right.title, 'zh-CN')
    }),
    groups
  }
}

export function getFeaturedKnowledgeDocs(groups = [], limit = 4) {
  const featured = []
  const maxDepth = Math.max(0, ...groups.map(group => group.items.length))

  for (let index = 0; index < maxDepth && featured.length < limit; index += 1) {
    for (const group of groups) {
      const item = group.items[index]
      if (item) featured.push(item)
      if (featured.length >= limit) break
    }
  }

  return featured.slice(0, limit)
}
