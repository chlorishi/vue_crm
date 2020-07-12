<template>
  <div>
    <el-card>
      <div class="mgr-header">
        <!-- 搜索用户 -->
        <el-input
          placeholder="请输入内容"
          class="header-left"
          v-model="userListInfo.name"
          clearable
          @clear="getUserList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getUserList"
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

      <!-- 用户信息列表 -->
      <el-table
        :data="tableData"
        style="width: 100% ;margin:15px 0;"
        border
        highlight-current-row
        @cell-click="handleCurrentChange1"
        ref="singleTable"
        max-height="740"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="昵称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="账号">
                <span>{{ props.row.account }}</span>
              </el-form-item>
              <el-form-item label="角色">
                <span>{{ props.row.roleName }}</span>
              </el-form-item>
              <el-form-item label="部门">
                <span>{{ props.row.deptName }}</span>
              </el-form-item>
              <el-form-item label="状态">
                <span>{{ props.row.statusName }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.createTime }}</span>
              </el-form-item>
              <el-form-item label="性别">
                <span>{{ props.row.sex == "1" ? "男" : "女" }}</span>
              </el-form-item>
              <el-form-item label="手机号">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="邮箱">
                <span>{{ props.row.email }}</span>
              </el-form-item>
              <el-form-item label="生日">
                <span>{{ props.row.birthday }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="昵称" prop="name"> </el-table-column>
        <el-table-column label="账号" prop="account"> </el-table-column>
        <el-table-column label="状态" prop="statusName"> </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userListInfo.page"
        :page-sizes="[5, 8, 10, 15]"
        :page-size="userListInfo.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <mgr-add
      :type="btntype.mgrAdd"
      :resetClose="resetClose"
      tname="mgrAdd"
    ></mgr-add>
    <!-- 修改用户信息对话框 -->
    <mgr-edit
      :type="btntype.mgrEdit"
      :resetClose="resetClose"
      tname="mgrEdit"
      :currentRow="currentRow"
    ></mgr-edit>
    <!-- 删除用户信息对话框 -->
    <mgr-delete
      :type="btntype.mgrDelete"
      :resetClose="resetClose"
      tname="mgrDelete"
      :currentRow="currentRow"
    ></mgr-delete>
    <!-- 设置角色对话框 -->
    <mgr-set-role
      :type="btntype.mgrSetRole"
      :resetClose="resetClose"
      tname="mgrSetRole"
      :currentRow="currentRow"
    ></mgr-set-role>
  </div>
</template>

<script>
import { http, userlist } from "../../api/api";
import mgrAdd from "./mgrAdd";
import mgrEdit from "./mgrEdit";
import mgrDelete from "./mgrDelete";
import mgrSetRole from "./mgrSetRole";
export default {
  components: {
    "mgr-add": mgrAdd,
    "mgr-edit": mgrEdit,
    "mgr-delete": mgrDelete,
    "mgr-set-role": mgrSetRole
  },
  data() {
    return {
      //请求列表数据参数
      userListInfo: {
        page: 1,
        limit: 5,
        name: ""
      },
      //用户列表数据
      tableData: [],
      //总页数
      total: 0,
      //功能对话框状态
      btntype: {
        mgrAdd: false,
        mgrEdit: false,
        mgrDelete: false,
        mgrSetRole: false
      },
      //被选中数据
      currentRow: null
    };
  },
  mounted() {
    this.getUserList();
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
    //获取用户信息列表
    getUserList() {
      this.$http
        .get(http + userlist, { params: this.userListInfo })
        .then(res => {
          if (res.data.msg == "成功") {
            this.tableData = res.data.data.records;
            this.total = res.data.data.total;
          } else {
            this.$msg.error(res.data.msg);
          }
        })
        .catch(err => this.$msg.error(err.data.message));
    },
    handleSizeChange(val) {
      this.userListInfo.limit = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.userListInfo.page = val;
      this.getUserList();
    },
    //不同功能权限的点击事件
    btn(key) {
      if (key == "mgrAdd") {
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
      this.getUserList();
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
.header-right {
  display: flex;
}
</style>
