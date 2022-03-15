<template>
  <div>
    <!-- Header 头部区域 -->
    <div class="search-header">
      <!-- 后退图标 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="18"
        class="goback"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <van-search
        v-model.trim="kw"
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        @input="onInput"
      />
    </div>
    <!-- 搜索建议 -->
    <div class="sugg-list" v-if="kw.length > 0">
      <div
        class="sugg-item"
        v-for="(item, i) in suggestList"
        :key="i"
        v-html="item"
        @click="gotoSearchResult"
      ></div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="history = []" />
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span
          class="history-item"
          v-for="(tag, i) in history"
          :key="i"
          @click="gotoSearchResult"
          >{{ tag }}</span
        >
      </div>
    </div>
  </div>
</template>
<script>
import { getSuggestListAPI } from "@/api/searchAPI";
export default {
  name: "Search",
  data() {
    return {
      // 搜索关键词
      kw: "",
      // 延时器的 Id
      timerId: null,
      // 搜索建议列表
      suggestList: [],
      // 搜索历史
      history: JSON.parse(localStorage.getItem("history") || "[]"),
    };
  },
  watch: {
    history(newVal) {
      localStorage.setItem("history", JSON.stringify(newVal));
    },
  },
  methods: {
    // 输入框防抖操作，频繁触发 input 事件时
    onInput() {
      // 2. 清除上次的延时器
      clearTimeout(this.timerId);
      // 3. 如果输入的内容为空，则 return 出去，不开启延时器
      if (this.kw.length === 0) {
        // 清空列表
        this.suggestList = [];
        return;
      }

      // 1. 开启延时器，将延时器的 id 存储到 this.timerId 中
      this.timerId = setTimeout(() => {
        this.initSuggestList();
      }, 500);
    },
    // 请求搜索建议列表
    async initSuggestList() {
      const { data: res } = await getSuggestListAPI(this.kw);
      if (res.message === "OK") {
        // 关键词高亮处理
        this.hlightKeywords(res.data.options);
        // 搜索结果列表
        this.suggestList = res.data.options;
        // 搜索关键词保存为搜索历史
        const newHistory = this.history.filter((item) => item !== this.kw);
        // 将元素添加到列表开头，该方法改变原数组
        newHistory.unshift(this.kw);
        // 给搜索历史赋值
        this.history = newHistory;
      }
    },
    // 搜索关键词高亮
    hlightKeywords(arr) {
      // 根据用户关键词动态创建正则表达式
      const reg = RegExp(this.kw, "ig");
      // 循环数据，调用字符串的 replace 方法进行关键字的高亮处理
      if (arr.length !== 0) {
        // 如果搜索结果为零，则不能调用 replace 方法
        arr.forEach((item, index) => {
          arr[index] = item.replace(reg, (val) => {
            return `<span style="color: red; font-weight: bold;">${val}</span>`;
          });
        });
      }
    },
    // 进入搜索结果页面
    gotoSearchResult(e) {
      // 事件结束后 currentTarget 被重新赋值了
      // 1. 获取用户当前点击的搜索建议项的内容
      const kw = e.currentTarget.innerText
      // 2. 编程式导航
      this.$router.push('/search/' + kw)
    },
  },
  // 在组件渲染后，使搜索框聚焦，这里我感觉不需要
  /*  mounted() {
    const ipt = document.querySelector("input[type=search]");
    ipt && ipt.focus();
  }, */
};
</script>
<style lang="less" scoped>
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  // 后退按钮
  .goback {
    padding-left: 14px;
  }
  // 搜索组件
  .van-search {
    flex: 1;
  }
}
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
