import axios from "axios";
// 按需引入element组件
import { Loading, Message } from "element-ui";

const loading = {
  loadingInstance: null,
  open: function() {
    if (this.loadingInstance === null) {
      this.loadingInstance = Loading.service({
        text: "拼命加载中",
        target: ".main", //显示区域
        background: "rgb(0,0,0,0.5)"
      });
    }
  },
  close: function() {
    if (this.loadingInstance !== null) {
      this.loadingInstance.close();
    }
    this.loadingInstance = null;
  }
};

//手动创建一个 axios 对象
const request = axios.create({
  //根据不同环境配置baseURL，最终发送请求的URL为：baseURL+发送请求是的URL
  //比如get('/test') 最终发送请求/test
  // baseURL: "/",
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 //请求超时
});

//请求拦截器
request.interceptors.request.use(
  config => {
    loading.open();
    return config;
  },
  error => {
    loading.close();
    return Promise.reject(error);
  }
);
//相应拦截器
request.interceptors.response.use(
  response => {
    loading.close();
    const resp = response.data;
    if (resp.code !== 2000) {
      Message({
        message: resp.message || "系统异常",
        type: "warning",
        duration: 5 * 1000 //停留时长
      });
    }
    return response;
  },
  error => {
    loading.close();
    Message({
      message: error.message || "系统异常",
      type: "error",
      duration: 5 * 1000 //停留时长
    });
    return Promise.reject(error);
  }
);

export default request; //导出 axios 对象
