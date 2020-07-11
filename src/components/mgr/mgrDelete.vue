<template>
  <div>
    <el-dialog
      title="删除用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="resetClose(tname)"
      v-if="currentRow"
    >
      <div class="del">
        您确定要删除
        <span>{{ currentRow.name }}</span>
        该用户吗？
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delUser">确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { http, updateUser } from "../../api/api";
export default {
  data() {
    return {
      dialogVisible: this.type
    };
  },
  props: ["type", "resetClose", "tname", "currentRow"],
  watch: {
    type() {
      this.dialogVisible = this.type;
    }
  },
  methods: {
    delUser() {
      this.$http
        .delete(http + updateUser, {
          params: { userId: this.currentRow.id }
        })
        .then(res => {
          if (res.data.msg == "成功") {
            this.$msg.success("删除用户成功");
            this.dialogVisible = false;
          } else {
            this.$msg.error(res.data.message);
          }
        })
        .catch(err => this.$msg.error(err.data.message));
    }
  }
};
</script>

<style scoped>
.del {
  text-align: center;
}
.del span {
  color: orange;
  font-weight: bold;
}
</style>
