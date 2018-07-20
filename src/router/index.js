import Vue from 'vue'
import Router from 'vue-router'

import Offer from '@/components/offer'
import Inquiry from '@/components/inquiry'
import OrBuyUp from '@/components/or_buyup'
import OrBuyDown from '@/components/or_buydown'
import OrSellUp from '@/components/or_sellup'
import OrSellDown from '@/components/or_selldown'
import OrCenter from '@/components/or_center'
import SlInput from '@/components/sl_input'
import SlManage from '@/components/sl_manage'
import SlPage from '@/components/sl_page'
import ByInput from '@/components/by_input'
import ByManage from '@/components/by_manage'
import ByPage from '@/components/by_page'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'inquiry',
    component: Inquiry
  }, {
    path: '/offer',
    name: 'offer',
    component: Offer
  }, {
    path: '/sl-input',
    name: 'sl-input',
    component: SlInput
  }, {
    path: '/sl-manage',
    name: 'sl-manage',
    component: SlManage
  }, {
    path: '/sl-page',
    name: 'sl-page',
    component: SlPage
  }, {
    path: '/by-input',
    name: 'by-input',
    component: ByInput
  }, {
    path: '/by-manage',
    name: 'by-manage',
    component: ByManage
  }, {
    path: '/by-page',
    name: 'by-page',
    component: ByPage
  }, {
    path: '/or-buyup',
    name: 'or-buyup',
    component: OrBuyUp
  }, {
    path: '/or-buydown',
    name: 'or-buydown',
    component: OrBuyDown
  }, {
    path: '/or-sellup',
    name: 'or-sellup',
    component: OrSellUp
  }, {
    path: '/or-selldown',
    name: 'or-selldown',
    component: OrSellDown
  }, {
    path: '/or-center',
    name: 'or-center',
    component: OrCenter
  }]
})
