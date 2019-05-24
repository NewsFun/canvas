// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import router from './router'

Vue.use(Vuex)
Vue.config.productionTip = false
/* eslint-disable no-new */
const store = new Vuex.Store({
  state: {
    user: {
      name: ''
    }
  },
  mutations: {
    setUserName (state, name) {
      state.user.name = name
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
