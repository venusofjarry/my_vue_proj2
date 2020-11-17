import Vue from 'vue'

import {
    // reqShopGoods,
    // reqShopRatings,
    // reqShopInfo
    reqShop
} from '@/api'

import {
    RECEIVE_SHOP,
    ADD_FOOD_COUNT,
    REDUCE_FOOD_COUNT,
    CLEAR_CART
} from '../mutation-types'
import { getCartFoods } from '../../utils'

export default {
    state: {
        cartFoods: [],
        shop: {}
    },
    mutations: {
        [RECEIVE_SHOP] (state,{shop={}, cartFoods=[]}) {
            state.shop = shop
            state.cartFoods = cartFoods
        },

        [ADD_FOOD_COUNT](state,food){
            if(food.count){
                food.count++
            }else{
                Vue.set(food,'count',1) 
                state.cartFoods.push(food)
            }
        },
        [REDUCE_FOOD_COUNT](state,food){
            if(food.count>0){
                food.count--
                if(food.count===0){
                    state.cartFoods.splice(state.cartFoods.indexOf(food),1)
                }
            }
        },
        [CLEAR_CART] (state) {
            state.cartFoods.forEach(food => food.count = 0)
            state.cartFoods = []
        }

    },
    actions: {
        async getShop({commit,state}, id){
            if(id===state.shop.id){
                return
            }
            if(state.shop.id){
                commit(RECEIVE_SHOP,{})
            }

            const result = await reqShop(id)
            if(result.code===0){
                const shop = result.data
                const cartFoods = getCartFoods(shop)
                commit(RECEIVE_SHOP, {shop,cartFoods})
            }
        },
        

        updateFoodCount({commit},{isAdd,food}){
            if(isAdd){
                commit(ADD_FOOD_COUNT,food)
            }else{
                commit(REDUCE_FOOD_COUNT,food)
            }
        }
    },
    getters: {
        totalCount(state){
            return state.cartFoods.reduce( 
                ((pre,food) => pre + food.count), 0
            )
        },
        totalPrice(state){
            return state.cartFoods.reduce(
                ((pre,food) => pre + food.count*food.price), 0
            )
        },
        positiveSize (state) {
            const ratings = state.shop.ratings
            return !ratings ? 0 : ratings.reduce((total, rating) => total + (rating.rateType===0 ? 1 : 0), 0)
        }
    },
}