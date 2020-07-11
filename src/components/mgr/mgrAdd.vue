<template>
  <div>
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="clearText(tname)"
    >
      <el-form
        :model="addUserForm"
        :rules="addUserFormRules"
        ref="addUserFormRef"
        label-width="100px"
        v-if="deptData"
      >
        <el-form-item label="账户" prop="account">
          <el-input v-model="addUserForm.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addUserForm.name"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="addUserForm.birthday"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="addUserForm.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addUserForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="deptid">
          <el-cascader
            :options="deptData"
            :props="deptDataProps"
            v-model="addUserForm.deptid"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="addUserForm.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { http, deptlist, updateUser } from "../../api/api";
export default {
  data() {
    return {
      dialogVisible: this.type,
      addUserForm: {
        account: "",
        password: "",
        name: "",
        birthday: "",
        sex: "1",
        email: "",
        phone: "",
        deptid: "",
        status: "1"
      },
      deptData: [],
      deptDataProps: {
        label: "simplename",
        value: "id",
        children: "children",
        expandTrigger: "hover"
      },
      addUserFormRules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        birthday: [{ required: true, message: "请选择生日", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        phone: [{ required: true, message: "请输入电话", trigger: "blur" }],
        deptid: [{ required: true, message: "请选择部门", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }]
      }
    };
  },
  props: ["type", "resetClose", "tname"],
  mounted() {
    this.getDeptList();
  },
  watch: {
    type() {
      this.dialogVisible = this.type;
    }
  },
  methods: {
    clearText(tname) {
      this.$refs.addUserFormRef.resetFields();
      this.resetClose(tname);
    },
    //获取部门信息
    getDeptList() {
      this.$http
        .get(http + deptlist)
        .then(res => {
          this.deptData = this.childrenNull(res.data.data);
        })
        .catch(err => this.$msg.error(err.data.message));
    },
    //处理级联选择器
    childrenNull(data) {
      data.forEach(item => {
        if (item.children == 0) {
          item.children = null;
        } else {
          this.childrenNull(item.children);
        }
      });
      return data;
    },
    //添加用户
    addUser() {
      this.addUserForm.deptid = this.addUserForm.deptid[
        this.addUserForm.deptid.length - 1
      ];
      this.addUserForm.birthday = this.setTimes(this.addUserForm.birthday);

      this.$refs.addUserFormRef.validate(valid => {
        if (!valid) {
          return this.$msg.error("校验失败");
        }
        this.$http
          .post(http + updateUser, this.addUserForm, { emulateJSON: true })
          .then(res => {
            if (res.data.msg == "成功") {
              this.$msg.success("添加用户成功");
              this.dialogVisible = false;
              this.$refs.addUserFormRef.resetFields();
            } else {
              this.$msg.error(res.data.message);
            }
          })
          .catch(err => {
            if (err.data.message == "该用户已经注册") {
              this.$msg.error("该用户已经注册");
            } else {
              this.$msg.error(err.data.message);
            }
          });
      });
    },
    //处理日期格式
    setTimes(date) {
      var time = new Date(date);
      return (
        time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate()
      );
    }
  }
};
</script>

<style scoped>
</style>
