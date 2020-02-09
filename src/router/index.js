import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import goodlist from '@/views/goodlist'
import cart from '@/views/cart'
import address from '@/views/Address'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'goodlist',
      component: goodlist
    },
    {
      path: '/cart',
      name: 'cart',
      component: cart
    },
    {
      path: '/address',
      name: 'address',
      component: address
    }
  ]
})
