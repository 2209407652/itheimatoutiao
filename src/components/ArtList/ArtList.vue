<template>
  <div class="artlist-container">
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <!-- 上拉加载 -->
      <van-list
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        finished-text="我也是有底线的~"
        @load="onLoad"
      >
        <!-- 循环渲染文章列表 -->
        <art-item
          v-for="item in artlist"
          :key="item.art_id"
          :article="item"
          @remove-article="removeArticle"
        ></art-item> </van-list
    ></van-pull-refresh>
  </div>
</template>

<script>
import { getArtListAPI } from "@/api/homeAPI";
import ArtItem from "@/components/ArtItem/ArtItem.vue";
export default {
  name: "ArtList",
  props: {
    channelId: {
      type: Number, // 类型数字
      required: true, // 必填项
    },
  },
  data() {
    return {
      artlist: [], // 文章列表
      timestamp: Date.now(),
      // loading 表示是否正在进行上拉加载的请求
      //   每当触发 List 组件的上拉加载更多时，List 组件会自动把 loading 设为 true
      //   每当下一页的数据请求回来以后，需要程序员手动的把 loading 设为 false，
      //   否则：再次触发上拉加载更多时，不会发起请求！！
      loading: true,
      // finished 表示所有数据是否加载完毕
      //    false 表示还有下一页的数据
      //    true  表示所有数据都已加载完毕
      finished: false,
      // 是否正在进行下拉刷新的请求
      refreshing: false,
    };
  },
  methods: {
    async initArtList(ifRefresh) {
      const { data: res } = await getArtListAPI(this.channelId, this.timestamp);
      if (res.message === "OK") {
        this.timestamp = res.data.pre_timestamp;
        if (ifRefresh) {
          // 下拉刷新，新数据在上，旧数据在下
          this.artlist = [...res.data.results, ...this.artlist];
          // 重置 refreshing
          this.refreshing = false;
        } else {
          // 上拉加载，旧数据在上，新数据在下
          this.artlist = [...this.artlist, ...res.data.results];
          // 重置 loading
          this.loading = false;
        }
        // 判断所有数据是否加载完毕
        if (res.data.pre_timestamp === null) {
          this.finished = true;
        }
      }
    },
    // 上拉加载更多
    onLoad() {
      this.initArtList(false);
    },
    // 下拉刷新
    onRefresh() {
      this.initArtList(true);
    },
    // 从文章列表中移除指定 id 的文章
    removeArticle(id) {
      // 1. 炸楼操作
      this.artlist = this.artlist.filter(
        (item) => item.art_id.toString() !== id
      );

      // 2. 判断剩余数据的文章数量是否小于 10
      if (this.artlist.length < 10) {
        // 主动请求下一页的数据
        this.initArtList();
      }
    },
  },
  created() {
    // 在组件创建时，请求文章列表数据
    this.initArtList();
  },
  components: {
    ArtItem,
  },
};
</script>

<style lang="less" scoped>
.artlist-container {
  padding-top: 1em;
  padding-bottom: 1em;
}
</style>