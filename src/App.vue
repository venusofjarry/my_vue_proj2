<template>
  <div>
    <router-view></router-view>
    <FooterGuide v-show="$route.meta.isFooterShow"></FooterGuide>
  </div>
</template>

<script type="text/ecmasript-6">
  import FooterGuide from '@/components/FooterGuide/FooterGuide.vue'
  export default {
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