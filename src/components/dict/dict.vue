<template>
  <div>
    <el-card>
      <div class="mgr-header">
        <!-- 搜索字典 -->
        <el-input
          placeholder="请输入内容"
          class="header-left"
          v-model="inputVal"
          clearable
          @clear="getDictList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getDictList"
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

      <!-- 字典信息列表 -->
      <el-table
        :data="tableData"
        style="width: 100% ;margin:15px 0;"
        border
        highlight-current-row
        @cell-click="handleCurrentChange1"
        ref="singleTable"
        max-height="740"
      >
        <el-table-column label="名称" prop="name"> </el-table-column>
        <el-table-column label="详情" prop="detail"> </el-table-column>
        <el-table-column label="ID" prop="id"> </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加字典对话框 -->
    <dict-add
      :type="btntype.dictAdd"
      :resetClose="resetClose"
      tname="dictAdd"
    ></dict-add>

    <!-- 修改字典信息对话框 -->
    <dict-edit
      :type="btntype.dictEdit"
      :resetClose="resetClose"
      tname="dictEdit"
      :currentRow="currentRow"
    ></dict-edit>

    <!-- 删除字典对话框 -->
    <dict-delete
      :type="btntype.dictDelete"
      :resetClose="resetClose"
      tname="dictDelete"
      :currentRow="currentRow"
    ></dict-delete>
  </div>
</template>

<script>
import { http, dictlist } from "../../api/api";
import dictAdd from "./dictAdd";
import dictEdit from "./dictEdit";
import dictDelete from "./dictDelete";

export default {
  components: {
    "dict-add": dictAdd,
    "dict-edit": dictEdit,
    "dict-delete": dictDelete
  },
  data() {
    return {
      //请求列表数据参数
      inputVal: "",
      //用户列表数据
      tableData: [],
      //功能对话框状态
      btntype: {
        dictAdd: false,
        dictEdit: false,
        dictDelete: false
      },
      //被选中数据
      currentRow: null
    };
  },
  mounted() {
    this.getDictList();
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
    //获取字典信息列表
    getDictList() {
      this.$http
        .get(http + dictlist, { params: { name: this.inputVal } })
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
      if (key == "dictAdd") {
        this.btntype[key] = true;
      } else {
        if (this.currentRow == null) {
          this.$msg.error("请选择要操作的字典");
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
      this.getDictList();
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
