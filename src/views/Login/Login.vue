<template>
  <div class="login-container">
    <van-nav-bar title="黑马头条 - 登陆" flxed placeholder />
    <!-- 登录的表单 -->
    <van-form @submit="onLogin">
      <van-field
        v-model="form.mobile"
        type="tel"
        label="手机号码"
        placeholder="请输入手机号码"
        required
        :rules="rules.mobile"
      ></van-field>
      <van-field
        v-model="form.code"
        type="password"
        label="登录密码"
        placeholder="请输入登录密码"
        required
        :rules="rules.code"
      ></van-field>
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { loginAPI } from "@/api/userAPI";
// 按需导入辅助函数
import { mapMutations } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      // 登录表单的数据，最终要双向绑定到 form 这个数据对象上
      form: {
        // 用户的手机号
        mobile: "13888888123",
        // 登录的密码 246810
        code: "246810",
      },
      // 表单的校验规则对象
      rules: {
        // 手机号的校验规则
        mobile: [
          { required: true, message: "请填写您的手机号", trigger: "onBlur" },
          // 11 位手机号的校验规则
          {
            pattern: /^1\d{10}$/,
            message: "请填写正确的手机号",
            trigger: "onBlur",
          },
        ],
        // 密码的校验规则
        code: [
          { required: true, message: "请填写您的密码", trigger: "onBlur" },
        ],
      },
    };
  },
  methods: {
    // 映射 mutations 的方法
    ...mapMutations(["updateTokenInfo"]),
    // 登陆回调函数
    async onLogin() {
      const { data: res } = await loginAPI(this.form);
      if (res.message === "OK") {
        // 保存 token
        this.updateTokenInfo(res.data);
        // 路由跳转到主页还是用户上次访问的路由界面
        const navPath = this.$route.query.pre || "/";
        this.$router.replace(navPath);
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>>
