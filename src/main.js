// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import router from './router'
import filters from './util/index'
import { http } from './api/http'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Vuex)
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$http = http
/* eslint-disable no-new */
const store = new Vuex.Store({
  state: {
    count: 0,
    user: {
      name: '',
      company: '中化能源'
    },
    token: ''
  },
  mutations: {
    increment (state) {
      state.count++
    },
    setUserName (state, name) {
      state.user.name = name
    },
    setToken (state, token) {
      state.token = token
    }
  }
})
new Vue({
  el: '#app',
  router,
  store,
  filters,
  components: { App },
  template: '<App/>'
})
