##项目概述
---------
##项目结构
--------
## 项目环境
--------
#数据库设计

// 微信用户信息User表
wechat_user {
    id
    openid	    string  用户的唯一标识
    nickname	string  用户昵称
    sex	        string  用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
    province	string  用户个人资料填写的省份
    city	    string  普通用户个人资料填写的城市
    country	    string  国家，如中国为CN
    headimgurl	string  用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
    privilege   string	用户特权信息，json 数组，如微信沃卡用户为（chinaunicom）
    unionid	    string  只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段。
}

// 微信用户和爱我乐运 中间表
account{
    id
    openid        string    微信用户的唯一标识
    yunUserId     string    爱我乐运用户唯一标识
    yunAccount   string     爱我乐运用户名
}


// 分享关系表

############wechat####################
爱我乐运服务号
############wechat####################
