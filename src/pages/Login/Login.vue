<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on: isShowSms}" @click="isShowSms=true">短信登录</a>
          <a href="javascript:;" :class="{on: !isShowSms}" @click="isShowSms=false">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form>
          <!-- 第二步：form表单有两个div，使用isShowSms控制显示和隐藏 -->
          <div :class="{on: isShowSms}">
            <section class="login_message">
              <!-- 第三步：创建两个变量phone和isRightPhone，分别用来获取电话输入和控制验证码发送的状态：首先获取到数据，然后进行判断，如果不合法，则设置disabled属性为true；如果合法，则设置disabled属性为false，并且高亮获取验证码字样，最后，在数据合法的前提下创建点击事件，发送验证码 -->
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone" name="phone" v-validate="'required|mobile'">
               <!-- 在已经有了class属性之后，我们还可以通过绑定符号添加另外的样式，比如这里，初始化样式是get_verification，后面通过绑定样式添加right_phone_number，也就是号码符合验证规则之后，获取验证码字样变成高亮显示 -->
              <button :disabled="!isRightPhone || computeTime>0" class="get_verification" 
                  :class="{right_phone_number: isRightPhone}" @click.prevent="sendCode">
                    {{computeTime>0 ? `短信已发送(${computeTime}s)` : '发送验证码'}}
              </button>
              <span style="color: red;" v-show="errors.has('phone')">{{ errors.first('phone') }}</span>
            </section>
            <section class="login_verification">
              <input type="text" maxlength="8" placeholder="验证码"
                v-model="code" name="code" v-validate="{required: true,regex: /^\d{6}$/}">
              <span style="color: red;" v-show="errors.has('code')">{{ errors.first('code') }}</span>
            </section>
          </div>
          <div :class="{on: !isShowSms}">
            <section>
              <section class="login_message">
                <input type="text" placeholder="用户名"
                  v-model="name" name="name" v-validate="'required'">
                <span style="color: red;" v-show="errors.has('name')">{{ errors.first('name') }}</span>
              </section>
              <!-- 第四步 控制密码的显示隐藏：首先创建一个控制显示隐藏密码的状态值：isShowPwd，用三目表达式控制type属性，其次设置button的类：on和off，最后添加点击事件，让其不断重复显示隐藏（通过控制状态值isShowPwd） -->
              <section class="login_verification">
                <input :type="isShowPwd ? 'text' : 'password'" placeholder="密码" 
                   v-model="pwd" name="pwd" v-validate="'required'">
                <div class="switch_button" :class="isShowPwd ? 'on' : 'off'" @click="isShowPwd = !isShowPwd">
                  <div class="switch_circle" :class="{right: isShowPwd}"></div>
                  <span class="switch_text">{{isShowPwd ? 'abc' : ''}}</span>
                </div>
                <span style="color: red;" v-show="errors.has('pwd')">{{ errors.first('pwd') }}</span>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码"
                  v-model="captcha" name="captcha" v-validate="{required: true,regex: /^[0-9a-zA-Z]{4}$/}">
                <!-- 当前发送是一个跨域的http请求，利用的代理服务器proxy跨域(不是ajax请求) ，通过改变img标签的src路径，达到更新验证码的效果。这里有点像jsonp，jsonp是通过script标签的src属性，这个属性不受同源策略的影响-->
                <img class="get_verification" src="http://localhost:4000/captcha" 
                  alt="captcha" @click="updateCaptcha" ref="captcha">
                <!-- 原本404, 利用代理服务器转发请求4000的后台接口 -->
                <!-- <img class="get_verification" src="/api/captcha" alt="captcha"> -->
                <span style="color: red;" v-show="errors.has('captcha')">{{ errors.first('captcha') }}</span>
              </section>
            </section>
          </div>
          <button class="login_submit" @click.prevent="login">login</button>
        </form>
        <a href="javascript:;" class="about_us">aboutUs</a>
      </div>
      <a href="javascript:" class="go_back" @click="$router.replace('/profile')">
        <i class="iconfont icon-jiantou2"></i>
      </a>

      <button @click="toggleLanguage">切换语言</button>
    </div>
  </section>
  
</template>

<script type="text/ecmascript-6">
  import { Toast, MessageBox } from 'mint-ui'
  // 在main主文件中设置了$API之后，就不用在这里引入了，我们可以通过$API拿到api中的函数了
  // import {reqSendCode,reqPwdLogin,reqSmsLogin} from '../../api'
  export default {
    name: 'Login',
    data () {
      return {
        isShowSms: false, // true: 显示短信登陆界面,  false: 显示密码登陆界面
        phone: '', // 手机号
        code: '', // 短信验证码
        name: '', // 用户名
        pwd: '', // 密码
        captcha: '', // 图形验证码
        computeTime: 0, // 计时剩余时间
        isShowPwd: false, // 是否显示密码
      }
    },

    computed: {
      // 是否是一个正确的手机号
      isRightPhone () {
        return /^1\d{10}$/.test(this.phone)
      }
    },

    methods: {
      async sendCode () {
        // 进行倒计时效果显示
        this.computeTime = 10
        const intervalId = setInterval(() => {
          this.computeTime--
          // 当我们设置停止倒计时，将computeTime设置成0了，那这里就要改为this.computeTime<=0，判断：当发送验证码失败之后，computeTime重置成0，下一秒就会变成-1，这时就需要清除定时器
          if (this.computeTime<=0) {
            // 在关闭定时器之前，需要重置computeTime，否则在第一登录时会发生错误，因为computeTime的值是-1（随后会执行sendCode函数，将computeTime的值重置为10，问题就出在第一次）
            this.computeTime = 0
            clearInterval(intervalId)
          }
        }, 1000);

        // 发请求获取验证码
        const result = await this.$API.reqSendCode(this.phone)
        if (result.code===0) {
          Toast('验证码短信已发送');
        } else {
          // 如果验证失败，停止倒计时
          this.computeTime = 0
          MessageBox('提示', result.msg || '发送失败');
        }
      },

      async login () {
        // 进行前台表单验证
        let names
        if (this.isShowSms) {
          names = ['phone', 'code']
        } else {
          names = ['name', 'pwd', 'captcha']
        }

        const success = await this.$validator.validateAll(names) // 对指定的所有表单项进行验证
        // 如果验证通过, 发送登陆的请求
        let result
        if (success) {
          const {isShowSms, phone, code, name, pwd, captcha} = this
          if (isShowSms) {
            // 短信登陆
            result = await this.$API.reqSmsLogin({phone, code})
            // 不管手机登录成功与否，都停止倒计时，因为如果不停止计时器，会造成内存泄漏，但是我们这里
            this.computeTime = 0
          } else {
            // 密码登陆
            result = await this.$API.reqPwdLogin({name, pwd, captcha})
            this.updateCaptcha() // 更新图形验证码
            this.captcha = ''
          }

          // 根据请求的结果, 做不同响应处理
          if (result.code===0) {
            const user = result.data
            // 将user保存到vuex的state.  注意，这里如果使用{user}，则actions.js就不用解构user了，反之亦然
            this.$store.dispatch('saveUser', user) // 将user和token保存到state, 将token保存local

            // 跳转到个人中心(有一个疑问：为啥路由跳转要放在前端而不是后端服务器呢？？)
            this.$router.replace({path: '/profile'})
          } else {
            MessageBox('提示', result.msg)
          }
        }
      },

      updateCaptcha () {
        // 在不更新login路由对应的页面的情况下，刷新验证码，因为如果不更新路径，浏览器默认使用的缓存而非向服务器发送请求：这个和解决ie强缓存很相似
        this.$refs.captcha.src = 'http://localhost:4000/captcha?time=' + Date.now()
      },

      toggleLanguage () {
        // 根据当前语言得到新的语言
        const locale = this.$i18n.locale==='en' ? 'zh_CN' : 'en'
        // 指定新的语言
        this.$i18n.locale = locale
        // 将新的语言保存到local
        localStorage.setItem('locale_key', locale)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixins.styl'
  .loginContainer
      width 100%
      height 100%
      background #fff
      .loginInner
        padding-top 60px
        width 80%
        margin 0 auto
        .login_header
          .login_logo
            font-size 40px
            font-weight bold
            color #02a774
            text-align center
          .login_header_title
            padding-top 40px
            text-align center
            >a
              color #333
              font-size 14px
              padding-bottom 4px
              &:first-child
                margin-right 40px
              &.on
                color #02a774
                font-weight 700
                border-bottom 2px solid #02a774
        .login_content
          >form
            >div
              display none
              &.on
                display block
              input
                width 100%
                height 100%
                padding-left 10px
                box-sizing border-box
                border 1px solid #ddd
                border-radius 4px
                outline 0
                font 400 14px Arial
                &:focus
                  border 1px solid #02a774
              .login_message
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .get_verification
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  border 0
                  color #ccc
                  font-size 14px
                  background transparent
                  &.right_phone_number
                    color black
              .login_verification
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .switch_button
                  font-size 12px
                  border 1px solid #ddd
                  border-radius 8px
                  transition background-color .3s,border-color .3s
                  padding 0 6px
                  width 30px
                  height 16px
                  line-height 16px
                  color #fff
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  &.off
                    background #fff
                    .switch_text
                      float right
                      color #ddd
                  &.on
                    background #02a774
                  >.switch_circle
                    //transform translateX(27px)
                    position absolute
                    top -1px
                    left -1px
                    width 16px
                    height 16px
                    border 1px solid #ddd
                    border-radius 50%
                    background #fff
                    box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                    transition transform .3s
                    &.right
                      transform translateX(27px)
              .login_hint
                margin-top 12px
                color #999
                font-size 14px
                line-height 20px
                >a
                  color #02a774
            .login_submit
              display block
              outline none
              width 100%
              height 42px
              margin-top 30px
              border-radius 4px
              background #4cd96f
              color #fff
              text-align center
              font-size 16px
              line-height 42px
              border 0
          .about_us
            display block
            font-size 12px
            margin-top 20px
            text-align center
            color #999
        .go_back
          position absolute
          top 5px
          left 5px
          width 30px
          height 30px
          >.iconfont
            font-size 20px
            color #999
      
</style>
