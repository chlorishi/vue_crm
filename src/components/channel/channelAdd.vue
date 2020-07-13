<template>
  <div>
    <el-dialog
      title="添加栏目"
      :visible.sync="dialogVisible"
      width="50%"
      @close="clearText(tname)"
    >
      <el-form
        :model="addChannelForm"
        :rules="addChannelFormRules"
        ref="addChannelFormRef"
        label-width="100px"
      >
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="addChannelForm.name"></el-input>
        </el-form-item>
        <el-form-item label="类型编码" prop="code">
          <el-input v-model="addChannelForm.code"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addChannel">确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { http, channel } from "../../api/api";
export default {
  data() {
    return {
      dialogVisible: this.type,
      addChannelForm: {
        name: "",
        code: ""
      },
      addChannelFormRules: {
        name: [{ required: true, message: "请输入类型名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入类型编码", trigger: "blur" }]
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
    addChannel() {
      this.$refs.addChannelFormRef.validate(valid => {
        if (!valid) {
          return this.$msg.error("校验失败");
        }
        this.$http
          .post(http + channel, this.addChannelForm, {
            emulateJSON: true
          })
          .then(res => {
            this.$msg.success("创建栏目成功");
            this.dialogVisible = false;
          })
          .catch(err => {
            this.$msg.error(err.data.message);
            this.dialogVisible = false;
          });
      });
    },
    clearText(tname) {
      this.$refs.addChannelFormRef.resetFields();
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
