import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue'),
    meta: {
      title: 'CNCG | 让你的网站被 AI 看懂',
      description: 'CNCG 提供 AI 可见性体检、AI-ready 网站改造和结构化内容优化服务。'
    }
  },
  {
    path: '/radar',
    name: 'Radar',
    component: () => import('../views/RadarPage.vue'),
    meta: {
      title: '信息雷达 | CNCG',
      description: 'AI 驱动的每日情报系统，187 信息源，10 章简报，飞书/QQ 推送。'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutPage.vue'),
    meta: {
      title: '关于 CNCG | AI 可见性优化服务商',
      description: 'CNCG 是独立数字工作室，专注 AI-ready 网站、AI 可见性体检与结构化内容系统。'
    }
  },
  {
    path: '/services',
    name: 'Services',
    component: () => import('../views/ServicesPage.vue'),
    meta: { title: '服务项目 | CNCG', description: 'CNCG 提供 AI 可见性体检、AI-ready 网站改造等服务。' }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('../views/BlogPage.vue'),
    meta: { title: '博客 | CNCG', description: '记录技术实践与开发经验。' }
  },
  {
    path: '/blog/:slug',
    name: 'BlogDetail',
    component: () => import('../views/BlogDetailPage.vue'),
    meta: { title: '博客文章 | CNCG', description: '查看 CNCG 的博客文章详情。' }
  },
  {
    path: '/doc',
    name: 'Doc',
    component: () => import('../views/DocPage.vue'),
    meta: { title: '知识库 | CNCG', description: 'CNCG 的体系化知识库。' }
  },
  {
    path: '/tools',
    name: 'Tools',
    component: () => import('../views/ToolsPage.vue'),
    meta: { title: '免费工具 | CNCG', description: 'CNCG 提供的免费在线小工具。' }
  },
  {
    path: '/tools/site-checklist',
    name: 'ToolSiteChecklist',
    component: () => import('../views/tools/SiteChecklistPage.vue'),
    meta: { title: '网站上线检查清单 | CNCG 工具', description: '发布前逐项检查。' }
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: () => import('../views/FAQPage.vue'),
    meta: { title: '常见问题 | CNCG', description: '常见问题解答。' }
  },
  {
    path: '/shop',
    name: 'Shop',
    component: () => import('../views/ShopPage.vue'),
    meta: { title: '店铺 | CNCG', description: 'CNCG 的产品与服务。' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/ContactPage.vue'),
    meta: { title: '联系咨询 | CNCG', description: '联系 CNCG 获取技术支持。' }
  },
  {
    path: '/services/:slug',
    name: 'ServiceDetail',
    component: () => import('../views/ServiceDetailPage.vue'),
    meta: { title: '服务详情 | CNCG', description: '查看 CNCG 的服务详情。' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundPage.vue'),
    meta: { title: '404 | CNCG', description: '页面未找到' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  }
})

router.afterEach((to) => {
  const title = to.meta?.title || 'CNCG'
  const desc = to.meta?.description || 'CNCG - 独立数字工作室'
  document.title = title
  let meta = document.querySelector('meta[name="description"]')
  if (meta) meta.content = desc
})

export { router }
export default router
