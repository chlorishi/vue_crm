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

      <!-- 部门信息列表 -->
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
        <el-table-column prop="simplename" label="部门简称" sortable>
        </el-table-column>
        <el-table-column prop="fullname" label="部门全称" sortable>
        </el-table-column>
        <el-table-column prop="id" label="部门ID"> </el-table-column>
      </el-table>
    </el-card>

    <!-- 创建部门对话框 -->
    <dept-add
      :type="btntype.deptAdd"
      :resetClose="resetClose"
      tname="deptAdd"
      :currentRow="currentRow"
    ></dept-add>

    <!-- 修改部门对话框 -->
    <dept-edit
      :type="btntype.deptEdit"
      :resetClose="resetClose"
      tname="deptEdit"
      :currentRow="currentRow"
    ></dept-edit>

    <!-- 删除角色对话框 -->
    <dept-delete
      :type="btntype.deptDelete"
      :resetClose="resetClose"
      tname="deptDelete"
      :currentRow="currentRow"
    ></dept-delete>

  </div>
</template>

<script>
import { http, deptlist } from "../../api/api";
import deptAdd from "./deptAdd";
import deptEdit from "./deptEdit";
import deptDelete from "./deptDelete";
export default {
  components: {
    "dept-add": deptAdd,
    "dept-edit": deptEdit,
    "dept-delete": deptDelete,

  },
  data() {
    return {
      //列表数据
      tableData: [],
      //功能对话框状态
      btntype: {
        deptAdd: false,
        deptEdit: false,
        deptDelete: false,
      },
      //被选中数据
      currentRow: null
    };
  },
  mounted() {
    this.getDeptList();
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
    getDeptList() {
      this.$http
        .get(http + deptlist)
        .then(res => {
          if (res.data.msg == "成功") {
            console.log(res.data.data);
            this.tableData = res.data.data;
          } else {
            this.$msg.error(res.data.message);
          }
        })
        .catch(err => this.$msg.error(err.data.message));
    },
    //不同功能权限的点击事件
    btn(key) {
      if (key == "deptAdd") {
        this.btntype[key] = true;
      } else {
        if (this.currentRow == null) {
          this.$msg.error("请选择要操作的部门");
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
      this.getDeptList();
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
  justify-content: left;
  align-items: center;
}

.header-right {
  display: flex;
}
</style>
