/* 
包含n个用于间接更新状态数据的方法的对象
方法可以包含异步和逻辑处理代码
*/
import {
    reqAddress,
    reqCategorys,
    reqShops,
    reqAutoLogin,
    reqShopGoods,
    reqShopRating,
    reqShopInfo
  } from '@/api'
  
import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
  RECEIVE_USER,
  RECEIVE_TOKEN,
  LOGOUT,
  RECEIVE_GOODS,
  RECEIVE_RATING,
  RECEIVE_INFO

} from './mutation-types'
  
  
export default {
  /* 
  获取当前地址信息对象的异步action
  */
  async getAddress ({commit, state}) {
    const {longitude, latitude} = state
    // 发异步请求
    const result = await reqAddress(longitude,latitude)
    // 请求成功后, 提交给mutation
    if (result.code===0) {
      const address = result.data
      commit(RECEIVE_ADDRESS, address)
    }
  },

  /* 
  获取商品分类数组的异步action
  */
  async getCategorys ({commit},callback) {
    // 发异步请求
    const result = await reqCategorys()
    // 请求成功后, 提交给mutation
    if (result.code===0) {
      const categorys = result.data
      commit(RECEIVE_CATEGORYS, categorys)
      typeof callback === 'function' && callback()
    }
  },

  /* 
  获取商家数组的异步action
  */
  async getShops ({commit, state}) {
    const {longitude, latitude} = state
    // 发异步请求
    const result = await reqShops({longitude, latitude})
    // 请求成功后, 提交给mutation
    if (result.code===0) {
      const shops = result.data
      commit(RECEIVE_SHOPS, shops)
    }
  },
  
  // 保存用户的同步action，这里碰到一个问题，我使用...mapState和this.$store.state.user都可以读到数据，但就是通过浏览器的vuex看不到数据，后面如果遇到了拿不到user的数据，问题可能出在这里
  saveUser({commit}, user){
    const token = user.token
    localStorage.setItem('token_key',token)
    delete user.token
    commit(RECEIVE_USER,user)
    commit(RECEIVE_TOKEN,token)
  },

  // 退出登录
  logout({commit}){
    localStorage.removeItem('token_key')
    commit(LOGOUT)
    
  },
  // 自动登录的异步action
  async autoLogin({commit}){
    const result = await reqAutoLogin()
    if(result.code===0){
      const user = result.data
      commit(RECEIVE_USER, user)
    }
  },
  async getShopGoods({commit}, cb){
    const result = await reqShopGoods()
    if(result.code===0){
      const goods = result.data
      commit(RECEIVE_GOODS, goods)
      typeof cb==='function' && cb()
    }
  },
  async getShopInfo({commit}, cb){
    const result = await reqShopInfo()
    if(result.code===0){
      const info = result.data
      commit(RECEIVE_INFO, info)
      typeof cb==='function' && cb()
    }
  },
  async getShopRating({commit}, cb){
    const result = await reqShopRating()
    if(result.code===0){
      const rating = result.data
      commit(RECEIVE_RATING, rating)
      typeof cb==='function' && cb()
    }
  }
}