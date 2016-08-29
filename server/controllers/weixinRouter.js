'use strict';
let weixinService = require('../service/weixinService.js');
let wechatUserService = require('../service/wechatUserService.js');
let exception = require('../helpers/exception.js');
let Promise = require('bluebird');

module.exports = function (app) {

    /**
     * 微信接入验证
     */
    app.get('/wx/weixin', (req, res) => weixinService.weixinCheck(req, res));

    /**
     * 微信菜单创建
     */
    app.get('/wx/createMenu', (req, res) => weixinService.createMenu());


    /**
     * 菜单点击默认授权回调,获取用户信息
     */
    app.get('/wx/menu/userToken/:menuName', Promise.coroutine(function*(req, res) {
        let code = req.query.code;
        let menuName = req.query.menuName;
        try {
            // 获取用户心信息
            let userInfo = yield * weixinService.oauthGetUserInfo(code);
            // 更新用户信息,返回最新oathToken
            let userToken = yield * wechatUserService.UpdatedUserInfo(code, userInfo);
            // 重定向
            //switch (menuName) {
            //    case '':
            //        res.redirect('');
            //        break;
            //    default :
            //        break;
            //}
        } catch (err) {
            exception.throwException(err);
        }
    }));

    /**
     * 网页授权获取用户信息
     */
    app.get('/wx/oauth/userToken', Promise.coroutine(function * (req, res) {
        //let code = req.query.code;
        try {
            //let userInfo = yield * weixinService.oauthGetUserInfo(code);
            var code = '12345';
            var userInfo = {
                openid: '12345',
                nickname: 'lyf3333'
            }
            // 更新用户信息,返回最新oathToken
            let userToken = yield * wechatUserService.UpdatedUserInfo(code, userInfo);
            res.status(200).json({code: 200, userToken: userToken});
        } catch (err) {
            console.info('-----------------');
            //exception.throwException(err);
            throw err;
        }
    }));


    /**
     *  获取微信js sdk config配置信息
     */
    app.get('/wx/JsSdkConfig', Promise.coroutine(function * (req, res) {
        let url = req.query.url;
        let jsApiList = req.query.jsApiList;
        try {
            var result = yield* weixinService.getJsConfig(url, jsApiList);
            res.status(200).json({code: 200, config: result});
        } catch (err) {

            exception.throwException(err);
        }
    }));

};
