import Vue from "vue";
import App from "./App.vue";
import resource from "vue-resource";
import echarts from "echarts";
import router from "./router/router";
import store from "./store/index";
import {
    Button,
    Form,
    FormItem,
    Input,
    Message,
    Card,
    Aside,
    Container,
    Main,
    RadioGroup,
    RadioButton,
    Menu,
    MenuItem,
    MenuItemGroup,
    Submenu,
    Col,
    Row,
    Table,
    TableColumn,
    Dialog,
    Tag,
    MessageBox,
    Pagination,
    DatePicker,
    Radio,
    Cascader,
    Option,
    Select,
    Tree
} from "element-ui";
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Card);
Vue.use(Aside);
Vue.use(Container);
Vue.use(Main);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Submenu);
Vue.use(resource);
Vue.use(Col);
Vue.use(Row);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Pagination);
Vue.use(DatePicker);
Vue.use(Radio);
Vue.use(Cascader);
Vue.use(Option);
Vue.use(Select);
Vue.use(Tree);

Vue.prototype.$echarts = echarts;
Vue.prototype.$msg = Message;
Vue.prototype.$confirm = MessageBox;
// 判断登陆状态

//拦截器
Vue.http.interceptors.push((request, next) => {
    //设置token请求头
    if (localStorage.token) {
        Vue.http.headers.common["Authorization"] = localStorage.token;
    } else {
        location.href = "./login.html";
    }
    next(response => {
        if (response.status == 401) {
            location.href = "./login.html";
        }
        return response;
    });
});

new Vue({
    el: "#app",
    render: h => h(App),
    store,
    router
});