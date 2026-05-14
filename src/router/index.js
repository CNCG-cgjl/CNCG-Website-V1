import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutPage.vue'),
  },
  {
    path: '/services',
    name: 'Services',
    component: () => import('../views/ServicesPage.vue'),
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('../views/BlogPage.vue'),
  },
  {
    path: '/blog/:slug',
    name: 'BlogDetail',
    component: () => import('../views/BlogDetailPage.vue'),
  },
  {
    path: '/note',
    name: 'Note',
    component: () => import('../views/NotePage.vue'),
  },
  {
    path: '/note/:slug',
    name: 'NoteDetail',
    component: () => import('../views/NoteDetailPage.vue'),
  },
  {
    path: '/doc',
    name: 'Doc',
    component: () => import('../views/DocPage.vue'),
  },
  {
    path: '/feishu-test',
    name: 'FeishuTest',
    component: () => import('../views/FeishuTestPage.vue'),
  },
  {
    path: '/shop',
    name: 'Shop',
    component: () => import('../views/ShopPage.vue'),
  },
  {
    path: '/shop/:service',
    name: 'ServiceDetail',
    component: () => import('../views/ServiceDetailPage.vue'),
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/ContactPage.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundPage.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
})
