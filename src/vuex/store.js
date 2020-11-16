/* 
vuex最核心的管理对象store
*/
import Vue from 'vue'
import Vuex from 'vuex'

import msite from './modules/msite'
import user from './modules/user'
import shop from './modules/shop'

Vue.use(Vuex)

// 之前在模块化vuex时，遇到了一个问题：无论怎样调，token总是不能保存到localStorage中，最终的原因是：各个分模块中的state我都写成了states，这样就导致ajax.js中不能将token添加到localStorage中，因为找不到state，存不进去
export default new Vuex.Store({
  modules: {
    msite,
    user,
    shop
  }
})

/* 
总的state的结构:
{
  msite: {},
  user: {},
  shop: {}
}
*/