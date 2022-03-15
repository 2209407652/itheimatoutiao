import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 登录页
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/Login.vue')
  },
  // 主页
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
  // 搜索页
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/Search/Search.vue')
  },
  // 搜索详情页
  {
    path: '/search/:kw',
    name: 'search-result',
    component: () => import('@/views/SearchResult/SearchResult.vue'),
    props: true
  },
  // 文章详情页
  {
    path: '/article/:id',
    name: 'art-detail',
    component: () => import('@/views/ArticleDetail/ArticleDetail.vue'),
    props: true
  },
  // 编辑用户资料页
  {
    path: '/user/edit',
    name: 'user-edit',
    component: () => import('@/views/UserEdit/UserEdit.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
