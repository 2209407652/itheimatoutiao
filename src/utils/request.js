import axios from 'axios'
// Toast 轻提示
import { Toast } from 'vant'
// store
import store from '@/store'

// 调用 axios.create() 方法，创建 axios 的实例对象
const instance = axios.create({
  // 请求根路径
  baseURL: 'http://www.liulongbin.top:8000'
})
// 添加请求拦截器
instance.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    // 展示 loading 效果
    Toast.loading({
      message: '加载中...', // 展示文本
      duration: 0   // 展示时长(ms)
    })
    const tokenStr = store.state.tokenInfo.token
    if(tokenStr) {
      config.headers.Authorization = `Bearer ${tokenStr}`
    }
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
// 添加响应拦截器
instance.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    Toast.clear()
    return response
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export default instance