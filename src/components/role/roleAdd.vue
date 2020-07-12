<template>
  <div>
    <el-dialog
      title="添加角色"
      :visible.sync="dialogVisible"
      width="50%"
      @close="clearText(tname)"
    >
      <el-form
        :model="addRoleForm"
        :rules="addRoleFormRules"
        ref="addRoleFormRef"
        label-width="100px"
        v-if="deptData"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addRoleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="角色编码" prop="tips">
          <el-input v-model="addRoleForm.tips"></el-input>
        </el-form-item>

        <el-form-item label="部门" prop="deptid">
          <el-cascader
            :options="deptData"
            :props="deptDataProps"
            v-model="addRoleForm.deptid"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { http, role, deptlist } from "../../api/api";
export default {
  data() {
    return {
      dialogVisible: this.type,
      addRoleForm: {
        name: "",
        tips: "",
        deptid: ""
      },
      deptData: [],
      deptDataProps: {
        label: "simplename",
        value: "id",
        children: "children",
        expandTrigger: "hover"
      },
      addRoleFormRules: {
        name: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        tips: [{ required: true, message: "请输入角色编码", trigger: "blur" }],
        deptid: [{ required: true, message: "请选择部门", trigger: "blur" }]
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
      this.$refs.addRoleFormRef.resetFields();
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
    addRole() {
      //处理部门ID
      this.addRoleForm.deptid = this.addRoleForm.deptid[
        this.addRoleForm.deptid.length - 1
      ];
      //账号id
      this.addRoleForm.pid = this.$store.state.user.info.profile.id;
      //排序
      this.addRoleForm.num = 0;
      this.$refs.addRoleFormRef.validate(valid => {
        if (!valid) {
          return this.$msg.error("校验失败");
        }
        this.$http
          .post(http + role, JSON.stringify(this.addRoleForm), {
            emulateJSON: true
          })
          .then(res => {
            if (res.data.msg == "成功") {
              this.$msg.success("添加角色成功");
              this.dialogVisible = false;
              this.$refs.addRoleFormRef.resetFields();
            } else {
              this.$msg.error(res.data.msg);
              this.dialogVisible = false;
            }
          })
          .catch(err => {
            this.$msg.error(err.data.message);
            this.dialogVisible = false;
          });
      });
    }
  }
};
</script>

<style scoped>
</style>
