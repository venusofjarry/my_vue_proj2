<template>
  <header class="header">
    <!-- <span class="header_search">
        <i class="iconfont icon-sousuo"></i>
    </span> -->

    <slot name="left"></slot>
    <span class="header_title">
        <span class="header_title_text ellipsis">{{title}}</span>
    </span>
    <slot name="right"></slot>

    <!-- <span class="header_login">
        <span class="header_login_text">登录|注册</span>
    </span> -->

  </header>
</template>

<script type="text/ecmasript-6">
  export default{
    props: {
      title: String
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.header //头部公共css
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
  .iconfont
    font-size 22px
    color #fff
  .header_title
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    width 30%
    color #fff
    font-size 22px
    text-align center
</style>