export default {
    state: {
        info: [],
        menulist: ""
    },
    mutations: {
        //修改当前账号信息
        setInfo(state, data) {
            state.info = data;
        },
        //设置功能权限
        setMenuList(state, data) {
            state.menulist = data;
        }
    }
};