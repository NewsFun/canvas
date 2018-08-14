import Vue from 'vue'
import Router from 'vue-router'
import WaterFallFont from '@/components/waterFallFont'
import Particle from '@/components/particle'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'waterFallFont',
    component: WaterFallFont
  }, {
    path: '/particle',
    name: 'particle',
    component: Particle
  }]
})
