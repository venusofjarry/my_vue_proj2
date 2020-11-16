<template>
  <section class="msite">
    <!--首页头部-->
    <Header :title="address.name || '定位中...'">
      <span class="header_search" slot="left">
        <i class="iconfont icon-sousuo"></i>
      </span>
      <span class="header_login" slot="right">
        <span class="header_login_text">登录|注册</span>
      </span>
    </Header>
    <!--首页导航-->
    <nav class="msite_nav">
      <div ref="sc1" class="swiper-container">
                <div class="swiper-wrapper">
                  <!-- 下面有两个数组方法可以使用，任用其一即可 -->
          <div class="swiper-slide" v-for="(cs, index) in catrgorysArr2" :key="index">
            <div class="link_to_food" v-for="(c, index) in cs" :key="index">
              <div class="food_container">
                <img :src="'https://fuss10.elemecdn.com' + c.image_url">
              </div>
              <span>{{c.title}}</span>
            </div>
          </div>
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
      </div>
    </nav>
    <!--首页附近商家-->
    <div class="msite_shop_list">
      <div class="shop_header">
        <i class="iconfont icon-xuanxiang"></i>
        <span class="shop_header_title">附近商家</span>
      </div>
      <div class="shop_container">
        <ul class="shop_list" v-if="shops.length>0">
          <li class="shop_li border-1px" v-for="shop in shops" :key="shop.id" 
          @click="$router.push(`/shop/${shop.id}`)">

          <!-- 在调用push进行路由跳转时（需要携带参数）  这里是面试重点
            1 @click="$router.push(`/shop/${shop.id}`)" 
              直接路径path：自动跳转有效

            2 @click="$router.push({
              name: 'shop',
              params: {
                id: shop.id
              }
              })">
              配置对象指定name/params：自动跳转无效

              自动跳转就是路由设置redirect
              直接路径path就是直接在后面添加参数，配置对象就是在push中配置数据
          -->
            <a>
              <div class="shop_left">
                <!-- 注意，这里的图片地址要看/有没有衔接好，不要重复/符号或者丢掉/符号，这样的话都拿不到图片 -->
                <img class="shop_img" :src="'https://fuss10.elemecdn.com' + shop.image_path">
              </div>
              <div class="shop_right">
                <section class="shop_detail_header">
                  <h4 class="shop_title ellipsis">{{shop.name}}</h4>
                  <ul class="shop_detail_ul">
                    <li class="supports" v-for="(support, index) in shop.supports" :key="index">{{support.icon_name}}</li>
                  </ul>
                </section>
                <section class="shop_rating_order">
                  <section class="shop_rating_order_left">
                    <Star :score="shop.rating" :size="24"/>
                    <div class="rating_section">
                      {{shop.rating}}
                    </div>
                    <div class="order_section">
                      月售{{shop.recent_order_num}}单
                    </div>
                  </section>
                  <section class="shop_rating_order_right">
                    <span class="delivery_style delivery_right">{{shop.delivery_mode.text}}</span>
                  </section>
                </section>
                <section class="shop_distance">
                  <p class="shop_delivery_msg">
                    <span>¥{{shop.float_minimum_order_amount}}起送</span>
                    <span class="segmentation">/</span>
                    <span>{{shop.piecewise_agent_fee.tips}}</span>
                  </p>
                </section>
              </div>
            </a>
          </li>
        </ul>
        <!-- 下面的ul用于数据获取展示之前的类似加载页面，这样用户体验度更好 -->
        <ul v-else>
          <li>
            <img src="./images/shop_back.svg" alt="loading...">
          </li>
          <li>
            <img src="./images/shop_back.svg" alt="loading...">
          </li>
          <li>
            <img src="./images/shop_back.svg" alt="loading...">
          </li>
          <li>
            <img src="./images/shop_back.svg" alt="loading...">
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>


<script type="text/ecmasript-6">
import Swiper from 'swiper'
// 下面这个css文件老是找不到，不知道为啥，干脆拿出来算了
import './swiper-bundle.css'
import _ from 'lodash'
// 按需引入，这里只需要chunk     注意，lodash.js是将lodash中所有方法汇总了，它内部引入了很多js文件，其中包括chunk，我们可以使用/的方法按需访问
import chunk from 'lodash/chunk'
import {mapState} from 'vuex'

  export default{
    computed: {
      ...mapState({
        address: state => state.msite.address,
        categorys: state => state.msite.categorys,
        shops: state => state.msite.shops
      }),

      // 一维数组变二维数组 方法一：自定义函数
      /*
        第一步 先将空的小数组放入空的大数组，这样我操作小数组的同时，大数组中的小数组也在变化，因为操作的就是同一个小数组
        第二步 将请求过来的数组的元素推入小数组中
        第三步 判断小数组中的元素是否满8个，如果是，则重新创建一个小数组，这里要注意，我重新创建的小数组，不会覆盖原来的小数组，打个比方：
        let arr = [];   arr.push(1);  arr = [];
        这时，这个arr就不是原来那个arr了，通过arr = []这个操作，arr已经重新指向了一个全新的空数组，原来的被推入数字1的数组和重新指向的那个数组不是同一个。
      */
      catrgorysArr () {
        const bigArr = [];
        let smallArr = [];
        this.categorys.forEach(element => {
          // 第一步
          if (smallArr.length === 0) {
            bigArr.push(smallArr)
          }
          // 第二步
          smallArr.push(element)
          // 第三步
          if (smallArr.length === 8) {
            smallArr = []
          }
        });
        return bigArr
      },

      // 一维数组变二维数组 方法二：使用lodash
      catrgorysArr2 () {
        return _.chunk(this.categorys,8)
      }
    },


    async mounted(){
      // // 解决swiper轮播不正常的方法方法2：dispatch回调
      // this.$store.dispatch('getCategorys', () => {
      //   // $nextTick方法将回调延迟到下次 DOM 更新循环之后执行，在修改数据之后立即使用它，然后等待 下一次DOM 更新。
      //   // 在dom更新循环之后，界面已经更新了，那么我们就可以使用swiper方法渲染轮播效果。
      //   this.$nextTick(() => {

      //     // swiper对象必须要在列表数据显示之后才能创建
      //     // new Swiper(this.$refs.sc1, {
      //     loop: true, // 循环轮播（无缝轮播）
      //     // 如果需要分页器(我把swiper-bundle.css文件直接拿出来用了，不在node_modules文件中找)
      //       pagination: {
      //       el: '.swiper-pagination'
      //       }
      //     })
      //   })
      // })
      this.$store.dispatch('getShops')

      // 解决swiper轮播不正常的方法方法3:利用dispatch返回一个promise对象，异步操作(then或者async await都行)
      await this.$store.dispatch('getCategorys')
      .then(() => {
        new Swiper(this.$refs.sc1, {
          loop: true, // 循环轮播（无缝轮播）
          // 如果需要分页器(用着用着就不见了，找不着，还是自己写轮播算了)
          pagination: {
          el: '.swiper-pagination'
          }
        })
      });
    },
    

    // 解决swiper轮播不正常的方法方法1：watch+$nextTick
    // watch: {
    //   categorys () {
    //     // $nextTick方法将回调延迟到下次 DOM 更新循环之后执行，在修改数据之后立即使用它，然后等待 下一次DOM 更新。
    //     // 在dom更新循环之后，界面已经更新了，那么我们就可以使用swiper方法渲染轮播效果。
    //     this.$nextTick(() => {
    //       // swiper对象必须要在列表数据显示之后才能创建
    //      // new Swiper('.swiper-container', {
    //       // new Swiper(this.$refs.sc1, {
    //       loop: true, // 循环轮播（无缝轮播）
    //       // 如果需要分页器(用着用着就不见了，找不着，还是自己写轮播算了)
    //       pagination: {
    //       el: '.swiper-pagination'
    //     }
    //   })
    //     })
    //   }
    // }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixins.styl'
  .msite  //首页
    width 100%
    .header
      background-color #02a774
      position fixed
      z-index 100
      left 0
      top 0
      width 100%
      height 45px
      .header_search
        position absolute
        left 15px
        top 50%
        transform translateY(-50%)
        width 10%
        height 50%
        .icon-sousuo
          font-size 25px
          color #fff
      .header_title
        position absolute
        top 50%
        left 50%
        transform translate(-50%, -50%)
        width 50%
        color #fff
        text-align center
        .header_title_text
          font-size 20px
          color #fff
          display block
      .header_login
        font-size 14px
        color #fff
        position absolute
        right 15px
        top 50%
        transform translateY(-50%)
        .header_login_text
          color #fff
    .msite_nav
      bottom-border-1px(#e4e4e4)
      margin-top 45px
      height 200px
      background #fff
      .swiper-container
        width 100%
        height 100%
        .swiper-wrapper
          width 100%
          height 100%
          .swiper-slide
            display flex
            flex-wrap wrap
            .link_to_food
              width 25%
              .food_container
                display block
                width 100%
                text-align center
                padding-bottom 10px
                font-size 0
                img
                  display inline-block
                  width 50px
                  height 50px
              span
                display block
                width 100%
                text-align center
                font-size 13px
                color #666
        .swiper-pagination
          >span.swiper-pagination-bullet-active
            background #02a774
    .msite_shop_list
      top-border-1px(#e4e4e4)
      margin-top 10px
      background #fff
      .shop_header
        padding 10px 10px 0
        .shop_icon
          margin-left 5px
          color #999
        .shop_header_title
          color #999
          font-size 14px
          line-height 20px
      .shop_container
        margin-bottom 50px
        .shop_list
          .shop_li
            bottom-border-1px(#f1f1f1)
            width 100%
            >a
              clearFix()
              display block
              box-sizing border-box
              padding 15px 8px
              width 100%
              .shop_left
                float left
                box-sizing border-box
                width 23%
                height 75px
                padding-right 10px
                .shop_img
                  display block
                  width 100%
                  height 100%
              .shop_right
                float right
                width 77%
                .shop_detail_header
                  clearFix()
                  width 100%
                  .shop_title
                    float left
                    width 200px
                    color #333
                    font-size 16px
                    line-height 16px
                    font-weight 700
                    &::before
                      content '品牌'
                      display inline-block
                      font-size 11px
                      line-height 11px
                      color #333
                      background-color #ffd930
                      padding 2px 2px
                      border-radius 2px
                      margin-right 5px
                  .shop_detail_ul
                    float right
                    margin-top 3px
                    .supports
                      float left
                      font-size 10px
                      color #999
                      border 1px solid #f1f1f1
                      padding 0 2px
                      border-radius 2px
                .shop_rating_order
                  clearFix()
                  width 100%
                  margin-top 18px
                  margin-bottom 8px
                  .shop_rating_order_left
                    float left
                    color #ff9a0d
                    .rating_section
                      float left
                      font-size 10px
                      color #ff6000
                      margin-left 4px
                    .order_section
                      float left
                      font-size 10px
                      color #666
                      transform scale(.8)
                  .shop_rating_order_right
                    float right
                    font-size 0
                    .delivery_style
                      transform-origin 35px 0
                      transform scale(.7)
                      display inline-block
                      font-size 12px
                      padding 1px
                      border-radius 2px
                    .delivery_left
                      color #fff
                      margin-right -10px
                      background-color #02a774
                      border 1px solid #02a774
                    .delivery_right
                      color #02a774
                      border 1px solid #02a774
                .shop_distance
                  clearFix()
                  width 100%
                  font-size 12px
                  .shop_delivery_msg
                    float left
                    transform-origin 0
                    transform scale(.9)
                    color #666
                  .segmentation
                    color #ccc
        
</style>