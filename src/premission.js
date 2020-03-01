import router from "./router";
import { getUserInfo } from "./api/login";
import store from "./store";

router.beforeEach((to, from, next) => {
  const token = store.state.user.token;
  if (!token) {
    if (to.path !== "/login") {
      next({ path: "/login" });
    } else {
      next();
    }
  } else {
    if (to.path === "/login") {
      next();
    } else {
      const userInfo = store.state.user.user;
      if (userInfo) {
        next();
      } else {
        store
          .dispatch("GetUserInfo")
          .then(response => {
            if (response.flag) {
              next();
            } else {
              next({ path: "/login" });
            }
          })
          .catch(error => {});
      }
    }
  }
});
