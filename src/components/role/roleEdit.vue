<template>
  <div>
    <el-dialog
      title="修改用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="clearText(tname)"
    >
      <el-form
        :model="editRoleForm"
        :rules="editRoleFormRules"
        ref="editRoleFormRef"
        label-width="100px"
        v-if="deptData && editRoleForm"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editRoleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="角色编码" prop="tips">
          <el-input v-model="editRoleForm.tips"></el-input>
        </el-form-item>

        <el-form-item label="部门" prop="deptid">
          <el-cascader
            :options="deptData"
            :props="deptDataProps"
            v-model="editRoleForm.deptid"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { http, deptlist, role } from "../../api/api";
export default {
  data() {
    return {
      dialogVisible: this.type,
      editRoleForm: this.currentRow,
      deptData: [],
      deptDataProps: {
        label: "simplename",
        value: "id",
        children: "children",
        expandTrigger: "hover"
      },
      editRoleFormRules: {
        name: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        tips: [{ required: true, message: "请输入角色编码", trigger: "blur" }],
        deptid: [{ required: true, message: "请选择部门", trigger: "blur" }]
      }
    };
  },
  props: ["type", "resetClose", "tname", "currentRow"],
  mounted() {
    this.getDeptList();
  },
  watch: {
    //对话框显示隐藏
    type() {
      this.dialogVisible = this.type;
    },
    //获取数据
    currentRow() {
      var json = {};
      //   格式转换字符串
      for (var i in this.currentRow) {
        this.$set(json, i, this.currentRow[i].toString());
      }
      this.editRoleForm = json;
    }
  },
  methods: {
    clearText(tname) {
      this.$refs.editRoleFormRef.resetFields();
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
    //修改用户
    editRole() {
      //判断是否为数组
      if (Array.isArray(this.editRoleForm.deptid)) {
        this.editRoleForm.deptid = this.editRoleForm.deptid[
          this.editRoleForm.deptid.length - 1
        ];
      }
    
      this.$refs.editRoleFormRef.validate(valid => {
        if (!valid) {
          return this.$msg.error("校验失败");
        }
        this.$http
          .post(http + role, JSON.stringify(this.editRoleForm), {
            emulateJSON: true
          })
          .then(res => {
            this.$msg.success("修改角色成功");
            this.dialogVisible = false;
            this.$refs.editRoleFormRef.resetFields();
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
