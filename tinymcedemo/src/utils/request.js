import axios from "axios";

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || "", // 基础URL
  timeout: 5000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 可以添加认证token等
    // const token = localStorage.getItem('access_token')
    // if (token) {
    //   config.headers['Authorization'] = 'Bearer ' + token
    // }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.log("request error:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;

    // 根据后端约定的状态码进行处理
    if (res.code !== 200) {
      console.error("API Error:", res.message || "Error");
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    console.log("response error:", error);
    // 对响应错误做点什么
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权重定向到登录页
          console.error("未授权，请重新登录");
          break;
        case 403:
          console.error("拒绝访问");
          break;
        case 404:
          console.error("请求地址出错");
          break;
        case 500:
          console.error("服务器内部错误");
          break;
        default:
          console.error("未知错误");
      }
    }
    return Promise.reject(error);
  }
);

export default service;
