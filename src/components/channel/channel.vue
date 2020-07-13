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

      <!-- 栏目信息列表 -->
      <el-table
        :data="tableData"
        style="width: 100% ;margin:15px 0;"
        max-height="740"
        highlight-current-row
        ref="singleTable"
        @cell-click="handleCurrentChange1"
        border
      >
        <el-table-column prop="name" label="分类名称"> </el-table-column>
        <el-table-column prop="modifyTime" label="更新时间" sortable>
        </el-table-column>
        <el-table-column prop="code" label="编码"> </el-table-column>
      </el-table>
    </el-card>

    <!-- 创建栏目对话框 -->
    <channel-add
      :type="btntype.channeladd"
      :resetClose="resetClose"
      tname="channeladd"
      :currentRow="currentRow"
    ></channel-add>

    <!-- 修改栏目对话框 -->
    <channel-edit
      :type="btntype.channelEdit"
      :resetClose="resetClose"
      tname="channelEdit"
      :currentRow="currentRow"
    ></channel-edit>

    <!-- 删除栏目对话框 -->
    <channel-delete
      :type="btntype.channelDelete"
      :resetClose="resetClose"
      tname="channelDelete"
      :currentRow="currentRow"
    ></channel-delete>
  </div>
</template>

<script>
import { http, channellist } from "../../api/api";
import channelAdd from "./channelAdd";
import channelEdit from "./channelEdit";
import channelDelete from "./channelDelete";
export default {
  components: {
    "channel-add": channelAdd,
    "channel-edit": channelEdit,
    "channel-delete": channelDelete
  },
  data() {
    return {
      //列表数据
      tableData: [],
      //功能对话框状态
      btntype: {
        channeladd: false,
        channelEdit: false,
        channelDelete: false
      },
      //被选中数据
      currentRow: null
    };
  },
  mounted() {
    this.getChannelList();
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
    //获取栏目信息列表
    getChannelList() {
      this.$http
        .get(http + channellist)
        .then(res => {
          if (res.data.msg == "成功") {
            console.log(res.data.data);
            this.tableData = res.data.data;
          } else {
            this.$msg.error(res.data.msg);
          }
        })
        .catch(err => this.$msg.error(err.data.message));
    },
    //不同功能权限的点击事件
    btn(key) {
      if (key == "channeladd") {
        this.btntype[key] = true;
      } else {
        if (this.currentRow == null) {
          this.$msg.error("请选择要操作的栏目");
        } else {
          if (key == "mgrFreeze") {
            if (this.currentRow.statusName == "禁用") {
              return this.$msg.info("该栏目已经是禁用状态");
            }
            this.btntype[key] = true;
          } else if (key == "mgrUnfreeze") {
            if (this.currentRow.statusName == "启用") {
              return this.$msg.info("该栏目已经是启用状态");
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
      this.getChannelList();
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
