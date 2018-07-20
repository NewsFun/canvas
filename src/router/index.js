import Vue from 'vue'
import Router from 'vue-router'
import WaterFallFont from '@/components/waterFallFont'
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'waterFallFont',
    component: WaterFallFont
  }]
})
