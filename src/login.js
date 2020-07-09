import Vue from "vue";
import Login from "./Login.vue";
import resource from "vue-resource";
import { Button, Form, FormItem, Input, Message, Card } from "element-ui";
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Card);
Vue.use(resource);
Vue.prototype.$msg = Message;
new Vue({
    el: "#app",
    render: h => h(Login)
});