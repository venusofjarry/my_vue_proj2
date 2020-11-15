<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="left">
        <ul ref="leftUl">
          <li class="menu-item" v-for="(good,index) in goods" :key="index" :class="{current: index === currentIndex}" @click="clickItem(index)">
            <span class="text bottom-border-1px">
              <img class="icon" :src="good.icon" v-if="good.icon">
              {{good.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="right">
        <ul ref="rightUl">
          <li class="food-list-hook" v-for="(good,index) in goods" :key="index">
            <h1 class="title">{{good.name}}</h1>
            <ul>
              <li class="food-item bottom-border-1px" v-for="(food,index) in good.foods" :key="index" @click="showFood(food)">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span></div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <CartControl :food="food"/>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!-- 组件标签对象就是组件对象，子传父数据时，一般都要用到这个：使用ref标识子组件，然后通过ref属性取子组件中的数据 -->
      <Food :food="food" ref="food"/>
    </div>
</div>

</template>

<script type="text/ecmasript-6">
import { mapState } from 'vuex'
import BScroll from 'better-scroll'
import Food from '@/components/Food/Food'
  export default{
    components: {
      Food
    },
    data(){
      return {
        scrollY: 0,
        tops:[],
        food:{}
      }
    },

    computed: {
      ...mapState(['goods']),
      // currentIndex用于确定左侧列表该显示哪个li，它返回对应的数组下标
      currentIndex(){
        const {tops,scrollY} = this
        const index = tops.findIndex((top, index) => {return scrollY>=top && scrollY < tops[index+1]})
        /*
          说明：if判断为什么要加    && this.leftScroll
          因为代码的执行顺序问题：初始化滑动组件放在了watch钩子中，是在页面渲染完成之后，数据改变之前被触发，而computed属性则是在页面渲染期间，需要被初始化而被执行，那就导致一个问题：滑动组件实例还没被创建就已经被使用了。如果不加，又使用了this.leftScroll，是会报错的。
        */
        if(index !== this.index && this.leftScroll){
          this.index = index
          const li = this.$refs.leftUl.children[index]
          this.leftScroll.scrollToElement(li,300)
        }
        return index
      }
    },
    methods: {
      // 初始化滑动  加一个下划线，说明这些方法不代表事件
      _initScroll(){
        this.leftScroll = new BScroll(this.$refs.left, {
          click: true
        })
        this.rightScroll = new BScroll(this.$refs.right, {
          probeType: 1 // 值为1：非实时触摸   值为2：实时触摸但不包括惯性触摸   值为3：实时+惯性+编码（点击左侧，右侧滑动到指定位置）
        })
        // 给右侧绑定滑动监听
        this.rightScroll.on('scroll',({x,y})=>{
          this.scrollY = Math.abs(y)
        })
        // 给右侧绑定滑动结束监听（因为不支持惯性滑动，所以需要这个，因为惯性滑动耗费性能）
        this.rightScroll.on('scrollEnd',({x,y})=>{
          this.scrollY = Math.abs(y)
        })
      },

      // 初始化tops数组
      _initTops(){
        // 这里自己定义tops，以免污染data中的tops
        let tops = []
        let top = 0
        tops.push(top)
        // 这里有一个疑问：这样读取
        const lis = Array.prototype.slice.call(this.$refs.rightUl.children)
        lis.forEach(li => {
          top += li.clientHeight
          tops.push(top)
        })
        this.tops = tops
        // console.log('tops',tops);
      },
      // scrollTo方法改变了右侧列表的位置，由于右侧绑定了监听，所以移动时就触发了滚动结束的监听事件，改变了scrollY的值，而scrollY的值被改变，又触发了计算属性currentIndex（因为该属性最后返回scrollY），
      clickItem(index){
        const top = this.tops[index]
        // 如果没有这一步，那么先滚动右侧列表，然后监听事件被触发，更新scrollY值，导致触发currentIndex方法更新，最后改变左侧li的显示。有了这一步，我们先改变scrollY的值，所以先左侧动，然后右侧动，这样视觉效果好
        this.scrollY = top
        this.rightScroll.scrollTo(0,-top,300)

      },
      showFood(food){
        this.food = food
        this.$refs.food.toggleShow()
      }
    },
    watch: {
      // 需要等到goods数据全部渲染完之后才new滑动组件的实例，这样才会有效果，不能直接在mounted钩子中使用。之前也使用过watch用来监视状态，我记得是在login组件使用的，还有另外两种方法：第一，直接使用dispatch方法返回的promise对象，异步获取数据。第二种是利用dispatch方法，我们在它的回调函数中new实例，也可以达到异步获取数据的目的
      goods(){
        this.$nextTick(() => {
          this._initScroll()
          this._initTops()
        })
      }
    }
  }
</script>

<!-- 功能需求实现
  1 滑动右侧列表，左侧当前分类项变化
  2 点击左侧分类项，右侧列表滑动到对应位置

  设计一个当前分类的下标： currentIndex
    1）右侧列表滑动的Y轴坐标：scrollY，让它在滑动过程中不断变化
    2）右侧每个分类<li>的top值的数组tops：第一次初始化统计完值之后，就不再改变。后续我们只是用scrollY和tops数组的元素进行比对，然后找出相等的值的下标（这里使用数组方法:findIndex，返回匹配元素的下标），这个下标就是 右侧指定商品 对应的 左侧分类元素的 下标值，找到位置就好办了，将这个元素添加上样式即可。这里用
 -->


<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .goods
    display: flex
    position: absolute
    top: 225px
    bottom: 46px
    width: 100%
    background: #fff;
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          color: $green
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
