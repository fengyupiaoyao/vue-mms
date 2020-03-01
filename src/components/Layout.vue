<template>
  <div>
    <!--头部-->
    <app-header></app-header>
    <!--左侧导航-->
    <app-navbar></app-navbar>
    <!--右侧主内容区域-->
    <app-main></app-main>
  </div>
</template>

<script>
import AppHeader from "./AppHeader";
import AppNavbar from "./AppNavbar";
import AppMain from "./AppMain";
export default {
  components: { AppHeader, AppNavbar, AppMain }
};
</script>

<style scoped>
.header {
  position: absolute;
  line-height: 50px;
  padding: 0px;
  top: 0px;
  left: 0px;
  right: 0px;
  background-color: #2d3a4b;
}
.navbar {
  position: absolute;
  width: 230px;
  top: 50px;
  left: 0px;
  bottom: 0px;
  overflow-y: auto;
  background-color: #545c64;
}
.main {
  position: absolute;
  top: 50px;
  left: 230px;
  right: 0px;
  bottom: 0px;
  padding: 10px;
  overflow-y: auto;
  /*background-color: red;*/
}
</style>
