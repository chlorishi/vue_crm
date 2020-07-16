<template>
  <div>
    <el-card>
      <div class="mgr-header">
        <!-- 搜索文件 -->
        <el-input
          placeholder="请输入内容"
          class="header-left"
          v-model="fileInfo.originalFileName"
          clearable
          @clear="getUserList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getUserList"
          ></el-button>
        </el-input>

        <!-- 权限功能 -->
        <!-- <el-button
            type="primary"
            v-for="item in menulist"
            :key="item.id"
            @click="btn(item.code)"
          >
            {{ item.name }}
          </el-button> -->

        <el-upload
          class="upload-demo"
          drag
          :action="upfileurl"
          multiple
          :headers="headers"
          :on-success="success"
          :on-error="error"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </div>

      <!-- 文件信息列表 -->
      <el-table
        :data="tableData"
        style="width: 100% ;margin:15px 0;"
        border
        highlight-current-row
        @cell-click="handleCurrentChange1"
        ref="singleTable"
        max-height="740"
      >
        <el-table-column label="图片名称" prop="originalFileName">
        </el-table-column>
        <el-table-column label="id" prop="id"> </el-table-column>
        <el-table-column label="创建时间" prop="createTime"> </el-table-column>
        <el-table-column label="预览">
          <template v-slot="props">
            <img
              :src="publicimg + props.row.originalFileName"
              style="height:100px"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="props">
            <el-button
              type="primary"
              size="mini"
              @click="downloadFile(props.row)"
              >下载</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="fileInfo.page"
        :page-sizes="[5, 8, 10, 15]"
        :page-size="fileInfo.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加文件对话框 -->
    <!-- <mgr-add
      :type="btntype.mgrAdd"
      :resetClose="resetClose"
      tname="mgrAdd"
    ></mgr-add> -->
    <!-- 修改文件信息对话框 -->
    <!-- <mgr-edit
      :type="btntype.mgrEdit"
      :resetClose="resetClose"
      tname="mgrEdit"
      :currentRow="currentRow"
    ></mgr-edit> -->
    <!-- 删除文件信息对话框 -->
    <!-- <mgr-delete
      :type="btntype.mgrDelete"
      :resetClose="resetClose"
      tname="mgrDelete"
      :currentRow="currentRow"
    ></mgr-delete> -->
    <!-- 设置角色对话框 -->
    <!-- <mgr-set-role
      :type="btntype.mgrSetRole"
      :resetClose="resetClose"
      tname="mgrSetRole"
      :currentRow="currentRow"
    ></mgr-set-role> -->
  </div>
</template>

<script>
import { http, filelist, downloadfile, publicimg, file } from "../../api/api";
// import mgrAdd from "./mgrAdd";
// import mgrEdit from "./mgrEdit";
// import mgrDelete from "./mgrDelete";
// import mgrSetRole from "./mgrSetRole";
export default {
  components: {
    // "mgr-add": mgrAdd,
    // "mgr-edit": mgrEdit,
    // "mgr-delete": mgrDelete,
    // "mgr-set-role": mgrSetRole
  },
  data() {
    return {
      //请求列表数据参数
      fileInfo: {
        page: 1,
        limit: 5,
        originalFileName: ""
      },
      //文件列表数据
      tableData: [],
      //总页数
      total: 0,
      //功能对话框状态
      btntype: {
        // mgrAdd: false,
        // mgrEdit: false,
        // mgrDelete: false,
        // mgrSetRole: false
      },
      //被选中数据
      currentRow: null,
      publicimg: publicimg,
      upfileurl: http + file, //文件上传的地址
      headers: {
        //文件上传的请求头
        "constnet-type": "multipart/form-data",
        Authorization: localStorage.token
      }
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
    success(data) {
      if (data.msg == "成功") {
        this.getUserList();
      } else {
        this.$message.error(data.message);
      }
    },
    error(err) {
      this.$message.error(err.message);
    },
    downloadFile(row) {
      //下载按钮
      location.href =
        http +
        downloadfile +
        "?idFile=" +
        row.id +
        "&fileName=" +
        row.originalFileName;
    },

    //获取文件信息列表
    getUserList() {
      this.$http
        .get(http + filelist, { params: this.fileInfo })
        .then(res => {
          if (res.data.msg == "成功") {
            this.tableData = res.data.data.records;
            this.total = res.data.data.total;
            console.log(this.tableData);
          } else {
            this.$msg.error(res.data.msg);
          }
        })
        .catch(err => this.$msg.error(err.data.message));
    },
    handleSizeChange(val) {
      this.fileInfo.limit = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.fileInfo.page = val;
      this.getUserList();
    },
    //不同功能权限的点击事件
    btn(key) {
      if (key == "mgrAdd") {
        this.btntype[key] = true;
      } else {
        if (this.currentRow == null) {
          this.$msg.error("请选择要操作的文件");
        } else {
          if (key == "mgrFreeze") {
            if (this.currentRow.statusName == "禁用") {
              return this.$msg.info("该文件已经是禁用状态");
            }
            this.btntype[key] = true;
          } else if (key == "mgrUnfreeze") {
            if (this.currentRow.statusName == "启用") {
              return this.$msg.info("该文件已经是启用状态");
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

.upload-demo>>>.el-upload-dragger {
  width: 200px;
  height: 150px;
}
</style>
