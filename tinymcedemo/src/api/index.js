import request from "@/utils/request";

// 统一的API调用封装
class ApiService {
  /**
   * GET 请求
   * @param {string} url 请求地址
   * @param {object} params 请求参数
   * @returns
   */
  get(url, params = {}) {
    return request({
      method: "get",
      url,
      params,
    });
  }

  /**
   * POST 请求
   * @param {string} url 请求地址
   * @param {object} data 请求数据
   * @returns
   */
  post(url, data = {}) {
    return request({
      method: "post",
      url,
      data,
    });
  }

  /**
   * PUT 请求
   * @param {string} url 请求地址
   * @param {object} data 请求数据
   * @returns
   */
  put(url, data = {}) {
    return request({
      method: "put",
      url,
      data,
    });
  }

  /**
   * DELETE 请求
   * @param {string} url 请求地址
   * @returns
   */
  delete(url) {
    return request({
      method: "delete",
      url,
    });
  }
}

export default new ApiService();
