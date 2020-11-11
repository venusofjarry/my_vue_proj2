import {
    reqAddress,
    reqCategories,
    reqShops
} from '@/api'

import {
    RECEIVE_ADDRESS,
    RECEIVE_CATEGORIES,
    RECEIVE_SHOPS
} from './mutation-types'


export default {
    async getAddress({commit,state}){
        const {longitude,latitude} = state
        const result = await reqAddress(longitude,latitude)
        if (result.code === 0) {
            const address = result.data
            console.log(address);
            commit(RECEIVE_ADDRESS,address)
        }
    },
    async getShops({commit}){
        const result = await reqCategories()
        if (result.code === 0) {
            const categories = result.data
            commit(RECEIVE_CATEGORIES,categories)
        }
    },
    async getCategories({commit,state}){
        const {longitude,latitude} = state
        const result = await reqShops({longitude,latitude})
        if (result.code === 0) {
            const reqShops = result.data
            commit(RECEIVE_SHOPS,reqShops)
        }
    }
}