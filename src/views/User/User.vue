<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="userInfo.photo" alt="" class="avatar" />
        </template>
        <template #title>
          <span class="username">{{ userInfo.name }}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{ userInfo.art_count }}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{ userInfo.follow_count }}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{ userInfo.fans_count }}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell
        icon="edit"
        title="编辑资料"
        is-link
        @click="$router.push({ name: 'user-edit' })"
      />
      <van-cell
        icon="chat-o"
        title="小思同学"
        is-link
        @click="$router.push({ name: 'chat' })"
      />
      <van-cell icon="warning-o" title="退出登录" is-link @click="logout" />
    </van-cell-group>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  name: "User",
  methods: {
    ...mapActions(["initUserInfo"]),
    ...mapMutations(["cleanState"]),
    // 点击了退出登录
    async logout() {
      // 展示确认的提示框
      const confirmResult = await this.$dialog
        .confirm({
          title: "提示",
          message: "确认退出登录吗？",
        })
        .catch((err) => {
          // 这里把 err return 给了 confirmResult
          return err;
        });
      // 经过打印输出，发现 confirmResult 是一个 Promise 对象
      // 如果点击了取消，则不执行后续的操作
      if (confirmResult === "cancel") return;
      // 实现退出功能
      // 清空 token 和 userInfo
      this.cleanState();
      // 跳转到登陆页
      this.$router.push("/login");
    },
  },
  computed: {
    ...mapState(["userInfo"]),
  },
/*   created() {
     this.initUserInfo();
  }, */
  // 该生命周期只有被 keep-alive 之后才有
  activated() {
    // 只要组件被激活了，就重新初始化用户的信息
    this.initUserInfo();
  },
};
</script>

<style lang="less" scoped>
.user-container {
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #007bff;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
</style>