import axios from 'axios'
import qs from 'qs'
import { Toast,MessageBox } from 'mint-ui'
import store from '../vuex/store'
import router from '@/router'

const instance = axios.create({
  baseURL: '/api',
  timeout: 20000
})

instance.interceptors.request.use((config) => {
  if (config.method.toUpperCase()==='POST' && config.data instanceof Object) {
    config.data = qs.stringify(config.data)
  }
  const token = store.state.user.token
  if (config.headers.needToken){
    if(token){
      config.headers['Authorization'] = token
    } else if (router.currentRoute.path === '/login') {
    }else{
      throw new Error('没有token，不发请求')
    }
  }
  return config
})

instance.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if(!error.response){
      if(router.currentRoute.path!=='/login'){
        Toast(error.message)
        router.replace('/login')
      }
    }else{
      if(error.response.status===401){
        store.dispatch('logout')
        if(router.currentRoute.path!=='/login'){
          Toast(error.message)
          router.replace('/login')
        }
      } else if (error.response.status===404) {
        Toast('此资源不存在')
      }
    }

   MessageBox('提示', error.message)
    return new Promise(() => {})
  }
)


export default instance

