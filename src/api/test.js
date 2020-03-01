// @代表的是src
import request from "@/utils/request";
//方式1
// request
//   .get("/db.json")
//   .then(response => {
//     console.log("get1", response.data);
//   })
//   .catch(error => {
//     console.log(error);
//   });
//方式2
// request({
//   url: "/db.json",
//   method: "get"
// })
//   .then(response => {
//     console.log("get2", response.data);
//   })
//   .catch(error => {
//     console.log(error);
//   });
//方式3
// 导出默认对象
export default {
  //方法返回值为Promise对象，通过它调用then获取相应数据
  getList() {
    return request({
      url: "/db.json",
      method: "get"
    });
  }
}