import request from "../utils/request.js";

export default {
  getList() {
    return request({
      url: "/goods/list",
      method: "get"
    });
  },
  search(page, size, searchMap) {
    return request({
      url: `/goods/list/search/${page}/${size}`,
      method: "post",
      data: searchMap
    });
  },
  add(obj) {
    return request({
      url: "/goods",
      method: "post",
      data: obj
    });
  },
  getById(id) {
    return request({
      url: `/goods/${id}`,
      method: 'get'
    });
  },
  update(obj) {
    return request({
      url: `/goods/${obj.id}`,
      method: 'put',
      data: obj
    });
  },
  delte(id) {
    return request({
      url: `/goods/${id}`,
      method: 'delete'
    });
  }
}