import ajax from './ajax'

export const reqAddress = (longitude, latitude) => ajax(`/position/${latitude},${longitude}`) 

export const reqCategorys = () => ajax('/index_category', {
    headers: {
        needToken: true
    }
})

export const reqShops = ({longitude, latitude}) => ajax('/shops', {
    params: {
        longitude,
        latitude
    },
    headers: {
        needToken: true
    }
})


export const reqSendCode = (phone) => ajax({
    url: '/sendcode',
    params: {
        phone
    }
})

export const reqPwdLogin = ({name,pwd,captcha}) => ajax({
    url: 'login_pwd',
    method: 'POST',
    data: {
        name,
        pwd,
        captcha
    }
})


export const reqSmsLogin = ({phone,code}) => ajax({
    url: 'login_sms',
    method: 'POST',
    data: {
        phone,
        code
    }
})

export const reqAutoLogin = () => ajax('/auto_login', {
    headers: {
        needToken: true
    }
})

export const reqShopInfo = () => ajax('/info')
export const reqShopGoods = () => ajax('/goods')
export const reqShopRating = () => ajax('/rating')
export const reqShop = (id) => ajax('/shop/' + id)

reqShop(479)
