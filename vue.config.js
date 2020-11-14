const path = require('path')
const px2rem = require('postcss-px2rem') // postcss的一个插件

module.exports = { // 只能写vue封装的配置

  // runtimeCompiler: true,
  lintOnSave: false, // 关闭EsLint的规则
  css: { // 添加postcss配置
    loaderOptions: {
      postcss: {
        plugins: [
          px2rem({
            remUnit: 37.5   // 设计稿等分后的rem值   375/10
          })
        ]
      }
    }
  },

  configureWebpack: { // 内部写webpack原生配置
    resolve: {
      extensions: ['.js', '.vue', '.json'], // 可以省略的后缀名
      alias: { // 路径别名(简写方式)
        // 'vue$': 'vue/dist/vue.esm.js',  // 表示精准匹配   带vue编译器
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
      }
    }
  },

  devServer: {
    proxy: {
      // 处理以/api开头路径的请求
      '/api': {
        target: 'http://localhost:4000', // 转发的目标地址
        pathRewrite: {
          '^/api' : ''  // 转发请求时去除路径前面的/api
        },
        changeOrigin: true, // 支持跨域, 如果协议/主机也不相同, 必须加上
      },
    }
  }
}

/*  原理图
foo://example.com:8042/over/there?name=ferret#nose
\_/   \______________/\_________/ \_________/ \__/
 |           |            |            |        |
scheme     authority       path        query   fragment
*/


/*  原理
'/api'这个key在http-proxy-middleware中被称为context——用来决定哪些请求需要被target对应的主机地址（这里是http://localhost:4000/api）代理(这个也需要后端配合，在后端的ajax请求返回响应数据时，使用的也必须要是api开头的路径)，它可以是 字符串，含有通配符的字符串，或是一个数组，分别对应于path matching(路径匹配)wildcard path matching(通配符路径匹配)multiple path matching(多路径匹配)，而这里的path指的就是上图所标识的path段。
简言之，这个key就是匹配path的，一旦匹配到符合的path，就会把请求转发的代理主机去，而代理主机的地址就是target字段对应的内容。
那pathRewrit是什么意思呢？意如其名，路径重写。就是把模式（这里是^/api）匹配到的path重写为对应的路径（这里是''，相当于删除了这个匹配到的路径）。除了删除，还有在原有路径上添加一个基础路径，或是改写一个路径的方式，
*/

/* proxy代理服务器分析
  首先我们设置了proxy代理服务器，设置了一个context：/api用于支持可以跨域的请求。proxy可以设置多个代理，也就是可以跨多个域。设置是相同的
  所以在ajax.js中设置了baseURL:/api，这样凡是经过ajax.js发送的请求，第一个路径都是/api，都会被proxy搜索到，都会经过跨域处理；
  经过跨域处理之后，pathRewrite属性可以在发请求之前替换我们添加的/api，可以设置为空字符串，这样请求后台数据的路径就不会出错；也可以添加其他的基础路径（如果有需要的话）。
*/