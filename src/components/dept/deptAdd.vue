<template>
  <div>
    <el-dialog
      title="添加部门"
      :visible.sync="dialogVisible"
      width="50%"
      @close="clearText(tname)"
    >
      <el-alert
        center
        :closable="false"
        v-if="!currentRow"
        type="success"
        effect="dark"
        title="当前创建的为公司级别部门。如要创建部门级别，请选择对应上级部门"
      >
      </el-alert>
      <el-alert
        center
        :closable="false"
        v-else
        type="success"
        effect="dark"
        :title="
          '当前创建的为  ' +
            currentRow.fullname +
            '  的下属部门。如要创建公司级别部门，请取消选择'
        "
      >
      </el-alert>

      <el-form
        :model="addDeptForm"
        :rules="addDeptFormRules"
        ref="addDeptFormRef"
        label-width="100px"
      >
        <el-form-item label="部门全称" prop="fullname">
          <el-input v-model="addDeptForm.fullname"></el-input>
        </el-form-item>
        <el-form-item label="部门简称" prop="simplename">
          <el-input v-model="addDeptForm.simplename"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDept">确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { http, dept } from "../../api/api";
export default {
  data() {
    return {
      dialogVisible: this.type,
      addDeptForm: {
        fullname: "",
        simplename: ""
      },
      addDeptFormRules: {
        fullname: [
          { required: true, message: "请输入部门全称", trigger: "blur" }
        ],
        simplename: [
          { required: true, message: "请输入部门简称", trigger: "blur" }
        ]
      }
    };
  },
  props: ["type", "resetClose", "tname", "currentRow"],
  watch: {
    //对话框显示隐藏
    type() {
      this.dialogVisible = this.type;
    }
  },
  methods: {
    addDept() {
      if (this.currentRow) {
        this.addDeptForm.pid = this.currentRow.id;
      } else {
        this.addDeptForm.pid = 0;
      }
      //排序
      this.addDeptForm.num = 0;

      this.$refs.addDeptFormRef.validate(valid => {
        if (!valid) {
          return this.$msg.error("校验失败");
        }
        this.$http
          .post(http + dept, JSON.stringify(this.addDeptForm), {
            emulateJSON: true
          })
          .then(res => {
            this.$msg.success("创建部门成功");
            this.dialogVisible = false;
          })
          .catch(err => {
            this.$msg.error(err.data.message);
            this.dialogVisible = false;
          });
      });
    },
    clearText(tname) {
      this.$refs.addDeptFormRef.resetFields();
      this.resetClose(tname);
    }
  }
};
</script>

<style scoped>
.el-alert {
  margin-bottom: 15px;
}
</style>
