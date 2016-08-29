/**
 * Created by liangyifen on 16/6/14.
 */
'use strict';
let config = require('../../config.js');
const Promise = require('bluebird');
const logger = require('../log/logFactory.js');
// Promise.promisifyAll 方法接收一个对象，会遍历对象中的方法并克隆该方法并在其后加上 Async 字符
let redis = Promise.promisifyAll(require('redis'));
let redisClient = redis.createClient({host: config.redishost, port: config.redisport, password: config.redispassword});
// 错误处理
//redisClient.on('error', function (err) {
//   console.info('----------------- redis error handle --------------');
//    const stack = err.stack;
//    const title = err.message;
//    logger.error('error:' + title + ',' + stack);
//});
module.exports = redisClient;


