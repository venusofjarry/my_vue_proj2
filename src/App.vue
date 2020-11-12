<template>
  <div>
    <!-- 这是上面的结构 -->
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
      // console.log(this.$store.dispatch('getAddress'))
    },
    components: {
      FooterGuide
    }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>