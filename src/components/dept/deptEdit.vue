<template>
  <div>
    <el-dialog
      title="修改部门"
      :visible.sync="dialogVisible"
      width="50%"
      @close="clearText(tname)"
      v-if="editDeptForm"
    >
      <el-form
        :model="editDeptForm"
        :rules="editDeptFormRules"
        ref="editDeptFormRef"
        label-width="100px"
      >
        <el-form-item label="部门全称" prop="fullname">
          <el-input v-model="editDeptForm.fullname"></el-input>
        </el-form-item>
        <el-form-item label="部门简称" prop="simplename">
          <el-input v-model="editDeptForm.simplename"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDept">确 定 </el-button>
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
      editDeptForm: {
        fullname: "",
        simplename: ""
      },
      editDeptFormRules: {
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
    },
    //获取数据
    currentRow() {
      var json = {};
      //   格式转换字符串
      for (var i in this.currentRow) {
        this.$set(json, i, this.currentRow[i].toString());
      }
      this.editDeptForm = json;
    }
  },
  methods: {
    editDept() {
      //pid
      this.editDeptForm.pid = this.currentRow.pid;
      //排序
      this.editDeptForm.num = 0;
      //id
      this.editDeptForm.id = this.currentRow.id;
      this.$refs.editDeptFormRef.validate(valid => {
        if (!valid) {
          return this.$msg.error("校验失败");
        }
        this.$http
          .post(http + dept, JSON.stringify(this.editDeptForm), {
            emulateJSON: true
          })
          .then(res => {
            this.$msg.success("修改部门成功");
            this.dialogVisible = false;
          })
          .catch(err => {
            this.$msg.error(err.data.message);
            this.dialogVisible = false;
          });
      });
    },
    clearText(tname) {
      this.$refs.editDeptFormRef.resetFields();
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
