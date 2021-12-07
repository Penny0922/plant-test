/**
 * 存放一些常用的公共配置
 * @description 暂时提供： appid、接口前缀、白名单页面、请求公共入参
 * @Author lss
 * @Date 2021-3-9
 */

export const baseURL = "https://lianghj.top:8888/api/private/v1/"; // 'http://api.xxx.com/v1'

export const whiteList = ["/login", "/error/403", "/error/404"]; // 无需授权的白名单

// 请求公共入参
export const requstParams = () => {
  let par = {
    token: sessionStorage["token"], // 登陆状态下传递的登陆认证TOKEN，需要登陆状态的接口，此值为必填
  };
  if (!par.token) {
    // 防止token传false回去，造成签名失败
    delete par.token;
  }
  return par;
};
