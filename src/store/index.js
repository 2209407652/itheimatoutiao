import Vue from 'vue'
import Vuex from 'vuex'
import { getUserInfoAPI, getUserProfileAPI } from "@/api/userAPI.js";

Vue.use(Vuex)
// 初始的 state
let initState = {
  // 用户 token 信息
  tokenInfo: {},
  // 用户基本信息
  userInfo: {},
  // 用户的简介信息
  userProfile: {},
}
const stateStr = localStorage.getItem('state')
if (stateStr) {
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
    // 更新 userInfo 的方法
    updateUserInfo(state, payload) {
      // 把用户信息转存到 state
      state.userInfo = payload
      this.commit('saveStateToStorage')
    },
    // 更新用户详细信息
    updateUserProfile(state, payload) {
      state.userProfile = payload
      this.commit('saveStateToStorage')
    },
    // 每次更新 token 就到用下面的方法把 token 储存到本地
    saveStateToStorage(state) {
      localStorage.setItem('state', JSON.stringify(state))
    },
    // 清空 vuex 和本地的数据
    cleanState(state) {
      // 1. 清空 vuex 中的数据
      state.tokenInfo = {}
      state.userInfo = {}
      state.userProfile = {}
      // 2. 将清空后的 state 存储到本地
      this.commit('saveStateToStorage')
    },
  },
  actions: {
    // 初始化用户的基本信息
    async initUserInfo({ commit }) {
      const { data: res } = await getUserInfoAPI()
      if (res.message === "OK") {
        // 把数据交给 mutations 的 updateUserInfo
        commit('updateUserInfo', res.data)
      }
    },
    // 初始化用户的简介信息
    async initUserProfile({ commit }) {
      // 调用 API 接口
      const { data: res } = await getUserProfileAPI()
      if (res.message === 'OK') {
        commit('updateUserProfile', res.data)
      }
    }
  },
  modules: {
  }
})
