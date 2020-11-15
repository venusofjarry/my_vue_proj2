/* 
包含n个用于直接更新状态数据的方法的对象
方法不可以包含异步和逻辑处理代码
*/

import Vue from 'vue'
import {
    RECEIVE_ADDRESS,
    RECEIVE_CATEGORYS,
    RECEIVE_SHOPS,
    RECEIVE_USER,
    RECEIVE_TOKEN,
    LOGOUT,
    RECEIVE_GOODS,
    RECEIVE_RATING,
    RECEIVE_INFO,
    ADD_FOOD_COUNT,
    REDUCE_FOOD_COUNT
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
    },
    [RECEIVE_GOODS] (state,goods) {
      state.goods = goods
    },
    [RECEIVE_RATING] (state,rating) {
      state.rating = rating
    },
    [RECEIVE_INFO] (state,info) {
      state.info = info
    },
    [ADD_FOOD_COUNT](state,food){
      if(food.count){  // 确保food中有count
        food.count++
      }else{
        /*
        1 这里考虑的是考虑初始化状态下点击的情况: 
          如果还没有添加商品，那第一次点击添加的话，就是添加第一个商品；

        2 另外最重要的就是：food本身是没有count属性的，所以count并不是响应式的。我们需要使用set方法，为food这个响应式数据添加一个响应式属性：
          set方法向响应式对象中添加一个 property，并确保这个新 property 同样是响应式的，且触发视图更新。它必须用于向响应式对象上添加新 property，因为 Vue 无法探测普通的新增 property 
        */
        Vue.set(food,'count',1) 
      }
    },
    [REDUCE_FOOD_COUNT](state,food){
      if(food.count>0){  // 判断一下逻辑更严谨：当还有数量时可以减少，没有的话就进不了if条件判断，然后隐藏减少和显示数量的标签
        food.count--
      }
    }
  }