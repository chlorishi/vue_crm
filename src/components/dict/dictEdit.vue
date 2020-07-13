<template>
  <div>
    <el-dialog
      title="修改字典"
      :visible.sync="dialogVisible"
      width="50%"
      @close="clearText(tname)"
      @open="showDialog"
    >
      <el-alert
        center
        :closable="false"
        type="success"
        title="提交前请注意补全字典详情信息"
      >
      </el-alert>
      <el-form
        :model="editDictForm"
        :rules="editDictFormRules"
        ref="editDictFormRef"
        label-width="100px"
      >
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="editDictForm.dictName"></el-input>
        </el-form-item>

        <div v-show="statuslist.length != 0">
          <div>字典详情</div>
          <el-row :gutter="20" v-for="(item, index) in statuslist" :key="index">
            <el-col :span="10">
              <el-form-item label="状态码">
                <el-input v-model="item.status"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="状态描述">
                <el-input v-model="item.content"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button type="danger" @click="statuslist.splice(index, 1)"
                >移除</el-button
              >
            </el-col>
          </el-row>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="statusPush">添加字典详情</el-button>
        <el-button type="primary" @click="editDict">确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { http, dict } from "../../api/api";
export default {
  data() {
    return {
      dialogVisible: this.type,
      editDictForm: {
        dictName: "",
        dictValues: "",
        id: ""
      },
      editDictFormRules: {
        dictName: [
          { required: true, message: "请输入字典名称", trigger: "blur" }
        ]
      },
      statuslist: []
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
    //添加字典详情
    statusPush() {
      this.statuslist.push({
        status: "",
        content: ""
      });
    },
    showDialog() {
      var obj = {};
      this.editDictForm.dictName = this.currentRow.name;
      this.editDictForm.id = this.currentRow.id;

      this.currentRow.detail.split(",").forEach(item => {
        obj["status"] = item.split(":")[0];
        obj["content"] = item.split(":")[1];
        this.statuslist.push(obj);
        obj = {};
      });
    },
    editDict() {
      //处理参数
      var str = "";
      this.statuslist.forEach(item => {
        str += item.status + ":" + item.content + ";";
      });
      this.editDictForm.dictValues = str.slice(0, -1);

      this.$refs.editDictFormRef.validate(valid => {
        if (!valid) {
          return this.$msg.error("校验失败");
        }
        this.$http
          .put(http + dict, this.editDictForm, {
            emulateJSON: true
          })
          .then(res => {
            this.$msg.success("修改字典成功");
            this.dialogVisible = false;
          })
          .catch(err => {
            this.$msg.error(err.data.message);
            this.dialogVisible = false;
          });
      });
    },
    clearText(tname) {
      this.statuslist = [];
      this.$refs.editDictFormRef.resetFields();
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
