<template>
  <div id="app">
    <el-container>
      <el-aside style="width:auto">
        <!-- 导航 -->

        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          :collapse-transition="false"
          :unique-opened="true"
          v-if="$store.state.menu.menu && $store.state.user.info.permissions"
          router
        >
          <el-menu-item index="/">
            <i class="el-icon-location"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu
            :index="item.path"
            v-for="item in $store.state.menu.menu"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconType[item.id]"></i>
              <span slot="title">{{ item.name }}{{ item.path }}</span>
            </template>
            <el-menu-item
              v-for="item1 in item.children"
              :key="item1.id"
              :index="item1.path"
              :disabled="
                $store.state.user.info.permissions.indexOf(item1.path) == -1
              "
            >
              <i :class="iconType[item1.id]"></i>
              <span slot="title">{{ item1.name }}{{ item1.path }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <!-- 导航结束 -->
      </el-aside>
      <el-main
        v-if="$store.state.user.info.profile && $store.state.user.menulist"
      >
        <!-- main头部 -->
        <div class="main-header">
          <div class="header-left">
            <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
              <el-radio-button :label="false">展开</el-radio-button>
              <el-radio-button :label="true">收起</el-radio-button>
            </el-radio-group>
          </div>
          <div class="header-right">
            <div class="userInfo-box">
              当前账号:
              <el-tag class="username-box"
                ><router-link to="/info">{{
                  $store.state.user.info.profile.name
                }}</router-link></el-tag
              >
            </div>
            <el-button type="danger" @click="clearUser">退出登录</el-button>
          </div>
        </div>

        <div><router-view></router-view></div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { http, listForRouter, info, menulist } from "./api/api";
export default {
  name: "app",
  data() {
    return {
      isCollapse: false,
      iconType: {
        1: "el-icon-setting",
        2: "el-icon-tickets",
        4: "el-icon-user",
        12: "el-icon-s-custom",
        21: "el-icon-s-check",
        17: "el-icon-menu",
        22: "el-icon-collection",
        41: "el-icon-s-order",
        42: "el-icon-notebook-1",
        46: "el-icon-document-add",
        45: "el-icon-folder"
      }
    };
  },
  methods: {
    //获取导航
    getMenu() {
      this.$http
        .get(http + listForRouter)
        .then(res => this.$store.commit("setMenu", res.data.data))
        .catch(err => this.$msg.error(err.data.message));
    },
    //获取当前账户信息
    getInfo() {
      this.$http
        .get(http + info)
        .then(res => this.$store.commit("setInfo", res.data.data))
        .catch(err => this.$msg.error(err.data.message));
    },
    //获取操作项
    getMenuList() {
      this.$http
        .get(http + menulist)
        .then(res => {
          var data = res.data.data;
          var json = {};
          //循环父级
          data.forEach(item => {
            item.children.forEach(item1 => {
              this.$set(json, item1.url, item1.children);
            });
          });
          this.$store.commit("setMenuList", json);
        })
        .catch(err => this.$msg.error(err.data.message));
    },
    //退出登录
    clearUser() {
      this.$confirm("您确定退出登录吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          localStorage.clear();
          location.href = "./login.html";
          this.$msg({
            type: "success",
            message: "退出成功!"
          });
        })
        .catch(() => {
          this.$msg({
            type: "info",
            message: "已取消操作"
          });
        });
    }
  },
  mounted() {
    this.getMenu();
    this.getInfo();
    this.getMenuList();
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  text-decoration: none;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu-vertical-demo {
  min-height: 500px;
}
.el-main {
  padding: 0;
  overflow: hidden;
  padding: 0 10px;
}
.main-header {
  display: flex;
  height: 60px;
  justify-content: space-between;
  align-items: center;
}
.header-right {
  display: flex;
  justify-content: space-between;
  align-content: center;
  height: 40px;
}
.el-radio-group {
  margin: 0 !important;
}
.userInfo-box {
  line-height: 40px;
  margin-right: 10px;
}
.username-box {
  font-size: 14px;
}
</style>
