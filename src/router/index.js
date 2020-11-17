/* 
向外暴露路由器对象模块
*/
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '@/vuex/store'

// 声明使用vue插件
Vue.use(VueRouter)

const router = new VueRouter({

  mode: 'history', // 路由路径没有#

  // 项目中所有路由
  routes
})
 // 功能：进入a/b必须登录，如果没有登录自动跳转到登录
const paths = ['/a','/b']  // 所有需要进行登录检查的路由路径数组

router.beforeEach((to,from,next) => {
  const path = to.path
  if(paths.indexOf(path)!==-1){
    if(!store.state.user.token){
      console.log('没有token，请先登录');
      return next('/login')
    }
  }
  next()
})

export default router