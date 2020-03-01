import Vue from 'vue';
import Vuex from 'vuex';
//导入Modules
import user from './modules/user';
Vue.use(Vuex);

const store = new Vuex.Store({
  //存放状态（共享属性）
  modules: {
    user//user:user
  }
});

export default store;
