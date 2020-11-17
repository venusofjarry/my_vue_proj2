<template>
  <div class="cartcontrol">
    <transition name="fade">
      <div class="iconfont icon-remove_circle_outline" v-if="food.count>0" @click.stop="updateFoodCount(false)"></div>
    </transition>
    <div class="cart-count" v-if="food.count>0">{{food.count}}</div>
    <div class="iconfont icon-add_circle" @click.stop="updateFoodCount(true)"></div>
  </div>
</template>

<script type="text/ecmasript-6">
import {throttle} from 'lodash'
  export default{
    props: {
      food: Object
    },
    methods: {
      updateFoodCount: throttle(function(isAdd){
          this.$store.dispatch('updateFoodCount', {isAdd,food:this.food})
      },500,{trailing: false})
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