import Vue from 'vue'
import Login from './Login.vue'
import { Button, Form, FormItem } from 'element-ui';
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
new Vue({
    el: '#app',
    render: h => h(Login)
})