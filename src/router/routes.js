const Msite = () => import('@/pages/MSite/MSite.vue')
const Order = () => import('@/pages/Order/Order.vue')
const Profile = () => import('@/pages/Profile/Profile.vue')
const Search = () => import('@/pages/Search/Search.vue')

import Login from '@/pages/Login/Login.vue'
import Shop from '@/pages/Shop/Shop.vue'
import Goods from '@/pages/Shop/Goods.vue'
import Info from '@/pages/Shop/Info.vue'
import Ratings from '@/pages/Shop/Ratings.vue'


export default [
    {
        path:'/msite',
        component: Msite,
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
        name: 'shop',
        path: '/shop/:id',
        props: true,
        component: Shop,
        children: [
            {
                path: 'goods',
               component: Goods
            },
            {
                path: 'ratings',
               component: Ratings
            },
            {
                path: 'info',
               component: Info
            },
            {
                path: '',
                redirect: 'goods'
            }
        ]
    },
    {
        path: '/',
        redirect: '/login'
    }
]