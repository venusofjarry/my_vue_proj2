/*
所有路由配置的数组
*/


import Msite from '@/pages/MSite/MSite.vue'
import Order from '@/pages/Order/Order.vue'
import Profile from '@/pages/Profile/Profile.vue'
import Search from '@/pages/Search/Search.vue'
import Login from '@/pages/Login/Login.vue'

export default [
    {
        path:'/msite',
        component: Msite,
        // meta是$route的一个属性，默认使用给对象，可以自定义配置
        meta: {
            isFooterShow: true
        }
    },
    {
        path:'/order',
        component: Order,
        meta: {
            isFooterShow: true
        }
    },
    {
        path:'/profile',
        component: Profile,
        meta: {
            isFooterShow: true
        }
    },
    {
        path:'/search',
        component: Search,
        meta: {
            isFooterShow: true
        }
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/',
        redirect: '/login'
    }
]