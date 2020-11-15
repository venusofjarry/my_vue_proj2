<template>
  <div class="cartcontrol">
    <!-- 这里的transition需要优化，太丑了,原因是food.count没有添加显示隐藏的效果，所以当food.count先消失，但左边的减数量的标签还在，所以会导致左边的标签先往右边移动一些距离，然后消失。我们可以不隐藏标签，就让它这样，总之比这个效果好 -->
    <transition name="fade">
      <div class="iconfont icon-remove_circle_outline" v-if="food.count>0" @click.stop="updateFoodCount(false)"></div>
    </transition>
    <div class="cart-count" v-if="food.count>0">{{food.count}}</div>
    <div class="iconfont icon-add_circle" @click.stop="updateFoodCount(true)"></div>
  </div>
</template>

<script type="text/ecmasript-6">
import {throttle} from 'lodash' //该方法用于节流（在设置的时间段内多次点击只执行最后一次）个人感觉不不好用
  export default{
    props: {
      food: Object
    },
    methods: {
      // updateFoodCount: throttle(function(isAdd){
      //   /*
      //     1 我们不应该直接更新food（this.food = food），因为food数据是Foods组件的数据；我们应该在状态中改变数据
      //     2 初始化时，count是undefined
      //   */
      //     this.$store.dispatch('updateFoodCount', {isAdd,food:this.food})
      // },1000)
      updateFoodCount (isAdd) {
        this.$store.dispatch('updateFoodCount', {isAdd,food:this.food})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .cartcontrol
    position relative
    top 8px
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)

    .icon-remove_circle_outline
      display: inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color $green
      &.fade-enter-active
        transition .3s
      &.fade-enter
        opacity 0
        transition translateX(15px) .3s
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .icon-add_circle
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color $green
</style>