import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//使用Element
Vue.use(ElementUI);

import "./premission";

//消息提示的环境配置，是否为生成环境
//false 开发环境：Vue会提供很多警告来方便调试代码
//true 生成环境：警告没有用，反而会增加应用的体积
Vue.config.productionTip = process.env.NODE_ENV === "production";

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
