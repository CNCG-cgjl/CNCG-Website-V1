import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue'),
    meta: {
      title: 'CNCG | 网站开发、内容创作与数字化解决方案',
      description: 'CNCG 专注网站开发、内容创作与数字化解决方案，提供 Vue3 开发、技术咨询、博客文章、知识库与服务产品。'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutPage.vue'),
    meta: {
      title: '关于 CNCG',
      description: '了解 CNCG 的定位、工作方式与服务方向，围绕个人品牌、工具、知识与服务持续建设。'
    }
  },
  {
    path: '/services',
    name: 'Services',
    component: () => import('../views/ServicesPage.vue'),
    meta: {
      title: '服务项目 | CNCG',
      description: '查看 CNCG 提供的网站开发、技术咨询、远程协助与数字化建设服务。'
    }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('../views/BlogPage.vue'),
    meta: {
      title: '博客 | CNCG',
      description: '记录技术实践、开发经验与持续输出中的思考。'
    }
  },
  {
    path: '/blog/:slug',
    name: 'BlogDetail',
    component: () => import('../views/BlogDetailPage.vue'),
    meta: {
      title: '博客文章 | CNCG',
      description: '查看 CNCG 的博客文章详情。'
    }
  },
  {
    path: '/doc',
    name: 'Doc',
    component: () => import('../views/DocPage.vue'),
    meta: {
      title: '知识库 | CNCG',
      description: 'CNCG 的体系化知识库，适合沉淀文档、说明与长期维护内容。'
    }
  },
  {
    path: '/feishu-test',
    name: 'FeishuTest',
    component: () => import('../views/FeishuTestPage.vue'),
    meta: { robots: 'noindex, nofollow' }
  },
  {
    path: '/shop',
    name: 'Shop',
    component: () => import('../views/ShopPage.vue'),
    meta: {
      title: '服务商店 | CNCG',
      description: '浏览 CNCG 提供的网站建设、技术支持、咨询与远程协助服务。'
    }
  },
  {
    path: '/shop/:service',
    name: 'ServiceDetail',
    component: () => import('../views/ServiceDetailPage.vue'),
    meta: {
      title: '服务详情 | CNCG',
      description: '查看服务内容、交付方式、价格区间与合作说明。'
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/ContactPage.vue'),
    meta: {
      title: '联系 CNCG',
      description: '通过留言、评论、社交方式或服务咨询入口联系 CNCG。'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundPage.vue'),
    meta: {
      title: '页面未找到 | CNCG',
      robots: 'noindex, nofollow'
    }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to) => {
  if (to.path === '/note' || to.path.startsWith('/note/')) {
    return { path: '/doc', query: to.query, hash: to.hash, replace: true }
  }
  return true
})

const DEFAULT_TITLE = 'CNCG | 网站开发、内容创作与数字化解决方案'
const DEFAULT_DESCRIPTION = 'CNCG 专注网站开发、内容创作与数字化解决方案，提供 Vue3 开发、技术咨询、博客文章、知识库与服务产品。'

router.afterEach((to) => {
  const meta = to.meta || {}

  document.title = meta.title || DEFAULT_TITLE
  setMetaTag('description', meta.description || DEFAULT_DESCRIPTION)

  if (meta.robots) {
    setMetaTag('robots', meta.robots)
  } else {
    removeMetaTag('robots')
  }

  const canonical = `https://cncg.me${to.path}`
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = canonical

  setMetaProperty('og:title', meta.title || DEFAULT_TITLE)
  setMetaProperty('og:description', meta.description || DEFAULT_DESCRIPTION)
  setMetaProperty('og:url', canonical)
})

function setMetaTag(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.name = name
    document.head.appendChild(el)
  }
  el.content = content
}

function removeMetaTag(name) {
  const el = document.querySelector(`meta[name="${name}"]`)
  if (el) el.remove()
}

function setMetaProperty(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.property = property
    document.head.appendChild(el)
  }
  el.content = content
}
