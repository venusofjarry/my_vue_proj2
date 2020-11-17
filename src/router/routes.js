/*
所有路由配置的数组
*/


// import Msite from '@/pages/MSite/MSite.vue'
// import Order from '@/pages/Order/Order.vue'
// import Profile from '@/pages/Profile/Profile.vue'
// import Search from '@/pages/Search/Search.vue'

/*
  路由组件懒加载：
    1 在打包时路由组件会被单独打包（代码分割：code split）
    2 默认不请求加载通过import函数单独打包的路由组件。当请求需要路由组件时才会被加载
  import 动态引入：
    import(模块路径)
    结果：被引入的模块会被单独打包（代码分割：code split）
  配置的路由组件是函数（返回动态加载的路由组件模块）
    函数开始时是不执行的（也就是页面刚加载完毕，一般不请求加载单独打包的路由组件模块代码）
    当请求对应路径，需要显示组件界面时，才去加载路由组件打包文件（在network中的js中查看打包文件 ）
  作用：
    减少首屏加载所需时间----因为第一次加载的文件相对更少，更节约时间-----显示更快
*/
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