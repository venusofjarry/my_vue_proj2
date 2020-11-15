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
// 将api文件夹中的所有前后台交互方法，都放在API对象中，而不是actions中
import * as API from './api'
import './mock/mock-server'

import VueLazyload from 'vue-lazyload'
import loading from './common/loading.gif'

Vue.config.productionTip = false

// 将API对象放入vm实例对象，作为一个属性，后面就可以使用this.$API调用这些方法了
Vue.prototype.$API = API

// 注册全局组件
Vue.component('Header',Header)
Vue.component(Button.name, Button)
Vue.component('Star',Star)
Vue.component('CartControl',CartControl)

Vue.use(VueLazyload,{
  loading // 在要显示的图片没有加载到页面之前显示
})  // use方法帮我们定义了一个全局指令：lazy（使用v-lazy即可）

new Vue({
  render: h => h(App),
  router, // 所有组件都能看到$router和$route   router-link   router-view
  store,
  // i18n
}).$mount('#app')