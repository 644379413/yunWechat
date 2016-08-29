/**
 * Created by liangyifen on 16/8/25.
 */

'use strict';
const resouce = {
  // 开发环境
  dev: {
    dualServiceHost: 'http://demo.a56yun.com',
    wechatServiceHost: 'http://demo.a56yun.com'
  },
  // 生成环境
  pro: {
    dualServiceHost: 'http://www.a56yun.com',
    wechatServiceHost: 'http://demo.a56yun.com'
  }
};

let resouceConfig = {};

if (process.env.NODE_ENV === 'production') {
  resouceConfig = resouce.pro;
} else {
  resouceConfig = resouce.dev;
}

export default resouceConfig;

