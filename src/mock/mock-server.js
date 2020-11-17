import Mock from 'mockjs'
import data from './data.json'
import shops from './shops.json'

Mock.mock('/api/goods', {code:0,data:data.goods})

Mock.mock('/api/rating', {code:0,data:data.ratings})

Mock.mock('/api/info', {code:0,data:data.info})

Mock.mock(/^\/api\/shop\/\d+$/, function(options){
    const id = options.url.substring(10) 

    const shop = shops.find(shop => shop.id==id) 

    return Mock.mock({
        code: 0,
        data: shop || shops[0] 
    })
})