import axios from "axios";

export const login = (data) => axios.post("/login", data); // 登录

export const getPermissionMenu = (data) =>
  axios.post("/v1/getPermissionMenu", data); // 获取用户权限菜单
