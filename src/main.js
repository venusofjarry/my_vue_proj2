import Vue from 'vue'
import 'lib-flexible'
import './validate'
import {Button} from 'mint-ui'

import App from './App.vue'
import router from './router'
import Header from './components/Header/Header.vue'
import Star from '../src/components/Star/Star.vue'
import CartControl from '../src/components/CartControl/CartControl.vue'
import store from './vuex/store'
import * as API from './api'
import './mock/mock-server'
import './filters'

import VueLazyload from 'vue-lazyload'
import loading from './common/loading.gif'

Vue.config.productionTip = false

Vue.prototype.$API = API

Vue.component('Header',Header)
Vue.component(Button.name, Button)
Vue.component('Star',Star)
Vue.component('CartControl',CartControl)

Vue.use(VueLazyload,{
  loading
})

new Vue({
  render: h => h(App),
  router,
  store,
  // i18n
}).$mount('#app')