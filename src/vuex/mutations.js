/* 
包含n个用于直接更新状态数据的方法的对象
方法不可以包含异步和逻辑处理代码
*/
import {
    RECEIVE_ADDRESS,
    RECEIVE_CATEGORYS,
    RECEIVE_SHOPS,
    RECEIVE_USER,
    RECEIVE_TOKEN,
    LOGOUT
  } from './mutation-types'
  
  export default {
    [RECEIVE_ADDRESS] (state, address) {
      state.address = address
    },
    [RECEIVE_CATEGORYS] (state, categorys) {
      state.categorys = categorys
    },
    [RECEIVE_SHOPS] (state, shops) {
      state.shops = shops
    },
    // 保存用户的同步action，这里碰到一个问题，我使用...mapState和this.$store.state.user都可以读到数据，但就是通过浏览器的vuex看不到数据，后面如果遇到了拿不到user的数据，问题可能出在这里。
    [RECEIVE_USER] (state, user) {
      state.user = user
    },
    [RECEIVE_TOKEN] (state, token) {
      state.token = token
    },
    [LOGOUT] (state) {
      state.token = null
    }
  }