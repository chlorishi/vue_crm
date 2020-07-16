<template>
  <div>
    <el-card>
      <div class="mgr-header">
        <!-- 搜索文章 -->

        <div class="header-left">
          <el-input
            class="header-input"
            placeholder="标题"
            v-model="dataInfo.title"
            clearable
            @clear="getArticleList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getArticleList"
            ></el-button>
          </el-input>

          <el-input
            class="header-input"
            placeholder="作者"
            v-model="dataInfo.author"
            clearable
            @clear="getArticleList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getArticleList"
            ></el-button>
          </el-input>

          <!-- 时间选择 -->
          <el-date-picker
            v-model="dateValue"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @change="a"
            value-format="yyyyMMddHHmmss"
          >
          </el-date-picker>
        </div>

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

      <!-- 文章信息列表 -->
      <el-table
        :data="tableData"
        style="width: 100% ;margin:15px 0;"
        max-height="740"
        highlight-current-row
        ref="singleTable"
        @cell-click="handleCurrentChange1"
        border
      >
        <el-table-column prop="id" label="id"> </el-table-column>
        <el-table-column prop="title" label="文章标题"> </el-table-column>
        <el-table-column prop="author" label="作者"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间"> </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="dataInfo.page"
        :page-sizes="[5, 8, 10, 15]"
        :page-size="dataInfo.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 删除文章对话框 -->
    <article-delete
      :type="btntype.deleteArticle"
      :resetClose="resetClose"
      tname="deleteArticle"
      :currentRow="currentRow"
    ></article-delete>
  </div>
</template>

<script>
import { http, articlelist } from "../../api/api";

import deleteArticle from "./deleteArticle";
export default {
  components: {
    "article-delete": deleteArticle
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      dateValue: "",
      //请求数据信息
      dataInfo: {
        title: "",
        author: "",
        page: 1,
        limit: 5,
        startDate: "",
        endDate: ""
      },
      total: 0,
      //列表数据
      tableData: [],
      //功能对话框状态
      btntype: {
        deleteArticle: false
      },
      //被选中数据
      currentRow: null
    };
  },
  mounted() {
    this.getArticleList();
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
    //选择时间段搜索文章
    a() {
      if (this.dateValue != null) {
        this.dataInfo.startDate = this.dateValue[0];
        this.dataInfo.endDate = this.dateValue[1];
      } else {
        this.dataInfo.startDate = "";
        this.dataInfo.endDate = "";
      }
      this.getArticleList();
    },
    handleSizeChange(val) {
      this.dataInfo.limit = val;
      this.getArticleList();
    },
    handleCurrentChange(val) {
      this.dataInfo.page = val;
      this.getArticleList();
    },

    //获取文章信息列表
    getArticleList() {
      this.$http
        .get(http + articlelist, { params: this.dataInfo })
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
    //不同功能权限的点击事件
    btn(key) {
      if (this.currentRow == null) {
        this.$msg.error("请选择要操作的文章");
      } else {
        if (key == "update") {
          this.$router.push({
            name: "articleEdit",
            params: this.currentRow
          });
        }
        this.btntype[key] = true;
      }
    },
    //选择表格数据
    handleCurrentChange1(val) {
      this.currentRow = val;
    },
    //重置功能对话框
    resetClose(type) {
      this.btntype[type] = false;
      this.getArticleList();
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

.header-right {
  display: flex;
}
.header-left {
  display: flex;
  padding-right: 50px;
}
.header-input {
  padding-right: 10px;
  width: 300px;
}
</style>
