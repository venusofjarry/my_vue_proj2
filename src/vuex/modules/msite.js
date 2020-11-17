import {    
  reqAddress,
  reqCategorys,
  reqShops,
} from '@/api'

import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
} from '../mutation-types'

export default {
  state: {
      latitude: 40.10038,  // 经度
      longitude: 116.36867,  // 纬度
      address: {}, 
      categorys: [],
      shops: []
  },
  mutations: {
      [RECEIVE_ADDRESS] (state, address) {
          state.address = address
      },
      [RECEIVE_CATEGORYS] (state, categorys) {
      state.categorys = categorys
      },
      [RECEIVE_SHOPS] (state, shops) {
      state.shops = shops
      },
  },
  actions: {
      async getAddress ({commit, state}) {
          const {longitude, latitude} = state
          const result = await reqAddress(longitude,latitude)
          if (result.code===0) {
          const address = result.data
          commit(RECEIVE_ADDRESS, address)
          }
      },

      async getCategorys ({commit},callback) {
          const result = await reqCategorys()
          if (result.code===0) {
          const categorys = result.data
          commit(RECEIVE_CATEGORYS, categorys)
          typeof callback === 'function' && callback()
          }
      },

      async getShops ({commit, state}) {
          const {longitude, latitude} = state
          const result = await reqShops({longitude, latitude})
          if (result.code===0) {
          const shops = result.data
          commit(RECEIVE_SHOPS, shops)
          }
      },
  },
  getters: {}
}