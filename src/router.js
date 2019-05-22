import Vue from 'vue'
import Router from 'vue-router'
// import WaterFallFont from '@/components/waterFallFont'
// import Particle from '@/components/particle'
// import Random from '@/components/random'
// import Tetris from '@/components/tetris/tetris'
// import Rain from '@/components/rain'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'waterFallFont',
    component: () => import(/* webpackChunkName: "waterFallFont" */ '@/components/waterFallFont')
  }, {
    path: '/particle',
    name: 'particle',
    component: () => import(/* webpackChunkName: "particle" */ '@/components/particle')
  }, {
    path: '/rain',
    name: 'rain',
    component: () => import(/* webpackChunkName: "rain" */ '@/components/rain')
  }, {
    path: '/random',
    name: 'random',
    component: () => import(/* webpackChunkName: "random" */ '@/components/random')
  }, {
    path: '/tetris',
    name: 'tetris',
    component: () => import(/* webpackChunkName: "tetris" */ '@/components/tetris')
  }]
})
