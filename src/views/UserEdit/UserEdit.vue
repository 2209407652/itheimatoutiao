<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <!-- 用户资料 -->
    <van-cell-group class="action-card" v-if="userProfile">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
            round
            class="avatar"
            :src="userProfile.photo"
            @click="$refs.fileRef.click()"
          />
          <!-- 文件选择框 -->
          <input
            type="file"
            accept="image/*"
            @change="onFileChange"
            v-show="false"
            ref="fileRef"
          />
        </template>
      </van-cell>
      <van-cell
        title="名称"
        is-link
        :value="userProfile.name"
        @click="onNameCellClick"
      />
      <van-cell
        title="生日"
        is-link
        :value="userProfile.birthday"
        @click="onBirthCellClick"
      />
    </van-cell-group>
    <!-- 修改用户名称的对话框 -->
    <van-dialog
      v-model="showNameDialog"
      title="修改名称"
      show-cancel-button
      :before-close="beforeClose"
    >
      <!-- input-align 文本横向的对其方式 -->
      <van-field
        ref="nameRef"
        v-model.trim="name"
        placeholder="请输入用户名"
        input-align="center"
        maxlength="7"
      />
    </van-dialog>
    <!-- 修改生日的动作面板 -->
    <van-action-sheet v-model="showBirthSheet">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择出生日期"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showBirthSheet = false"
        @confirm="updateBirthday"
      />
    </van-action-sheet>
  </div>
</template>

<script>
import { updateUserProfileAPI, updateUserAvatarAPI } from "@/api/userAPI";
import { mapActions, mapState } from "vuex";
import dayjs from "dayjs";
export default {
  name: "UserEdit",
  data() {
    return {
      // 是否展示修改生日的对话框
      showBirthSheet: false,
      // 是否展示修改姓名的对话框
      showNameDialog: false,
      // 用户填写的姓名
      name: "",
      // 最小可选日期（0 表示 1月份）
      minDate: new Date(1900, 0, 1),
      // 最大可选日期（11 表示 12月份）
      maxDate: new Date(2050, 11, 31),
      // 当前日期
      currentDate: new Date(),
    };
  },
  methods: {
    ...mapActions(["initUserProfile"]),
    // 点击了修改名称
    onNameCellClick() {
      // 把用户名称赋值给输入框
      this.name = this.userProfile.name;
      this.showNameDialog = true;
      // 打开修改框后聚焦输入框
      this.$nextTick(() => {
        this.$refs.nameRef.focus();
      });
    },
    // 点击了修改生日
    onBirthCellClick() {
      // 根据用户生日弹出日期选择框
      // 如果用户填写了生日，默认是用户生日，否则是当前时间
      this.currentDate = this.userProfile.birthday
        ? new Date(this.userProfile.birthday)
        : new Date();
      // 展示动作面板
      this.showBirthSheet = true;
    },
    // Dialog 关闭前的处理函数
    beforeClose(action, done) {
      // action 可能的值有两个：cancel 和 confirm
      /*  console.log(action);

      // 调用 done() 时会关闭对话框；调用 done(false) 时会阻止对话框关闭
      done(); */
      if (action === "cancel") return done();
      // 用户修改了名称，判断不合法
      if (this.name === "" || this.name.length > 7) {
        // 1.提示用户不合法
        this.$notify({
          type: "warning",
          message: "名称的长度为1-7个字符",
          duration: 2000,
        });
        // 2.文本框获得聚焦
        this.$refs.nameRef.focus();
        // 3.阻止文本框关闭
        return done(false);
      }
      // 用户修改了名称，判断合法 -- TODO 发起请求
      this.updataName(done);
    },
    // 更新用户的姓名
    async updataName(done) {
      try {
        // 调用接口
        const { data: res } = await updateUserProfileAPI({ name: this.name });
        if (res.message === "OK") {
          // 1.关闭对话框
          done();
          // 2.重新发起请求用户详细信息
          this.initUserProfile();
          // 3.提示用户更新成功
          this.$notify({
            type: "success",
            message: "名称更新成功！",
            duration: 2000,
          });
        }
      } catch (e) {
        if (e.response.status === 409) {
          // 提示用户名称被占用
          this.$notify({
            type: "warning",
            message: "名称被占用，请更换后重试！",
            duration: 2000,
          });
          // 阻止关闭对话框
          done(false);
          // 让文本框持续获得焦点
          this.$refs.nameRef.focus();
        } else {
          // 关闭对话框
          done();
          // 提示用户名称被占用
          this.$notify({
            type: "danger",
            message: "名称更新失败！",
            duration: 2000,
          });
        }
      }
    },
    // 更新用户生日
    async updateBirthday(value) {
      // 关闭动作面板
      this.showBirthSheet = false;
      // 对时间进行格式化
      const newValue = dayjs(value).format("YYYY-MM-DD");
      // 调用 API 接口
      const { data: res } = await updateUserProfileAPI({ birthday: newValue });
      if (res.message === "OK") {
        // 1.重新获取用户数据
        this.initUserProfile();
        // 2.提示用户信息
        this.$notify({
          type: "success",
          message: "生日修改成功！",
          duration: 2000,
        });
      }
    },
    // 选中的文件发生了变化
    async onFileChange(e) {
      // 获取到用户选择的文件列表
      const files = e.currentTarget.files;
      // 如果没有选择任何文件，则不执行后续的业务逻辑
      if (files.length === 0) return;
      // 创建 FormData对象，并且添加数据
      const fd = new FormData();
      fd.append("photo", files[0]);
      // 发起请求
      const { data: res } = await updateUserAvatarAPI(fd);
      if (res.message === "OK") {
        // 1.更新用户数据
        this.initUserProfile();
        // 2.提示用户信息
        this.$notify({
          type: "success",
          message: "更新头像成功！",
          duration: 2000,
        });
      }
    },
  },
  computed: {
    ...mapState(["userProfile"]),
  },
  created() {
    this.initUserProfile();
  },
};
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
}

.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
</style>