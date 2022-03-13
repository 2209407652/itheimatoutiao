import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 初始的 state
let initState = {
  tokenInfo: ""
}
const stateStr = localStorage.getItem('state')
if(stateStr){
  initState = JSON.parse(stateStr)
}

export default new Vuex.Store({
  // 非持久化储存
  state: initState,
  getters: {
  },
  mutations: {
    // 更新 token 的方法
    updateTokenInfo(state, payload) {
      // 将 token 保存到仓库
      state.tokenInfo = payload
      this.commit('saveStateToStorage')
    },
    // 每次更新 token 就到用下面的方法把 token 储存到本地
    saveStateToStorage(state) {
      localStorage.setItem('state', JSON.stringify(state))
    }
  },
  actions: {
  },
  modules: {
  }
})
