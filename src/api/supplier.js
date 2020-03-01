import request from "../utils/request";

export default {
  getList() {
    return request({
      url: "/supplier/list",
      method: "get"
    });
  },
  search(page, size, searchMap) {
    return request({
      url: `/supplier/list/search/${page}/${size}`,
      method: "post",
      data: searchMap
    });
  },
  add(obj) {
    return request({
      url: '/supplier',
      method: 'post',
      data: obj
    });
  },
  getById(id) {
    return request({
      url: `/supplier/${id}`,
      method: 'get'
    });
  },
  update(obj) {
    return request({
      url: `/supplier/${obj.id}`,
      method: 'put',
      data: obj
    });
  },
  delete(id) {
    return request({
      url: `/supplier/${id}`,
      method: 'delete'
    });
  }
}