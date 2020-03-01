<template>
  <div class="header">
    <a href="#/">
      <img src="@/assets/logo.png" class="logo" />
      <span class="company">会员管理系统</span>
    </a>

    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        admin<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">修改密码</el-dropdown-item>
        <el-dropdown-item command="b">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="500px">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
      >
        <el-form-item label="原始密码" prop="oldPwd">
          <el-input type="password" v-model="ruleForm.oldPwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pwd">
          <el-input type="password" v-model="ruleForm.pwd"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPwd">
          <el-input type="password" v-model="ruleForm.checkPwd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { logout } from "@/api/login";
import passwordApi from "../../api/password";

export default {
  data() {
    const validateOldPwd = (rule, value, callback) => {
      passwordApi.checkPwd(this.user.id, value).then(response => {
        const resp = response.data;
        if (resp.flag) {
          callback();
        } else {
          callback(new Error(resp.message));
        }
      });
    };
    const validatePwd = (rule, value, callback) => {
      if (value != this.ruleForm.pwd) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      ruleForm: {
        oldPwd: "",
        pwd: "",
        checkPwd: ""
      },
      //user: JSON.parse(localStorage.getItem("mms-user")),
      user: this.$store.state.user.user,
      rules: {
        oldPwd: [
          { required: true, message: "旧密码不能为空", trigger: "blur" },
          { validator: validateOldPwd, trigger: "blur" }
        ],
        pwd: [{ required: true, message: "新密码不能为空", trigger: "blur" }],
        checkPwd: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { validator: validatePwd, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "a":
          //修改密码
          this.handlePwd();
          break;
        case "b":
          this.handleLogout();
          break;
        default:
          break;
      }
    },
    handlePwd() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          passwordApi
            .updatePwd(this.user.id, this.ruleForm.pwd)
            .then(response => {
              const resp = response.data;
              this.$message({
                message: resp.message,
                type: resp.flag ? "success" : "error"
              });
              if (resp.flag) {
                this.handleLogout();
                this.dialogVisible = false;
              }
            });
        }
      });
    },
    handleLogout() {
      this.$store.dispatch("Logout").then(response => {
        if (response.flag) {
          this.$router.push("/login");
        } else {
          this.$message({
            message: response.message,
            type: "warning",
            duration: 500
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.logo {
  width: 25px;
  vertical-align: middle;
  padding: 0 10px 0 20px;
}
.company {
  position: absolute;
  color: white;
}
.el-dropdown {
  float: right;
  margin-right: 40px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
