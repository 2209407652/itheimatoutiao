import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/Login.vue')
  },
  {
    path: '/',
    component: () => import('@/views/Main/Main.vue'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/Home/Home.vue')
      },
      {
        path: '/user',
        component: () => import('@/views/User/User.vue')
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/Search/Search.vue')
  },
  {
    path: '/search/:kw',
    name: 'search-result',
    component: () => import('@/views/SearchResult/SearchResult.vue'),
    props: true
  },
  {
    path: '/article/:id',
    name: 'art-detail',
    component: () => import('@/views/ArticleDetail/ArticleDetail.vue'),
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
