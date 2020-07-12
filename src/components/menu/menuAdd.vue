<template>
  <div>
    <el-dialog
      title="创建菜单"
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
        title="当前创建的为一级菜单。如要创建子级菜单，请选择对应上级菜单"
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
            currentRow.name +
            '  的子级菜单。如要创建一级菜单，请取消选择'
        "
      >
      </el-alert>

      <el-form
        :model="addMenuForm"
        :rules="addMenuFormRules"
        ref="addMenuFormRef"
        label-width="100px"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="addMenuForm.name"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="addMenuForm.code"></el-input>
        </el-form-item>
        <el-form-item label="组件" prop="component">
          <el-input v-model="addMenuForm.component"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="url">
          <el-input v-model="addMenuForm.url"></el-input>
        </el-form-item>

        <el-form-item label="是否是菜单" prop="ismenu">
          <el-radio-group v-model="addMenuForm.ismenu">
            <el-radio label="1">菜单</el-radio>
            <el-radio label="0">按钮</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="addMenuForm.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">弃用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMenu">确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { http, menu } from "../../api/api";
export default {
  data() {
    return {
      dialogVisible: this.type,
      addMenuForm: {
        name: "",
        component: "",
        url: "",
        ismenu: "1",
        code: "",
        status: "1"
      },
      addMenuFormRules: {
        name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        component: [{ required: true, message: "请输入组件", trigger: "blur" }],
        url: [{ required: true, message: "请输入链接", trigger: "blur" }],
        ismenu: [{ required: true, message: "是否为菜单", trigger: "blur" }],
        code: [{ required: true, message: "请输入编码", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }]
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
    addMenu() {
      //pcode
      if (this.currentRow) {
        this.addMenuForm.pcode = this.currentRow.code;
      } else {
        this.addMenuForm.pcode = 0;
      }
      //排序
      this.addMenuForm.num = 0;

      this.$refs.addMenuFormRef.validate(valid => {
        if (!valid) {
          return this.$msg.error("校验失败");
        }
        this.$http
          .post(http + menu, JSON.stringify(this.addMenuForm), {
            emulateJSON: true
          })
          .then(res => {
            this.$msg.success("创建菜单成功");
            this.dialogVisible = false;
          })
          .catch(err => {
            this.$msg.error(err.data.message);
            this.dialogVisible = false;
          });
      });
    },
    clearText(tname) {
      this.$refs.addMenuFormRef.resetFields();
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
