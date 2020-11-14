/*
所有路由配置的数组
*/


import Msite from '@/pages/MSite/MSite.vue'
import Order from '@/pages/Order/Order.vue'
import Profile from '@/pages/Profile/Profile.vue'
import Search from '@/pages/Search/Search.vue'
import Login from '@/pages/Login/Login.vue'
import Shop from '@/pages/Shop/Shop.vue'
import Goods from '@/pages/Shop/Goods.vue'
import Info from '@/pages/Shop/Info.vue'
import Rating from '@/pages/Shop/Rating.vue'

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
        path: '/shop',
        component: Shop,
        children: [
            {
                // 子路由中要么添加父路由的路径，要么去掉/，否则该子路由就在根路径下了。建议添加上父路由，帮助理解
                path: '/shop/goods',
               component: Goods
            },
            {
                path: '/shop/rating',
               component: Rating
            },
            {
                path: '/shop/info',
               component: Info
            },
            {
                path: '',
                redirect: '/shop/goods'
            }
        ]
    },
    {
        path: '/',
        redirect: '/login'
    }
]