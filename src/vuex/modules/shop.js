import Vue from 'vue'

import {
    // reqShopGoods,
    // reqShopRatings,
    // reqShopInfo
    reqShop
} from '@/api'

import {
    // RECEIVE_GOODS,
    // RECEIVE_RATINGS,
    // RECEIVE_INFO,
    RECEIVE_SHOP,
    ADD_FOOD_COUNT,
    REDUCE_FOOD_COUNT,
    CLEAR_CART
} from '../mutation-types'
import { getCartFoods } from '../../utils'

export default {
    state: {
        // goods: [],
        // ratings: [],
        // info: {},
        cartFoods: [],
        shop: {}
    },
    mutations: {
        /*
            [RECEIVE_GOODS] (state,goods) {
                state.goods = goods
            },
            [RECEIVE_RATINGS] (state,ratings) {
            state.ratings = ratings
            },
            [RECEIVE_INFO] (state,info) {
            state.info = info
        },
        */
        [RECEIVE_SHOP] (state,{shop={}, cartFoods=[]}) {
            state.shop = shop
            state.cartFoods = cartFoods
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

                // 将当前food添加到购物车中
                state.cartFoods.push(food)
            }
        },
        [REDUCE_FOOD_COUNT](state,food){
            if(food.count>0){  // 判断一下逻辑更严谨：当还有数量时可以减少，没有的话就进不了if条件判断，然后隐藏减少和显示数量的标签
                food.count--
                
                // 如果数量变为0，将food从购物车中移除
                if(food.count===0){
                    state.cartFoods.splice(state.cartFoods.indexOf(food),1)
                }
            }
        },
        [CLEAR_CART] (state) {
            // 删除cartFoods数组的商品数据之前，需要先将count重置为0（或者删除都可以）
            state.cartFoods.forEach(food => food.count = 0)

            // 删除cartFoods数组的商品数据
            state.cartFoods = []
        }

    },
    actions: {
        /*
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
                    const ratings = result.data
                    commit(RECEIVE_RATINGS, ratings)
                    typeof cb==='function' && cb()
                }
            },
        */
        // 注意，之前我们写actions中的函数时，都没有用到state，所以我们只解构了commit函数用于传数据给mutations，但如果需要state，必须先解构引入，才能使用，否则会报错，找了我好久！！！！
        async getShop({commit,state}, id){
            // 如果打开了路由地址，又重复点这个路由地址，我们需要中断请求，因为不需要
            if(id===state.shop.id){
                return
            }

            // 如果打开的是别的id参数的路由，需要先将里面的shop和cartFoods数据先清除，再加载别的数据，为什么要做这一步？
            // 因为切换到另一个路由时，前面的路由的数据还会短时间停留在页面上。我们打开新路由的第一眼并不是看到新路由的内容，而是上一个路由的数据会短暂停留，然后再加载新路由的数据。这里是在请求新路由数据之前先删除上一个路由的数据，这样就不会有这个问题了
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
        // 总数量
        totalCount(state){
            // 这里我怕自己看不懂，所以换行了，这个在eslint语法中会报错的，看懂了就改过来
            return state.cartFoods.reduce( 
                ((pre,food) => pre + food.count), 0
            )
        },

        // 总价格
        totalPrice(state){
            return state.cartFoods.reduce(
                ((pre,food) => pre + food.count*food.price), 0
            )
        }
    },
}