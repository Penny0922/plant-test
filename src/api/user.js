import axios from "axios";

export const login = (data) => axios.post("/login", data); // 登录

export const getPermissionMenu = (data) => axios.get("/menus", data); // 获取用户权限菜单
