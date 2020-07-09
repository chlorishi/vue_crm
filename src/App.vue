<template>
  <div id="app">
    <el-container>
      <el-aside style="width:auto">
        <!-- 导航 -->
        <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
          <el-radio-button :label="false">展开</el-radio-button>
          <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group>

        <el-menu
          default-active="/mgr"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          :collapse-transition="false"
          :unique-opened="true"
          v-if="$store.state.menu.menu && $store.state.user.info.permissions"
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
              :disabled="$store.state.user.info.permissions.indexOf(item1.path)==-1"
            >
              <i :class="iconType[item1.id]"></i>
              <span slot="title">{{ item1.name }}{{ item1.path }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <!-- 导航结束 -->
      </el-aside>
      <el-main>{{
        $store.state.user.info
      }}</el-main>
    </el-container>
  </div>
</template>

<script>
import { http, listForRouter, info } from "./api/api";
export default {
  name: "app",
  data() {
    return {
      isCollapse: true,
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
        .catch(err => (location.href = "./login.html"));
    },
    //获取当前账户信息
    getInfo() {
      this.$http
        .get(http + info)
        .then(res => this.$store.commit("setInfo", res.data.data))
        .catch(err => (location.href = "./login.html"));
    }
  },
  mounted() {
    this.getMenu();
    this.getInfo();
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu-vertical-demo {
  min-height: 500px;
}
</style>
