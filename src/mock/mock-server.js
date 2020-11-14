// 使用mockjs提供mock接口数据
import Mock from 'mockjs'
import data from './data.json'

// 定义mock接口;  为啥要在路径前面加上/api，因为我们在vue.config.js中配置proxy代理服务器时，proxy会统一给要跨域的请求添加/api，所以这里必须要加上/api，才能匹配到对应的请求，模拟后台发数据
Mock.mock('/api/goods', {code:0,data:data.goods})

// 这里有可能出错
Mock.mock('/api/rating', {code:0,data:data.ratings})

// 
Mock.mock('/api/info', {code:0,data:data.info})