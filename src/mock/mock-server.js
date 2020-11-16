// 使用mockjs提供mock接口数据
import Mock from 'mockjs'
import data from './data.json'
import shops from './shops.json'

// 定义mock接口;  为啥要在路径前面加上/api，因为我们在vue.config.js中配置proxy代理服务器时，proxy会统一给要跨域的请求添加/api，所以这里必须要加上/api，才能匹配到对应的请求，模拟后台发数据
Mock.mock('/api/goods', {code:0,data:data.goods})

// rating是路由地址，ratings是mock中的json数据，不要搞混了
Mock.mock('/api/rating', {code:0,data:data.ratings})

Mock.mock('/api/info', {code:0,data:data.info})

// 根据请求的id参数返回对应的商家数据
Mock.mock(/^\/api\/shop\/\d+$/, function(options){ // options返回一个对象，其中包含url(客户端的请求地址)，type(请求方式)，body(请求体，如果是post请求，这里有值；如果是get请求，请求参数在url中，body为null)

    const id = options.url.substring(10) // 找到请求的params参数

    const shop = shops.find(shop => shop.id==id) //根据id找到json文件中对应的动态数据

    // 根据请求路径中携带的params参数返回一个动态数据
    return Mock.mock({
        code: 0,
        data: shop || shops[0] // 因为shops中只放了一个数组，所以取第一个
    })
})