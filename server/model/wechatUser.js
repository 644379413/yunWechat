/**
 * 微信用户数据模型
 * Created by liangyifen on 16/7/26.
 */

/**
 * expose object
 */
module.exports = function (sequelize, DataTypes) {
    var WechatUser = sequelize.define('wechatUser', {
        openid: DataTypes.STRING,
        nickname: DataTypes.STRING,
        sex: DataTypes.INTEGER,
        province: DataTypes.STRING,
        city: DataTypes.STRING,
        country: DataTypes.STRING,
        headimgurl: DataTypes.STRING,
        privilege: DataTypes.STRING,
        unionid: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                WechatUser.hasMany(models.account);
            }
        },
        indexes: [
            // 唯一索引
            {
                unique: true,
                fields: ['openid']
            }
        ]
    });
    return WechatUser;
};



