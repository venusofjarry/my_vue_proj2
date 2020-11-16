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
import Ratings from '@/pages/Shop/Ratings.vue'

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
        name: 'shop',
        path: '/shop/:id',
        props: true,  // 将所有params参数转换成标签属性传递给子路由组件
        // props: toRoute => ({id: toRoute.params.id}) 
        component: Shop,
        children: [
            {
                // 子路由中要么添加父路由的路径，要么去掉/，否则该子路由就在根路径下了。建议添加上父路由，帮助理解
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