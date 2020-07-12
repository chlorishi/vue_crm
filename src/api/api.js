//服务器地址
const http = "http://39.101.217.150:8086";
//登录接口
const login = "/account/login";
//菜单信息
const listForRouter = "/menu/listForRouter";
//获取账号信息
const info = "/account/info";
//修改密码
const updatePwd = "/account/updatePwd";
//获取分类下文章数
const articlebychannel = "/article/articlebychannel";
//获取文章分类
const channellist = "/channel/list";
//获取功能操作信息
const menulist = "/menu/list";
//获取用户列表
const userlist = "/user/list";
//获取部门数据
const deptlist = "/dept/list";
//添加、修改用户.删除DELETE
const updateUser = "/user";
//获取角色
const roleTreeListByIdUser = "/role/roleTreeListByIdUser";
//设置角色
const setRole = "/user/setRole";
//角色列表
const rolelist = "/role/list";
//角色添加,修改,删除
const role = "/role";
//根据角色id获取菜单树接口
const menuTreeListByRoleId = "/menu/menuTreeListByRoleId";
// 根据角色id配置菜单权限接口
const savePermisson = "/role/savePermisson";
//添加,修改部门
const dept = "/dept";
module.exports = {
    http,
    login,
    listForRouter,
    info,
    updatePwd,
    channellist,
    articlebychannel,
    menulist,
    userlist,
    deptlist,
    updateUser,
    roleTreeListByIdUser,
    setRole,
    rolelist,
    role,
    menuTreeListByRoleId,
    savePermisson,
    dept
};