<template>
  <div>
    <el-dialog
      title="添加字典"
      :visible.sync="dialogVisible"
      width="50%"
      @close="clearText(tname)"
    >
      <el-alert
        center
        :closable="false"
        type="success"
        title="提交前请注意补全字典详情信息"
      >
      </el-alert>
      <el-form
        :model="addDictForm"
        :rules="addDictFormRules"
        ref="addDictFormRef"
        label-width="100px"
      >
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="addDictForm.dictName"></el-input>
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
        <el-button type="primary" @click="addDict">确 定 </el-button>
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
      addDictForm: {
        dictName: "",
        dictValues: ""
      },
      addDictFormRules: {
        dictName: [
          { required: true, message: "请输入字典名称", trigger: "blur" }
        ]
      },
      statuslist: []
    };
  },
  props: ["type", "resetClose", "tname"],
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

    addDict() {
      //处理参数
      var str = "";
      this.statuslist.forEach(item => {
        str += item.status + ":" + item.content + ";";
      });
      this.addDictForm.dictValues = str.slice(0, -1);

      this.$refs.addDictFormRef.validate(valid => {
        if (!valid) {
          return this.$msg.error("校验失败");
        }
        this.$http
          .post(http + dict, this.addDictForm, {
            emulateJSON: true
          })
          .then(res => {
            this.$msg.success("创建字典成功");
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
      this.$refs.addDictFormRef.resetFields();
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
