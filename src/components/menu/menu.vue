<template>
  <div>
    <el-card>
      <div class="mgr-header">
        <div class="header-right">
          <!-- 权限功能 -->
          <el-button
            type="primary"
            v-for="item in menulist"
            :key="item.id"
            @click="btn(item.code)"
          >
            {{ item.name }}
          </el-button>
        </div>
      </div>

      <!-- 用户信息列表 -->
      <el-table
        :data="tableData"
        style="width: 100% ;margin:15px 0;"
        max-height="740"
        highlight-current-row
        ref="singleTable"
        @cell-click="handleCurrentChange1"
        row-key="id"
        border
        :tree-props="{ children: 'children' }"
      >
        <el-table-column prop="name" label="菜单名称" sortable>
        </el-table-column>
        <el-table-column prop="url" label="链接标识" sortable>
        </el-table-column>
        <el-table-column prop="isMenuName" label="是否是菜单">
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template v-slot="props">
            <el-tag v-if="props.row.status == 0" type="warning">弃用</el-tag>
            <el-tag v-else-if="props.row.status == 1" type="success"
              >启用</el-tag
            >
            <el-tag v-else type="danger">删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="菜单ID"> </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加菜单对话框 -->
    <menu-add
      :type="btntype.menuAdd"
      :resetClose="resetClose"
      tname="menuAdd"
      :currentRow="currentRow"
    ></menu-add>
    <!-- 修改菜单信息对话框 -->
    <menu-edit
      :type="btntype.menuEdit"
      :resetClose="resetClose"
      tname="menuEdit"
      :currentRow="currentRow"
    ></menu-edit>
    <!-- 删除菜单信息对话框 -->
    <menu-delete
      :type="btntype.menuDelete"
      :resetClose="resetClose"
      tname="menuDelete"
      :currentRow="currentRow"
    ></menu-delete>
  </div>
</template>

<script>
import { http, menulist } from "../../api/api";
import menuAdd from "./menuAdd";
import menuEdit from "./menuEdit";
import menuDelete from "./menuDelete";
export default {
  components: {
    "menu-add": menuAdd,
    "menu-edit": menuEdit,
    "menu-delete": menuDelete
  },
  data() {
    return {
      //菜单列表数据
      tableData: [],

      //功能对话框状态
      btntype: {
        menuAdd: false,
        menuEdit: false,
        menuDelete: false
      },
      //被选中数据
      currentRow: null
    };
  },
  mounted() {
    this.getMenuList();
  },
  computed: {
    //筛选启用权限功能
    menulist() {
      return this.$store.state.user.menulist[this.$route.path].filter(item => {
        return item.statusName == "启用";
      });
    }
  },
  methods: {
    //获取菜单信息列表
    getMenuList() {
      this.$http
        .get(http + menulist)
        .then(res => {
          if (res.data.msg == "成功") {
            this.tableData = res.data.data;
          } else {
            this.$msg.error(res.data.msg);
          }
        })
        .catch(err => this.$msg.error(err.data.message));
    },

    //不同功能权限的点击事件
    btn(key) {
      if (key == "menuAdd") {
        this.btntype[key] = true;
      } else {
        if (this.currentRow == null) {
          this.$msg.error("请选择要操作的菜单");
        } else {
          if (key == "mgrFreeze") {
            if (this.currentRow.statusName == "禁用") {
              return this.$msg.info("该用户已经是禁用状态");
            }
            this.btntype[key] = true;
          } else if (key == "mgrUnfreeze") {
            if (this.currentRow.statusName == "启用") {
              return this.$msg.info("该用户已经是启用状态");
            }
            this.btntype[key] = true;
          } else {
            this.btntype[key] = true;
          }
        }
      }
    },
    //选择表格数据
    handleCurrentChange1(val) {
      this.currentRow = val;
    },
    //重置功能对话框
    resetClose(type) {
      this.btntype[type] = false;
      this.getMenuList();
      this.currentRow = null;
      this.$refs.singleTable.setCurrentRow();
    }
  }
};
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.mgr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-left {
  width: 300px;
}
</style>
