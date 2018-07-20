// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import router from './router'
import { http } from './api/http'
import { setStage } from '@/util/canvas.js'

Vue.use(Vuex)
Vue.config.productionTip = false
Vue.prototype.$http = http
/* eslint-disable no-new */
const store = new Vuex.Store({
  state: {
    user: {
      name: '',
      company: '中化能源'
    },
    stage: setStage()
  },
  mutations: {
    setUserName (state, name) {
      state.user.name = name
    },
    setToken (state, token) {
      state.token = token
    },
    setStage (state, stage) {
      state.stage = stage
    }
  }
})
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
