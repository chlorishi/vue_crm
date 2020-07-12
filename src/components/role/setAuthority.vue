<template>
  <div>
    <el-dialog
      title="配置权限"
      :visible.sync="dialogVisible"
      width="50%"
      @close="clearText(tname)"
      @open="getMenuTree"
    >
      <div v-if="menuTree && checkedIds">
        <el-tree
          :data="menuTree"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          :default-expanded-keys="checkedIds"
          :default-checked-keys="checkedIds"
          current-node-key
          ref="roleTree"
        >
        </el-tree>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setAuth">确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { http, menuTreeListByRoleId, savePermisson } from "../../api/api";
export default {
  data() {
    return {
      dialogVisible: this.type,
      menuTree: [],
      checkedIds: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      //菜单权限id数组
      permissions: []
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
    setAuth() {
      //获取被选择的权限ID
      this.permissions = [
        ...this.$refs.roleTree.getCheckedKeys(),
        ...this.$refs.roleTree.getHalfCheckedKeys()
      ].toString();
      this.$http
        .post(
          http + savePermisson,
          { roleId: this.currentRow.id, permissions: this.permissions },
          {
            emulateJSON: true
          }
        )
        .then(res => {
          this.$msg.success(res.data.msg);
          this.dialogVisible = false;
        })
        .catch(err => {
          this.$msg.error(err.data.message);
          this.dialogVisible = false;
        });
    },
    clearText(tname) {
      this.resetClose(tname);
    },
    getMenuTree() {
      this.$http
        .get(http + menuTreeListByRoleId, {
          params: { roleId: this.currentRow.id }
        })
        .then(res => {
          this.menuTree = res.data.data.treeData;
          this.checkedIds = res.data.data.checkedIds;
        })
        .catch(err => this.$msg.error(err.data.message));
    }
  }
};
</script>

<style scoped>
</style>
