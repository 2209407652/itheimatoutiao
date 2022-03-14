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
    <van-icon name="plus" size="16" class="plus" @click="show = true" />
    <!-- 频道管理的弹出层 -->
    <van-popup v-model="show" :close-on-click-overlay="false" @closed="isDel = false">
      <div class="popup-container">
        <!-- 弹出层的头部区域 -->
        <van-nav-bar title="频道管理">
          <template #right>
            <van-icon
              name="cross"
              size="14"
              color="white"
              @click="show = false"
            />
          </template>
        </van-nav-bar>

        <!-- 弹出层的主体区域 -->
        <div class="pop-body">
          <!-- 我的频道 -->
          <div class="my-channel-box">
            <div class="channel-title">
              <div>
                <span class="title-bold">已添加频道：</span>
                <span class="title-gray">{{
                  isDel ? "点击移除频道" : "点击进入频道"
                }}</span>
              </div>
              <span class="btn-edit" @click="isDel = !isDel">{{
                isDel ? "完成" : "编辑"
              }}</span>
            </div>
            <!-- 我的频道列表 -->
            <van-row type="flex">
              <van-col span="6" v-for="(item, index) in userChannel" :key="item.id">
                <!-- 用户的频道 Item 项 -->
                <div
                  class="channel-item van-hairline--surround"
                  @click="onUserChannelClick(item, index)"
                >
                  {{ item.name }}
                  <!-- 删除的图标 -->
                  <!-- 对删除功能进行优化，推荐标签不允许删除，最少拥有两个标签 -->
                  <van-badge
                    color="transparent"
                    class="cross-badge"
                    v-if="
                      isDel && item.name !== '标签' && userChannel.length > 2
                    "
                  >
                    <template #content>
                      <van-icon
                        name="cross"
                        class="badge-icon"
                        color="#cfcfcf"
                        size="12"
                      />
                    </template>
                  </van-badge>
                </div>
              </van-col>
            </van-row>
          </div>

          <!-- 分隔线 -->
          <div class="van-hairline--top sp-line"></div>

          <!-- 更多频道 -->
          <div class="more-channel-box">
            <div class="channel-title">
              <div>
                <span class="title-bold">可添加频道：</span>
                <span class="title-gray">点击添加频道</span>
              </div>
            </div>
            <!-- 更多频道列表 -->
            <van-row type="flex">
              <van-col span="6" v-for="item in moreChannel" :key="item.id">
                <div
                  class="channel-item van-hairline--surround"
                  @click="addChannel(item)"
                >
                  {{ item.name }}
                </div>
              </van-col>
            </van-row>
          </div>
        </div>
      </div></van-popup
    >
  </div>
</template>

<script>
import {
  getUserChannelAPI,
  getAllChannelAPI,
  updateUserChannelAPI,
} from "@/api/homeAPI";
import ArtList from "@/components/ArtList/ArtList.vue";
export default {
  name: "Home",
  data() {
    return {
      // 标签页激活项索引
      active: 0,
      // 用户频道列表
      userChannel: [],
      // 所有的频道列表数据
      allChannel: [],
      // 控制弹出层变量
      show: false,
      // 频道是否处于删除状态
      isDel: false,
    };
  },
  created() {
    // 获取用户标签数据
    this.initUserChannel();
    // 获取所有频道列表
    this.initAllChannel();
  },
  methods: {
    // 获取用户频道列表
    async initUserChannel() {
      const { data: res } = await getUserChannelAPI();
      if (res.message === "OK") {
        this.userChannel = res.data.channels;
      }
    },
    // 获取所有频道列表
    async initAllChannel() {
      const { data: res } = await getAllChannelAPI();
      if (res.message === "OK") {
        this.allChannel = res.data.channels;
      }
    },
    // 更新用户频道到数据库
    async updateChannel() {
      // 1.准备提交到服务器的数据
      const channels = this.userChannel
        .filter((item) => item.name !== "推荐")
        .map((item, index) => {
          return {
            id: item.id,
            seq: index + 1,
          };
        });
      // 2.提交到服务器
      const { data: res } = await updateUserChannelAPI(channels);
      if (res.message === "OK") {
        this.$notify({ type: "success", message: "更新成功", duration: 1000 });
      }
    },
    // 频道添加到用户频道
    addChannel(item) {
      this.userChannel.push(item);
      // 调用 API 接口，保存到数据库
      this.updateChannel();
    },
    onUserChannelClick(channel, index) {
      // 用户点击了用户频道标签，需要对其判断
      if (this.isDel) {
        // 如果是删除状态
        // 推荐标签不能删除，标签最少两个
        if(channel.name === "标签" || this.userChannel.length < 3) return 
        this.userChannel = this.userChannel.filter(
          (item) => item.id !== channel.id
        );
        // 提交到服务器
        this.updateChannel();
      } else {
        // 不是删除状态，跳转
        // 修改导航栏索引值
        this.active = index
        this.show = false
      }
    },
  },
  computed: {
    moreChannel() {
      // 计算出更多频道的数据，即用户没有添加的频道数据
      return this.allChannel.filter((item) => {
        // 通过 findIndex 查找 当前项 id 是否在用户频道
        const index = this.userChannel.findIndex((x) => x.id === item.id);
        // 如果没有找到，就返回true，表示把这一项添加到更多频道
        if (index === -1) return true;
      });
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
.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
    .title-bold {
      font-weight: bold;
    }
    .title-gray {
      color: gray;
      font-size: 12px;
    }
  }
}

.btn-edit {
  border: 1px solid #a3a2a2;
  padding: 0 10px;
  line-height: 20px;
  height: 20px;
  border-radius: 6px;
  font-size: 12px;
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 6px;
}

.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

.sp-line {
  margin: 10px 0 20px 0;
}
</style>