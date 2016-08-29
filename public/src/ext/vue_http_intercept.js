/**
 * Created by liangyifen on 16/8/22.
 */
'use strict';
exports.install = function (Vue, options) {

  // Vue.http.options.timeout = 1000 * 20;

  /**
   * 拦截器
   */
  Vue.http.interceptors.push({
    request: function (request) {
      var strRegex = '^((https|http|ftp|rtsp|mms)?://)';
      var re = new RegExp(strRegex);
      if (!re.test(request.url)) {
        request.url = request.url;
      }

      return request;
    },
    response: function (response) {
      return response;
    }
  });

};
