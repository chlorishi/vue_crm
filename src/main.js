import Vue from "vue";
import App from "./App.vue";
import resource from "vue-resource";
import store from './store/index'
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
    Submenu
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
Vue.prototype.$msg = Message;

// 判断登陆状态
if (localStorage.token) {
    Vue.http.headers.common["Authorization"] = localStorage.token;
} else {
    location.href = "./login.html";
}
new Vue({
    el: "#app",
    render: h => h(App),
    store
});