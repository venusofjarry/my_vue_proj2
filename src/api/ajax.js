/* 
对axio进行2次封装一个能发ajax请求的函数
1. 统一处理请求异常
2. 异步请求成功的数据不是response, 而是response.data
3. 对请求体参数进行urlencode处理, 而不使用默认的json方式(后台接口不支持)
4. 配置请求超时的时间
5. 通过请求头携带token数据
*/
import axios from 'axios'
import qs from 'qs'
import { Toast,MessageBox } from 'mint-ui'
import store from '../vuex/store'
import router from '@/router'
import { message } from 'statuses'

const instance = axios.create({
  // baseURL: 'http://localhost:4000', // 出跨域请求问题
  baseURL: '/api', // 让代理服务器转发请求4000
  timeout: 20000 // 4. 配置请求超时的时间
})

// 添加请求拦截器
instance.interceptors.request.use((config) => {
  // 3. 对请求体参数进行urlencode处理, 而不使用默认的json方式(后台接口不支持)

  if (config.method.toUpperCase()==='POST' && config.data instanceof Object) {
    config.data = qs.stringify(config.data)
  }
  const token = store.state.token
  // 判断此次请求是否需要携带token，比如登录，或者免登录，都需要携带token给后台验证；但是比如搜索就不用登录也可以看。  不是全部的路由都需要token才能看，所以我们才要给请求添加一个请求头属性：needToken，当它为真，说明需要token，那我们就给；反之就不给
  if (config.headers.needToken){
    // 这里不能一棒子打死，如果我不需要token，但是我还是可以看到login页面，这里需要加第二个判断条件：路径是否是login（根路径我也重定向到了login）
    if(token){
      config.headers['Authorization'] = token
      // 这里的判断还是比较奇怪，以后有时间再优化
    } else if (router.currentRoute.path === '/login') {
    }else{
      // 获取token失败，抛出错误,这里的错误会被相应拦截器获取，显示
      throw new Error('没有token，不发请求')
    }
  }
  return config
})

// 添加响应拦截器    (这里注意一下，当我输入localhost:8000时，由于这里的路径判别都是以login为准，所以这个根路径也会报没有token的错，我们可以添加上根路径，这样就好了)
instance.interceptors.response.use(
  response => {
    // return response
    // 2. 异步请求成功的数据不是response, 而是response.data
    return response.data
  },
  error => {
    // 第一种：没有token直接发请求导致错误(或者发了请求但是发token失败了，不过这种情况很少)
    if(!error.response){
      // currentRoute是router的一个属性，指向当前路由地址
      if(router.currentRoute.path!=='/login'){
        Toast(error.message)
        router.replace('/login')
      }
    }else{
      // 第二种：登陆失效
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
    /*
    1. 统一处理请求异常
       第一种：没有token直接发请求导致错误
       第二种：token失效发请求导致错误
       第三种：404错误
       第四种：其他
    */


   MessageBox('提示', error.message)
    return new Promise(() => {}) // 返回一个pending状态的promise => 中断promie链
  }
)


export default instance

