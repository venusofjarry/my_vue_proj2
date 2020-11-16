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
        // 注意，一般空对象要比null好，因为我们可以使用user.的形式添加属性；一旦使用了null，这种操作立马报错
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
    },
    getters: {},
}