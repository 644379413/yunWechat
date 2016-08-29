'use strict';
var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
let router = require('./server/controllers/router.js');
let Server = require('./server/server.js');
let exception = require('./server/helpers/exception');
let weixinService = require('./server/service/weixinService');
const constants = require('./server/helpers/constants.js');
let wechat = require('wechat');
let config = {
    token: constants.WeixinConstants.TOKEN,
    appid: constants.WeixinConstants.APPID,
    encodingAESKey: constants.WeixinConstants.ENCODINGAESKEY
};
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json({limit: '2mb'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/dist')));


// 异步异常处理中间件
app.use(function (req, res, next) {
    exception.nioExceptionHandle(req, res, next);
});


// 微信接受推送消息,事件等
app.use('/wx/weixin', wechat(config, weixinService.receiveMessages));

// 加载路由
router(app);

// 同步异常处理中间件
app.use(exception.bioExceptionHandle);

exception.unhandledRejectionHandle();

// 未捕获异常处理
exception.uncaughtException();

// 服务启动
let server = new Server(app);
server.start();


module.exports = app;
