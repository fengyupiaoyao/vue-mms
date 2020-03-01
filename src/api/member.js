import request from "../utils/request";

export default {
  //获取会员列表
  getList(){
    return request({
      url: "/member/list",
      method: "get"
    });
  },
  search(page, size, searchMap){
    return request({
      url: `/member/list/search/${page}/${size}`,
      method: "post",
      data: searchMap
    });
  },
  add(addNew) {
    return request({
      url: "/member",
      method: "post",
      data: addNew
    });
  },
  getById(id) {
    return request({
      url: `/member/${id}`,
      method: "get"
    });
  },
  update(obj) {
    return request({
      url: `member/${obj.id}`,
      method: "put",
      data: obj
    });
  },
  deleteById(id) {
    return request({
      url: `member/${id}`,
      method: "delete"
    });
  }
}