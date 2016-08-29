'use strict';
const constants = require('../helpers/constants.js');
const cryptojs = require('crypto-js');
const Promise = require('bluebird');
let redis = require('../storage/redisDao.js');
let reqPromise = require('request-promise');
let menu = require('../../wxMenu.js');
let WechatAPI = require('wechat-api');
let WechatUserDao = require('../model/wechatUser.js');
let api = Promise.promisifyAll(new WechatAPI(constants.WeixinConstants.APPID, constants.WeixinConstants.APPSECRET, getToken, saveToken));

class WeixinService {

    constructor(api) {
        this.api = api;
        this.api.registerTicketHandle(getTicketToken, saveTicketToken);
    }

;

    /**
     * 微信接入验证( 第一次绑定公众号时调用)
     * @param req
     * @param res
     */
    weixinCheck(req, res) {
        var signature = req.query.signature;
        var timestamp = req.query.timestamp;
        var nonce = req.query.nonce;
        var echostr = req.query.echostr;
        var check = false;
        check = this.isLegel(signature, timestamp, nonce, constants.WeixinConstants.TOKEN);
        if (!check) {
            res.write(echostr);
        } else {
            res.write('error data');
        }
        res.end();
    }


    /**
     * 微信接入校验时sha1加密
     * @param signature
     * @param timestamp
     * @param nonce
     * @returns {boolean}
     */
    isLegel(signature, timestamp, nonce, token) {
        var TOKEN = token;
        var arr = [TOKEN, timestamp, nonce];
        // 对三个参数进行字典序排序
        arr.sort();
        // sha1 加密
        var msg = arr[0] + arr[1] + arr[2];
        var key = constants.WeixinConstants.ENCODINGAESKEY;
        msg = cryptojs.SHA1(msg, key).toString();
        // 验证
        if (msg === signature) {
            return true;
        } else {
            return false;
        }
    }


    /**
     *
     * access_token是公众号的全局唯一票据，公众号调用各接口时都需使用access_token。开发者需要进行妥善保存。
     * access_token的存储至少要保留512个字符空间。
     * access_token的有效期目前为2个小时，需定时刷新，重复获取将导致上次获取的access_token失效。
     */
    getLatestToken() {
        return this.api.getLatestToken(function (err, token) {
            return token;
        });
    }


    /**
     * 接收微信用户信息,推送事件,推送消息,以及自动回复接口
     * @param req
     * @param res
     * @param next
     */
    receiveMessages(req, res, next) {
        var message = req.weixin;
        let openid = message.FromUserName;
        // 判断自动回复的消息类型
        if (message.MsgType === 'text') {
            res.reply('');
        } else if (message.MsgType === 'image') {
            res.reply('');
        } else if (message.MsgType === 'voice') {
            res.reply('');
        } else if (message.MsgType === 'video') {
            res.reply('');
        } else if (message.MsgType === 'location') {
            res.reply('');
        } else if (message.MsgType === 'link') {
            res.reply('');
        } else if (message.MsgType === 'event') {
            let replyMsg = eventReply(message.Event, message.EventKey, openid);
            res.reply(replyMsg);
        } else {
            res.reply('');
        }
    }

;


    /**
     * 创建菜单
     */
    createMenu() {
        this.getLatestToken();
        return this.api.createMenuAsync(menu).then(data => {
            return data;
        });
    }

;

    /**
     * 获取菜单
     */
    getMenu() {
        this.getLatestToken();
        return this.api.getMenuAsync().then(data => {
            return data;
        });
    }

;

    /**
     * 网页授权,通过code获取网页授权access_token
     * @param code
     * @returns {*}
     */
    oauthGetToken(code) {
        let url = 'https://api.weixin.qq.com/sns/oauth2/access_token';
        const options = {
            method: 'GET',
            uri: url,
            qs: {
                appid: constants.WeixinConstants.APPID,
                secret: constants.WeixinConstants.APPSECRET,
                code: code,
                grant_type: 'authorization_code'
            },
            json: true
        };
        return reqPromise(options);
    }

;

    /**
     * 网页授权刷新token
     * @param refresh_token
     * @returns {*}
     */
    oauthTokenRefresh(refresh_token) {
        let url = 'https://api.weixin.qq.com/sns/oauth2/refresh_token';
        const options = {
            method: 'GET',
            uri: url,
            qs: {
                appid: constants.WeixinConstants.APPID,
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            },
            json: true
        };
        return reqPromise(options);
    }

;

    /**
     * 网页授权,拉取用户信息
     * @param code
     * @returns {*}
     */
    * oauthGetUserInfo(code) {
        let tokenData = yield this.oauthGetToken(code);
        let refreshTokenData = yield this.oauthTokenRefresh(tokenData.refresh_token);
        let url = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + refreshTokenData.access_token + '&openid=' + refreshTokenData.openid + '&lang=zh_CN';
        return yield reqPromise(url, {json: true});
    }

;


    /**
     * 获取最新js sdk ticket
     * @returns {*}
     */
    * getJsConfig(url, jsApiList) {
        if (!url) {
            url = constants.WeixinConstants.SECURITYDOMAIN;
        }
        if (!jsApiList) {
            jsApiList = [];
        }
        var config = yield this.api.getJsConfigAsync({
            debug: false,
            jsApiList: jsApiList,
            url: url
        });
        return config;
    }

;

}
;


/**
 * 推送事件消息回复处理
 * @param event
 * @param eventKey
 * @param openid
 * @returns {*}
 */
function eventReply(event, eventKey, openid) {
    if (event === 'subscribe') {
        return '感谢关注“爱我乐运”集装箱储运信息平台，平台旨在通过互联网平台对业务信息进行收集、交互和匹配，实现运输模式创新、提高运输效率，从而降低货代公司出口业务的拖车费用和进口业务的相关费用，具体信息详见平台介绍和服务介绍！';
    } else if (event === 'unsubscribe') {
        return '';
    } else {
        return '';
    }

}

/**
 * 获取token,处理多台服务器负载均衡时，Token需要外部存储共享
 * @param callback
 */
function getToken(callback) {
    redis.hgetAsync(constants.WeixinConstants.APPID, 'token').then(data => {
        callback(null, JSON.parse(data));
    }).catch(err => callback(err));
}

/**
 * 存储token,处理多台服务器负载均衡时，Token需要外部存储共享
 * @param token
 * @param callback
 */
function saveToken(token, callback) {
    redis.hset(constants.WeixinConstants.APPID, 'token', JSON.stringify(token), callback);
}


/**
 * getTicketToken,处理多台服务器负载均衡时，ticketTokenToken需要外部存储共享
 * @param type
 * @param callback
 */
function getTicketToken(type, callback) {
    redis.hgetAsync(constants.WeixinConstants.APPID, type + '_ticketToken').then(data => {
        callback(null, JSON.parse(data));
    }).catch(err => callback(err));
}

/**
 *  saveTicketToken 处理多台服务器负载均衡时，ticketTokenToken需要外部存储共享
 * @param type
 * @param _ticketToken
 * @param callback
 */
function saveTicketToken(type, _ticketToken, callback) {
    redis.hset(constants.WeixinConstants.APPID, type + '_ticketToken', JSON.stringify(_ticketToken), callback);

}

module.exports = new WeixinService(api);

