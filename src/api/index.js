/* 
包含n个接口请求函数的模块
*/
import ajax from './ajax'

// 1、根据经纬度获取位置详情
export const reqAddress = (longitude, latitude) => ajax(`/position/${latitude},${longitude}`) 

// 2. 获取食品分类列表
export const reqCategorys = () => ajax('/index_category', {
    headers: {
        needToken: true
    }
})

// 3. 根据经纬度获取商铺列表
export const reqShops = ({longitude, latitude}) => ajax('/shops', {
    params: {
        longitude,
        latitude
    },
    headers: {
        needToken: true
    }
})


// 注意~~~！！！@@@@@   4，5，6方法没有放入store监听，而是直接通过main.js主文件引入，组件直接使用了，我觉得这应该是这三个方法只是用于登录验证，没有涉及到数据存储和状态变化；只有在验证通过之后，服务器才会返回用户登陆状态信息，这时我们再进行状态管理。而且，值得注意的是，actions中的方法，不一定全部都要和后台打交道，比如4，5，6方法就没有通过actions状态管理。但是我们可以在组件中，通过dispatch方法将请求到的用户登录信息传给acitons，然后在actions文件中，创建方法（saveUser），用于管理状态

// 4 发送验证码
export const reqSendCode = (phone) => ajax({
    url: '/sendcode',
    params: {
        phone
    }
})

// 5 用户名密码登录
export const reqPwdLogin = ({name,pwd,captcha}) => ajax({
    url: 'login_pwd',
    method: 'POST',
    data: {
        name,
        pwd,
        captcha
    }
})

// 6 手机号验证码登录

export const reqSmsLogin = ({phone,code}) => ajax({
    url: 'login_sms',
    method: 'POST',
    data: {
        phone,
        code
    }
})

// 7 自动登录
export const reqAutoLogin = () => ajax('/auto_login', {
    headers: {
        needToken: true
    }
})

export const reqShopInfo = () => ajax('/info')
export const reqShopGoods = () => ajax('/goods')
export const reqShopRating = () => ajax('/rating')
