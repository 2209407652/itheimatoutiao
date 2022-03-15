<template>
  <div @click="$router.push('/article/' + artId)">
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ article.title }}</span>
          <!-- 单张图片 -->
          <img
            alt=""
            class="thumb"
            v-if="article.cover.type === 1"
            v-lazy="article.cover.images[0]"
          />
        </div>
        <!-- 三张图片 -->
        <div class="thumb-box" v-if="article.cover.type === 3">
          <img
            alt=""
            class="thumb"
            v-for="(item, index) in article.cover.images"
            :key="index"
            v-lazy="item"
          />
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <span
            >{{ article.aut_name }} &nbsp;&nbsp; {{ article.comm_count }}评论
            &nbsp;&nbsp; 发布日期:{{ article.pubdate | dateFormat }}</span
          >
          <!-- 关闭按钮 -->
          <!-- 通过 .stop 事件修饰符，阻止点击事件的冒泡 -->
          <van-icon name="cross" @click.stop="show = true" v-if="closable" />
        </div>
      </template>
    </van-cell>

    <!-- 反馈的动作面板 -->
    <van-action-sheet
      v-model="show"
      cancel-text="取消"
      :closeable="false"
      @closed="isFirst = true"
      get-container="body"
    >
      <!-- 一级反馈面板 -->
      <div v-if="isFirst" class="content">
        <van-cell
          v-for="item in actions"
          :key="item.name"
          :title="item.name"
          clickable
          class="center-title"
          @click="onCellClick(item.name)"
        />
      </div>
      <!-- 第二级反馈面板 -->
      <div v-else>
        <van-cell
          v-for="item in reports"
          :key="item.type"
          :title="item.label"
          clickable
          title-class="center-title"
          @click="reportArticle(item.type)"
        />
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { dislikeArticleAPI, reportArticleAPI } from "@/api/homeAPI";
import reports from "@/api/reports";
export default {
  name: "ArtItem",
  props: {
    // 文章的信息对象
    article: {
      typeof: Object,
      required: true,
    },
    // 是否展示关闭按钮
    closable: {
      type: Boolean,
      // 默认值为 true，表示展示关闭按钮
      default: true,
    },
  },
  data() {
    return {
      // 是否展示反馈面板
      show: false,
      // 第一个面板的可选项列表
      actions: [
        { name: "不感兴趣" },
        { name: "反馈垃圾内容" },
        { name: "拉黑作者" },
      ],
      // 默认优先展示一级面板
      isFirst: true,
      // 二级反馈面板
      reports,
    };
  },
  methods: {
    // 一级菜单
    async onCellClick(name) {
      if (name === "不感兴趣") {
        // 不感兴趣删除文章
        const { data: res } = await dislikeArticleAPI(this.artId);
        if (res.message === "OK") {
          // 炸楼操作
          this.$emit("remove-article", this.artId);
        }
        this.show = false;
      } else if (name === "拉黑作者") {
        console.log("拉黑作者");
        this.show = false;
      } else if (name === "反馈垃圾内容") {
        this.isFirst = false;
      }
    },
    // 二级举报类型
    async reportArticle(type) {
      const { data: res } = await reportArticleAPI(this.artId, type);
      if (res.message === "OK") {
        // 炸楼操作
        this.$emit("remove-article", this.artId);
      }
    },
  },
  computed: {
    // 计算点击文章的 id
    artId() {
      return this.article.art_id.toString();
    },
  },
};
</script>
<style lang="less" scoped>
.center-title {
  text-align: center;
}
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.thumb {
  // 矩形黄金比例：0.618
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>