<template>
  <div>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="50%"
      @close="clearText"
    >
      <el-form
        :model="passForm"
        :rules="passFormRules"
        ref="passFormRef"
        label-width="100px"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passForm.oldPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="passForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="重复新密码" prop="rePassword">
          <el-input v-model="passForm.rePassword" type="password"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setPass">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { http, updatePwd } from "../../api/api";
export default {
  data() {
    return {
      //对话框状态
      dialogVisible: this.editDialogVisible,
      //密码表单
      passForm: {
        oldPassword: "",
        password: "",
        rePassword: ""
      },
      passFormRules: {
        oldPassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        rePassword: [
          { required: true, message: "请重复输入新密码", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  //静态
  props: ["editDialogVisible", "btn"],
  //对象内部的属性监听，也叫深度监听
  watch: {
    editDialogVisible() {
      this.dialogVisible = this.editDialogVisible;
    }
  },
  //属性的结果会被缓存，除非依赖的响应式属性变化才会重新计算。主要当作属性来使用；
  computed: {},
  //方法表示一个具体的操作，主要书写业务逻辑；
  methods: {
    setPass() {
      this.$refs.passFormRef.validate(vaild => {
        if (!vaild || this.passForm.password !== this.passForm.rePassword) {
          return this.$msg.error("校验失败");
        }

        this.$http
          .post(http + updatePwd, this.passForm, { emulateJSON: true })
          .then(res => {
            console.log(res.data);
          })
          .catch(err => (location.href = "./login.html"));
      });

      this.dialogVisible = false;
    },

    //清空表单
    clearText() {
      this.$refs.passFormRef.resetFields();
      this.btn()
    }
  }
};
</script>

<style scoped>
</style>

