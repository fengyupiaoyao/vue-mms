<template>
  <div class="login-container">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="100px"
      class="login-form"
    >
      <h2 class="login-title">会员管理系统</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login, getUserInfo } from "../api/login";

export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      //表单校验
      rules: {
        username: [
          { required: true, message: "请输入有效账号", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入有效密码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store.dispatch('Login',this.form).then(response => {
            if(response.flag) {
              this.$router.push('/');
            } else {
              this.$message({
                message: response.message,
                type:'warning'
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login-form {
  width: 350px;
  /*上下间隙160px， 左右自动*/
  margin: 160px auto;
  /*透明背景色*/
  background-color: rgb(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 20px;
}
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("../assets/login.jpg");
  overflow: hidden;
}
.login-title {
  text-align: center;
  color: #303133;
}
</style>
