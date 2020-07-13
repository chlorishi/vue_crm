<template>
  <div>
    <el-dialog
      title="修改栏目"
      :visible.sync="dialogVisible"
      width="50%"
      @close="clearText(tname)"
      v-if="editChannelForm"
    >
      <el-form
        :model="editChannelForm"
        :rules="editChannelFormRules"
        ref="editChannelFormRef"
        label-width="100px"
      >
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="editChannelForm.name"></el-input>
        </el-form-item>
        <el-form-item label="类型编码" prop="code">
          <el-input v-model="editChannelForm.code"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editChannel">确 定 </el-button>
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
      editChannelForm: {
        name: "",
        code: "",
        id: ""
      },
      editChannelFormRules: {
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
    },
    //获取数据
    currentRow() {
      var json = {};
      //   格式转换字符串
      for (var i in this.currentRow) {
        this.$set(json, i, this.currentRow[i].toString());
      }
      this.editChannelForm = json;
    }
  },
  methods: {
    editChannel() {
      this.$refs.editChannelFormRef.validate(valid => {
        if (!valid) {
          return this.$msg.error("校验失败");
        }
        this.$http
          .post(
            http + channel,
            {
              name: this.editChannelForm.name,
              code: this.editChannelForm.code,
              id: this.editChannelForm.id
            },
            {
              emulateJSON: true
            }
          )
          .then(res => {
            this.$msg.success("修改栏目成功");
            this.dialogVisible = false;
          })
          .catch(err => {
            this.$msg.error(err.data.message);
            this.dialogVisible = false;
          });
      });
    },
    clearText(tname) {
      this.$refs.editChannelFormRef.resetFields();
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
