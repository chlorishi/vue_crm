<template>
  <div>
    <el-dialog
      title="修改用户角色"
      :visible.sync="dialogVisible"
      width="50%"
      @close="clearText(tname)"
    >
      <el-form
        :model="form"
        ref="formRef"
        label-width="100px"
        v-if="currentRow"
      >
        <el-form-item label="账户" prop="account">
          <el-input v-model="form.account" disabled></el-input>
        </el-form-item>

        <el-form-item label="账户" prop="account">
          <el-select v-model="form.roleIds" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { http, roleTreeListByIdUser, setRole } from "../../api/api";
export default {
  data() {
    return {
      options: [],
      form: {
        roleIds: "",
        account: ""
      },
      dialogVisible: this.type,
      UserForm: null
    };
  },
  props: ["type", "resetClose", "tname", "currentRow"],
  mounted() {
    this.getRoleList();
  },
  watch: {
    //对话框显示隐藏
    type() {
      this.dialogVisible = this.type;
    },
    currentRow() {
      if (this.currentRow !== null) {
        this.form.roleIds = this.currentRow.roleid;
        this.form.account = this.currentRow.account;
      }
    }
  },
  methods: {
    clearText(tname) {
      this.resetClose(tname);
    },
    getRoleList() {
      this.$http
        .get(http + roleTreeListByIdUser, {
          params: { idUser: this.$store.state.user.info.profile.id }
        })
        .then(res => {
          this.options = res.data.data.treeData;
        })
        .catch(err => this.$msg.error(err.data.message));
    },
    setRole() {
      this.$http
        .get(http + setRole, {
          params: { userId: this.currentRow.id, roleIds: this.form.roleIds }
        })
        .then(res => {
          console.log(res);
          this.dialogVisible = false;
        })
        .catch(err => this.$msg.error(err.data.message));
    }
  }
};
</script>

<style scoped>
</style>
