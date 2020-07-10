<template>
  <div>
    <el-card>
      <el-table :data="infoTableData" style="width: 100%" border stripe>
        <el-table-column prop="account" label="账号"> </el-table-column>
        <el-table-column prop="name" label="账号名称"> </el-table-column>
        <el-table-column prop="birthday" label="生日"> </el-table-column>
        <el-table-column label="性别">
          <template v-slot:default="props">
            {{ props.row.sex === 1 ? "男" : "女" }}
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="phone" label="联系方式"> </el-table-column>
        <el-table-column prop="dept" label="部门"> </el-table-column>
        <el-table-column label="修改密码">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editDialogVisible = true"
          ></el-button>
        </el-table-column>
      </el-table>
    </el-card>
    <set-password
      :editDialogVisible="editDialogVisible"
      :btn="btn"
    ></set-password>
  </div>
</template>

<script>
import { mapState } from "vuex";
import setPassword from "./setPassword";
export default {
  data() {
    return {
      editDialogVisible: false,
      infoTableData: [this.$store.state.user.info.profile]
    };
  },
  //部件
  components: {
    setPassword
  },
  //属性的结果会被缓存，除非依赖的响应式属性变化才会重新计算。主要当作属性来使用；
  computed: {
    ...mapState(["user"])
  },
  //方法表示一个具体的操作，主要书写业务逻辑；
  methods: {
    //改变对话框状态
    btn() {
      this.editDialogVisible = false;
    }
  },
  //请求数据
  created() {},
  mounted() {}
};
</script>

<style scoped>
</style>

