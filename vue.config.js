const path = require('path')
const px2rem = require('postcss-px2rem')

module.exports = {
    // lintOnSave: false, // 关闭eslint规则
    // 这个css不是webpack原生的，不写在configureWebpack里面
    css: { // 添加postcss配置
        loaderOptions: {
          postcss: {
            plugins: [
              // 配置postcss-px2rem
              px2rem({
                remUnit: 37.5   // 设计稿等分后的rem值   375/10
              })
            ]
          }
        }
      },    

  configureWebpack:{ // 只能写webpack原生配置
    resolve: {
      extensions: ['.js', '.vue', '.json'], // 可以省略的后缀名
      alias: { // 路径别名(简写方式)
          // 表示精准匹配   带vue编译器
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
      }
    }
  },
  devServer:{
    proxy:{
            // 处理以/api开头路径的请求
      '/api': 'http://localhost:4000',   // http://localhost:4000/api/search/users
      '/api': {
        target: 'http://localhost:4000', // 转发的目标地址
        pathRewrite: {
          '^/api' : ''  // 转发请求时去除路径前面的/api
        },
        changeOrigin: true // 支持跨域，如果协议/主机也不相同必须加上
      }
    }
  }
}