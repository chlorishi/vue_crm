<template>
  <div>
    <el-card>
      <div class="mgr-header">
        <!-- 搜索角色 -->
        <el-input
          placeholder="请输入内容"
          class="header-left"
          v-model="inputVal"
          clearable
          @clear="getRoleList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getRoleList"
          ></el-button>
        </el-input>
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

      <!-- 角色信息列表 -->
      <el-table
        :data="tableData"
        style="width: 100% ;margin:15px 0;"
        border
        highlight-current-row
        @cell-click="handleCurrentChange1"
        ref="singleTable"
        max-height="740"
      >
        <el-table-column label="角色" prop="name"> </el-table-column>
        <el-table-column label="部门" prop="deptName"> </el-table-column>
        <el-table-column label="ID" prop="id"> </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <role-add
      :type="btntype.roleAdd"
      :resetClose="resetClose"
      tname="roleAdd"
    ></role-add>

    <!-- 修改角色信息对话框 -->
    <role-edit
      :type="btntype.roleEdit"
      :resetClose="resetClose"
      tname="roleEdit"
      :currentRow="currentRow"
    ></role-edit>

    <!-- 删除角色对话框 -->
    <role-delete
      :type="btntype.roleDelete"
      :resetClose="resetClose"
      tname="roleDelete"
      :currentRow="currentRow"
    ></role-delete>

    <!-- 设置角色对话框 -->
    <set-authority
      :type="btntype.roleSetAuthority"
      :resetClose="resetClose"
      tname="roleSetAuthority"
      :currentRow="currentRow"
    ></set-authority>
  </div>
</template>

<script>
import { http, rolelist, role } from "../../api/api";
import roleAdd from "./roleAdd";
import roleEdit from "./roleEdit";
import roleDelete from "./roleDelete";
import setAuthority from "./setAuthority";
export default {
  components: {
    "role-add": roleAdd,
    "role-edit": roleEdit,
    "role-delete": roleDelete,
    "set-authority": setAuthority
  },
  data() {
    return {
      //请求列表数据参数
      inputVal: "",
      //用户列表数据
      tableData: [],
      //功能对话框状态
      btntype: {
        roleAdd: false,
        roleEdit: false,
        roleDelete: false,
        roleSetAuthority: false
      },
      //被选中数据
      currentRow: null
    };
  },
  mounted() {
    this.getRoleList();
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
    //获取角色信息列表
    getRoleList() {
      this.$http
        .get(http + rolelist, { params: { name: this.inputVal } })
        .then(res => {
          if (res.data.msg == "成功") {
            this.tableData = res.data.data;
          } else {
            this.$msg.error(res.data.message);
          }
        })
        .catch(err => this.$msg.error(err.data.message));
    },
    //不同功能权限的点击事件
    btn(key) {
      if (key == "roleAdd") {
        this.btntype[key] = true;
      } else {
        if (this.currentRow == null) {
          this.$msg.error("请选择要操作的用户");
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
      this.getRoleList();
      this.currentRow = null;
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
.header-right {
  display: flex;
}
</style>
