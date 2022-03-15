<template>
  <div id="app">
    <!-- 路由占位符 -->
    <!-- 保持组件状态，优化方法之一 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>  
</template>
<script>
export default {
  name: "App"
}
</script>

<style lang="less">

</style>
