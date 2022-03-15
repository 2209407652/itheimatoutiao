import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index.js'

// 1. 将 VueRouter 本身提供的 $router.push 方法转存到常量中
const originalPush = VueRouter.prototype.push
// 2. 自定义 $router.push 方法，在内部调用原生的 originalPush 方法进行路由跳转；并通过 .catch 捕获错误
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  // 通过 .catch 捕获错误
  return originalPush.call(this, location).catch(err => err)
}

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
        name: 'name',
        component: () => import('@/views/Home/Home.vue'),
        meta: { isRecord: true, top: 0 }
      },
      {
        path: '/user',
        name: 'user',
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
    props: true,
    meta: { isRecord: true, top: 0 } 
  },
  // 编辑用户资料页
  {
    path: '/user/edit',
    name: 'user-edit',
    component: () => import('@/views/UserEdit/UserEdit.vue')
  },
  // 小思同学
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/Chat/Chat.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 所有有权限页面的路径，都在这个数组之中
const pagePathArr = ['/user', '/user/edit']

// 为路由的实例对象挂载全局前置守卫
router.beforeEach((to, from, next) => {
  if (pagePathArr.indexOf(to.path) !== -1) {
    // 访问的是有权限的页面，需要判断用户是否登录
    const tokenStr = store.state.tokenInfo.token
    if (tokenStr) {
      // 有 token 有权限 放行
      next()
    } else {
      // 没有 token 没有权限 去登陆页
      // 记录从那个页面跳转到登陆，从而可以给用户登陆完返回浏览的页面，提高用户体验
      next(`/login?pre=${to.fullPath}`)
    }
  } else {
    // 访问的是没有权限的页面
    next()
  }
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 如果当前的路由的元信息中，isRecord 的值为 true
  if (to.meta.isRecord) {
    setTimeout(() => {
      // 则把元信息中的 top 值设为滚动条纵向滚动的位置
      window.scrollTo(0, to.meta.top)
    }, 0)
  }
})

export default router
