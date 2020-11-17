import {
    reqAutoLogin,
} from '@/api'

import {
    RECEIVE_USER,
    RECEIVE_TOKEN,
    LOGOUT,
} from '../mutation-types'

export default {
    state: {
        user: {},
        token: localStorage.getItem('token_key') || '',
    },
    mutations: {
        [RECEIVE_USER] (state, user) {
            state.user = user
        },
        [RECEIVE_TOKEN] (state, token) {
            console.log(token);
            state.token = token
        },
        [LOGOUT] (state) {
        state.token = null
        },
    },
    actions: {
        saveUser({commit}, user){
            const token = user.token
            localStorage.setItem('token_key',token)
            delete user.token
            commit(RECEIVE_USER,user)
            commit(RECEIVE_TOKEN,token)
        },

        logout({commit}){
            localStorage.removeItem('token_key')
            commit(LOGOUT)
            
        },

        async autoLogin({commit}){
            const result = await reqAutoLogin()
            if(result.code===0){
            const user = result.data
            commit(RECEIVE_USER, user)
            }
        },
    },
    getters: {},
}