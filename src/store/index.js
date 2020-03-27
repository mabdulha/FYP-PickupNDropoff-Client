import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [VuexPersistedState()],
  strict: true,
  state: {
    token: null,
    user: null,
    driver: null,
    isUserLoggedin: false
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      if (token) {
        state.isUserLoggedin = true
      } else {
        state.isUserLoggedin = false
      }
    },
    setUser (state, user) {
      state.user = user
    },
    setDriver (state, driver) {
      state.driver = driver
    }
  },
  actions: {
    setToken ({ commit }, token) {
      commit('setToken', token)
    },
    setUser ({ commit }, user) {
      commit('setUser', user)
    },
    setDriver ({ commit }, driver) {
      commit('setDriver', driver)
    }
  },
  modules: {
  }
})
