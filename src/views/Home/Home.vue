<template>
  <div class="home-container">
    <!-- 头部区域 -->
    <van-nav-bar fixed>
      <!-- 左插槽 -->
      <template #left>
        <img src="@/assets/toutiao_logo.png" alt="logo" class="logo"
      /></template>
      <!-- 右插槽 -->
      <template #right>
        <van-icon name="search" color="white" size="18" />
      </template>
    </van-nav-bar>

    <!-- 频道管理的小图标 -->
    <van-icon name="plus" size="16" class="plus" />
    <!-- 频道列表的标签页 -->
    <van-tabs
      v-model="active"
      sticky
      offset-top="1.22666667rem"
      color="#007bff"
    >
      <!-- 循环渲染用户的频道 -->
      <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">
        <!-- 每个用户频道下渲染出对应的 文章列表组件 -->
        <!-- 注意：Vue 官方建议在绑定 props 时，把“小驼峰”的属性名，改造成“短横线”的形式使用 -->
        <art-list :channel-id="item.id"></art-list>
      </van-tab>
    </van-tabs>
    <!-- 频道管理的小图标 -->
    <van-icon name="plus" size="16" class="plus" />
  </div>
</template>

<script>
import { getUserChannelAPI } from "@/api/homeAPI";
import ArtList from "@/components/ArtList/ArtList.vue";
export default {
  name: "Home",
  data() {
    return {
      // 标签页激活项索引
      active: 0,
      userChannel: [],
    };
  },
  created() {
    // 获取用户标签数据
    this.initUserChannel();
  },
  methods: {
    async initUserChannel() {
      const { data: res } = await getUserChannelAPI();
      if (res.message === "OK") {
        this.userChannel = res.data.channels;
      }
    },
  },
  components: {
    ArtList,
  },
};
</script>

<style lang="less" scoped>
// logo 样式
.logo {
  height: 80%;
}
/deep/ .van-tabs__wrap {
  padding-right: 36px;
  background-color: white;
}
// 频道管理小图标的定位
.plus {
  position: fixed;
  top: 58px;
  right: 10px;
  z-index: 999;
}
</style>