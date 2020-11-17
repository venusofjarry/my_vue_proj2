import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '@/vuex/store'

Vue.use(VueRouter)

const router = new VueRouter({

  mode: 'history',

  routes
})

const paths = ['/a','/b']

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