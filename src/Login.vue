<template>
  <div id="app">
    <el-card>
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
        label-width="55px"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { http, login } from "./api/api";
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 15, message: "长度在 5 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) return this.$msg.error("表单校验失败");
        this.$http
          .post(http + login, this.loginForm, { emulateJSON: true })
          .then(
            res => {
              if (res.data.msg === "用户名或密码错误") {
                return this.$msg.error("用户名或密码错误");
              }
              this.$msg.success("登录成功");
              localStorage.token = res.data.data.token;
              location.href = "/";
              console.log(res.data.data.token);
            },
            err => this.$msg.error("登录失败")
          );
      });
    },
    resetForm() {
      this.$refs.loginFormRef.resetFields();
    }
  }
};
</script>

<style scoped>
.el-card {
  width: 500px;
  margin: 150px auto;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
