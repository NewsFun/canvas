import Vue from 'vue'
import Router from 'vue-router'
import WaterFallFont from '@/components/waterFallFont'
import Particle from '@/components/particle'
import Random from '@/components/random'
import Tetris from '@/components/tetris/tetris'
import Rain from '@/components/rain'

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
  }, {
    path: '/rain',
    name: 'rain',
    component: Rain
  }, {
    path: '/random',
    name: 'random',
    component: Random
  }, {
    path: '/tetris',
    name: 'tetris',
    component: Tetris
  }]
})
