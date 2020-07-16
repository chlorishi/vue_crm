import Vue from "vue";
import VueRouter from "vue-router";
import index from "../components/index.vue";
import info from "../components/info/info.vue";
import mgr from "../components/mgr/mgr.vue";
import role from "../components/role/role.vue";
import dept from "../components/dept/dept.vue";
import menu from "../components/menu/menu.vue";
import dict from "../components/dict/dict.vue";
import channel from "../components/channel/channel.vue";
import articleEdit from "../components/articleEdit/articleEdit.vue";
import article from "../components/article/article.vue";
import fileMgr from "../components/fileMgr.vue/fileMgr.vue";
Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

const routes = [
    { path: "/", name: "index", component: index },
    { path: "/info", name: "info", component: info },
    { path: "/mgr", name: "mgr", component: mgr },
    { path: "/role", name: "role", component: role },
    { path: "/dept", name: "dept", component: dept },
    { path: "/menu", name: "menu", component: menu },
    { path: "/dict", name: "dict", component: dict },
    { path: "/channel", name: "channel", component: channel },
    { path: "/cms/articleEdit", name: "articleEdit", component: articleEdit },
    { path: "/article", name: "article", component: article },
    { path: "/fileMgr", name: "fileMgr", component: fileMgr }
];

export default new VueRouter({ routes });