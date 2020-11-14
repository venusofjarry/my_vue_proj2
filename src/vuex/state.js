export default {
    latitude: 40.10038,  // 经度
    longitude: 116.36867,  // 纬度
    address: {}, 
    categorys: [],
    shops: [],
    // 注意，一般空对象要比null好，因为我们可以使用user.的形式添加属性；一旦使用了null，这种操作立马报错
    user: {},
    token: localStorage.getItem('token_key') || '',
    goods: [],
    rating: [],
    info: {}
}