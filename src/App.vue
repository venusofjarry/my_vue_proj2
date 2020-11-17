<template>
  <div>
    <!-- 使用keep-alive标签缓存路由，使用exclude属性决定不缓存哪个路由
         当使用了该标签，则该标签内部的路由相互间跳转，一般不会出现加载的状态，因为已经缓存了，简单理解就是为了快
     -->
    <!-- <keep-alive exclude="Search">
      <router-view></router-view>
    </keep-alive> -->
    <router-view></router-view>
    <FooterGuide v-show="$route.meta.isFooterShow"></FooterGuide>
  </div>
</template>

<script type="text/ecmasript-6">
  import FooterGuide from '@/components/FooterGuide/FooterGuide.vue'
  // import {reqAddress} from '@/api'
  export default {
  //  async mounted () {
  //     // 千万注意！！！！！！！！！！！！！！！！！  这里的reqAddress函数中的两个请求参数中间不能有空格，一定要注意！！！！！！！！！！！
  //     const result = await reqAddress('116.36867',40.10038)
  //   }, 
    mounted(){
      this.$store.dispatch('getAddress')
      this.$store.dispatch('autoLogin')
    },
    components: {
      FooterGuide
    }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>