/**
 * Created by liangyifen on 16/8/1.
 */
/**
 * 微信用户和爱我乐运 中间表
 * Created by liangyifen on 16/7/26.
 */
'use strict';

/**
 * expose object
 */
module.exports = function (sequelize, DataTypes) {
    var Account = sequelize.define('account', {
        openid: DataTypes.STRING,
        yunUserId: DataTypes.STRING,    // 爱我乐运用户唯一标识
        yunAccount: DataTypes.STRING    // 爱我乐运用户名
    }, {
        classMethods: {
            associate: function (models) {
                Account.belongsTo(models['wechatUser']);
            }
        },
        indexes: [
            // 唯一组合索引
            {
                unique: true,
                fields: ['yunUserId','openid']
            }
        ]
    });
    return Account;
};

