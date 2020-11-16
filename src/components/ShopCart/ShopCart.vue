<template>
    <div>
      <div class="shopcart">
        <div class="content">
          <div class="content-left" @click="toggleShow">
            <div class="logo-wrapper">
              <div class="logo" :class="{highlight: totalCount>0}">
                  <i class="iconfont icon-shopping_cart" :class="{highlight: totalCount>0}"></i>
              </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
            </div>
              <div class="price" :class="{highlight: totalCount>0}">￥{{totalPrice}}</div>
              <div class="desc">另需配送费￥{{info.deliveryPrice}}元</div>
          </div>
        <div class="content-right">
            <div class="pay" :class="payClass">
            {{payText}}
            </div>
        </div>
        </div>
          <transition name="move">

            <!-- 这里的v-show如果改成v-if，则会出现这样一种情况：
                  当我们第一次打开购物车时，可以滑动，后续再打开就不再滑动，为啥？
                  因为显示隐藏是通过类实现的，而v-if在重建标签，初始化时有这个类，但是重建之后就没了
                  所以初始化能滑动，后续就不能再滑动了。
                  这里说一下v-if和v-show的用法区别：
                  只能使用v-if的情况是：当我们使用对象，遍历3层，或者以上的属性时，报了undefined的错误，则需要
                  使用v-if，因为通常有这样一种情况：当我们初始化页面时，有些数据还没有获取到，这时我们不能渲染这个
                  标签，否则会报错：undefined，这是只能使用v-if
                  而有时候我们又必须使用v-show，比如这个组件中的滑动实例，我们必须保证滑动实例所在标签不能重新渲染，否则
                  该标签的类就消失了，导致不能滑动
              -->
              <div class="shopcart-list" v-show="listShow">

                <div class="list-header">
                    <h1 class="title">购物车</h1>
                    <span class="empty" @click="clearCart">清空</span>
                </div>
                <div class="list-content" ref="foods">
                    <ul>
                    <li class="food" v-for="food in cartFoods" :key="food.name">
                        <span class="name">{{food.name}}</span>
                        <div class="price"><span>￥{{food.price}}</span></div>
                        <div class="cartcontrol-wrapper">
                        <cartControl :food="food" class="upLittle"/>
                        </div>
                    </li>
                    </ul>
                </div>
          </div>
          </transition>
      </div>
        <transition name="fade">
            <div class="list-mask" v-show="listShow" @click="toggleShow"></div>
        </transition>
    </div>
</template>

<script type="text/ecmasript-6">
  import {MessageBox} from 'mint-ui'
  import {mapState, mapGetters} from 'vuex'
  import BScroll from 'better-scroll'
  import {CLEAR_CART} from '@/vuex/mutation-types'

  export default {
    data () {
      return {
        isShow: false
      }
    },
    computed: {
      ...mapState({
          cartFoods: state => state.shop.cartFoods || {},
          info: state => state.shop.shop.info || {}
      }),
        // getters不受模块化vuex的写法影响，该咋写还咋写
        ...mapGetters(['totalCount', 'totalPrice']),
        payClass(){
            const {totalPrice} = this
            const {minPrice} = this.info
            return minPrice > totalPrice ? 'not-enough' : 'enough'
        },
        payText () {
          const {totalPrice} = this
          const {minPrice} = this.info
          if (totalPrice===0) {
            return `￥${minPrice}元起送`
          } else if (totalPrice<minPrice) {
            return `还差￥${minPrice-totalPrice}元起送`
          } else {
            return '去结算'
          }
        },
        
        /*
          只要购物车不为空，则购物车显示隐藏只取决于isShow的真假。
          我们要的效果是：如果购物车为空，则隐藏购物车。那我们需要添加一个可以控制：当购物车为空时，隐藏购物车的标记。
          这里我们将isShow和购物车为空放在一起：
          只要当购物车不为空，则永远只由isShow控制（点击显示隐藏）。只要购物车为空，则隐藏购物车，并将isShow设置成false，
          这样一来，购物车为空时，isShow永远都是false，所以不会出现isShow和购物车为空时两者的真假不一致的问题
        */
        listShow(){
          if(this.totalCount === 0){
            this.isShow = false
            return false
          }
          if(this.isShow){
            /*
              这里必须创建单例对象：只能有一个实例对象，因为滑动实例只需要一个，而我们在每次点击显示购物车时，都会创建一个
              或者多个（为什么会创建多个？因为这个listShow计算属性会在我们点击显示隐藏购物车时被多次计算，而我们是在这个
              计算属性中创建这个滑动实例的）
              1 创建前对象不能存在
              2 创建后，保存对象
            */
            this.$nextTick(() => {
              if(!this.scroll){
                this.scroll = new BScroll(this.$refs.foods, {
                click: true
                })
              }else{
                /*
                  当我们已经创建了一个滑动实例，需要判断当前是否需要滑动，因为插件不会自动帮我们判断是否需要滑动，
                  之前我们在shop文件夹中的goods组件中也使用了滑动实例，但是这里不一样，这里每次显示购物车，都需要重新
                  计算是否需要滑动，而goods组件中渲染的固定的商品列表，没有变化，所以那里不需要refresh方法，而这里必须
                  使用
                */
                this.scroll.refresh()
              }
            })
          }

          return this.isShow
        }
    },
    methods: {
      toggleShow(){
        if(this.totalCount>0){
          this.isShow = !this.isShow
        }
      },
      clearCart(){
        messageBox.confirm('确定删除吗？').then(
          () => {
            this.$store.commit('clear_cart')
          }
        )
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight
              background: $green
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #ffffff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transform translateY(-100%)
      &.move-enter-active, &.move-leave-active
        transition all .3s
      &.move-enter, &.move-leave-to
        opacity 0
        transform translateY(0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)

      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 13px

  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-to
      opacity: 0
</style>
