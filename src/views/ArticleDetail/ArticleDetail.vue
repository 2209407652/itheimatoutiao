<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar
      fixed
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 文章信息区域 -->
    <div class="article-container" v-if="article">
      <!-- 文章标题 -->
      <h1 class="art-title">{{ article.title }}</h1>

      <!-- 用户信息 -->
      <van-cell
        center
        :title="article.aut_name"
        :label="article.pubdate | dateFormat"
      >
        <template #icon>
          <!-- 头像 -->
          <img :src="article.aut_photo" alt="" class="avatar" />
        </template>
        <template #default>
          <div>
            <!-- 是否关注了作者 -->
            <van-button
              type="info"
              size="mini"
              v-if="article.is_followed"
              @click="setUnFollow"
              >已关注</van-button
            >
            <van-button
              icon="plus"
              type="info"
              size="mini"
              plain
              v-else
              @click="setFollow"
              >关注</van-button
            >
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="article.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button
          icon="good-job"
          type="danger"
          size="small"
          v-if="article.attitude === 1"
          @click="setDisLike"
          >已点赞</van-button
        >
        <van-button
          icon="good-job-o"
          type="danger"
          plain
          size="small"
          v-else
          @click="setLike"
          >点赞</van-button
        >
      </div>
    </div>

    <!-- 文章评论 -->
    <!-- 文章的评论组件（ art-id 是短横线命名法 ） -->
    <art-cmt :art-id="id"></art-cmt>
  </div>
</template>
<script>
// 导入 highlight.js 模块
import hljs from "highlight.js";
import ArtCmt from "@/components/ArtCmt/ArtCmt.vue";
// 按需导入 API 接口
import {
  getArticleDetailAPI,
  followUserAPI,
  unfollowUserAPI,
  addLikeAPI,
  delLikeAPI,
} from "@/api/articleAPI.js";
import { mapState } from "vuex";
export default {
  name: "ArticleDetail",
  // 这个 props 接受的是路由 /article/:id 的数据
  props: ["id"],
  data() {
    return {
      // 文章信息对象
      article: null,
    };
  },
  methods: {
    // 获取文章详情信息
    async initArticle() {
      const { data: res } = await getArticleDetailAPI(this.id);
      if (res.message === "OK") {
        this.article = res.data;
      }
    },
    // 关注文章作者
    async setFollow() {
      // 先判断用户是否登陆
      if (!this.tokenInfo.token) {
        this.$toast.success("请先登陆后再操作!");
        this.$router.push("/login");
        return;
      }
      const { data: res } = await followUserAPI(this.article.aut_id.toString());
      if (res.message === "OK") {
        // 提示用户成功
        this.$toast.success("关注成功！");
        // 手动更改关注的状态
        this.article.is_followed = true;
      }
    },
    // 取关作者
    async setUnFollow() {
      const res = await unfollowUserAPI(this.article.aut_id.toString());
      // 判断响应的状态码
      if (res.status === 204) {
        // 提示用户
        this.$toast.success("取关成功！");
        // 手动更改关注的状态
        this.article.is_followed = false;
      }
    },
    // 文章点赞
    async setLike() {
      // 调用 API 接口
      const { data: res } = await addLikeAPI(this.id);
      if (res.message === "OK") {
        // 提示用户
        this.$toast.success("点赞成功！");
        // 手动变更点赞的状态
        this.article.attitude = 1;
      }
    },
    // 取消点赞
    async setDisLike() {
      // 调用 API 接口
      const res = await delLikeAPI(this.id);
      if (res.status === 204) {
        // 提示用户
        this.$toast.success("取消点赞成功！");
        // 手动变更点赞的状态
        this.article.attitude = -1;
      }
    },
  },
  computed: {
    ...mapState(["tokenInfo"]),
  },
  created() {
    this.initArticle();
  },
  watch: {
    id() {
      // 只要 id 值发生了变化，就清空旧的文章信息
      this.article = null;
      // 并重新获取文章的详情数据
      this.initArticle();
    },
  },
  components: {
    ArtCmt,
  },
  // 1. 当组件的 DOM 更新完毕之后
  updated() {
    // 2. 判断是否有文章的内容
    if (this.article) {
      // 3. 对文章的内容进行高亮处理
      hljs.highlightAll();
    }
  },
  beforeRouteLeave(to, from, next) {
    from.meta.top = window.scrollY;
    setTimeout(() => {
      next();
    }, 0);
  },
};
</script>
<style lang="less" scoped>
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
</style>
