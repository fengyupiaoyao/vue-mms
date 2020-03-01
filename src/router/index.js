import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/login.vue";
//布局组件
import Layout from "../components/Layout";

//右侧主区域加载组件
import Home from "../views/Home/index";
import Member from "../views/Member/index";
import Supplier from "../views/Supplier/index";
import Goods from "../views/Goods/index";
import Staff from "../views/Staff/index";

Vue.use(VueRouter);

const routes = [
  {
    //登录页
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/",
    name: "layout",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "/home",
        component: Home,
        meta: {title: "首页"}
      }
    ]
  },
  {
    path: "/member",
    component: Layout,
    children: [
      {
        path: "/",
        component: Member,
        meta: {title: "会员管理"}
      }
    ]
  },
  {
    path: "/supplier",
    component: Layout,
    children: [
      {
        path: "/",
        component: Supplier,
        meta: {title: "供应商管理"}
      }
    ]
  },
  {
    path: "/goods",
    component: Layout,
    children: [
      {
        path: "/",
        component: Goods,
        meta: {title: "商品管理"}
      }
    ]
  },
  {
    path: "/staff",
    component: Layout,
    children: [
      {
        path: "/",
        component: Staff,
        meta: {title: "员工管理"}
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
