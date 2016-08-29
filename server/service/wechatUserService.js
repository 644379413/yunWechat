/**
 * Created by liangyifen on 16/7/28.
 */

'use strict';
const Promise = require('bluebird');
const config = require('../../config.js');
let jwt = require('jwt-simple');
let redis = require('../storage/redisDao.js');
let WechatUserDao = require('../storage/mySqldb').models['wechatUser'];


class WechatUserService {

    /**
     * 新建微信userToken
     * @param user
     * @returns {*}
     */
    * creartUserToken(user) {
        var secret = config.jwtSecret;
        if (!user.openid) {
            throw new Error('creartUserToken:openid is not');
        }
        var userToken = jwt.encode(user.openid, secret);
        let openid = user.openid;
        redis.hset(openid, 'userToken', userToken);
        redis.hset(userToken, 'userInfo', JSON.stringify(user));
        redis.hset(userToken, 'openid', openid);
        redis.expire(openid, 36000);
        redis.expire(userToken, 36000);
        return userToken;
    }


    /**
     * 通过Usertoken获取用户信息
     * @param userToken
     * @returns {*}
     */
    * getUserByToken(userToken) {
        var userInfostr = yield redis.gset(userToken, 'userInfo');
        var openid = yield redis.gset(userToken, 'openid');
        let userInfo = {};
        if (userInfostr) {
            userInfo = JSON.parse(userInfostr);
        } else {
            // 缓存过期,获取数据库用户信息
            var user = yield WechatUserDao.findOne({where: {openid: openid}});
            userInfo = user.get();
        }
        return userInfo;
    }


    /**
     * 更新用户信息,并更新userToken
     * @param openid
     * @param userInfo
     * @returns {*} userToken
     * @constructor
     */
    * UpdatedUserInfo (openid, userInfo) {
        let userToken = '';
        try {
            let user = yield WechatUserDao.findCreateFind({where: {openid: openid}, defaults: userInfo});
            let userInstance = user[0];
            let userValues = userInstance.get();
            if (!user[1]) {
                yield WechatUserDao.update(userInfo, {where: {openid: openid}});
            }
            // 判断是否是乐运平台用户,若是:则将平台用户信息放入缓存中
            let accounts = yield userInstance.getAccounts({openid: openid});
            if (accounts && accounts.length > 0) {
                userInfo.accounts = [];
                accounts.map(account => {
                    userInfo.accounts.push(account.get());
                });
            }
            userToken = yield * this.creartUserToken(userValues);

        } catch (err) {
            throw err;
        }
        return userToken;
    }
}


module.exports = new WechatUserService();

