import Vue from "vue";
import VueRouter from "vue-router";
import index from "../components/index.vue";
import info from "../components/info/info.vue";
import mgr from "../components/mgr/mgr.vue";
import role from "../components/role/role.vue";
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
];

export default new VueRouter({ routes });