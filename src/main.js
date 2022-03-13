import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 完整导入并注册 vant 组件
import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)

// 引入 amfe-flexible
import 'amfe-flexible'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
