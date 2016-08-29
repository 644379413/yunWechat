/**
 * Created by liangyifen on 16/6/8.
 */
var config = {
    // 服务的链接数据
    port: 8082,
    host: '121.40.242.173',
    // redis的链接数据
    redisport: 6999,
    redishost: '127.0.0.1',
    redispassword: 'lyf',
    // 数据库链接数据
    dbDialect: 'mysql',
    dbhost: '127.0.0.1',        // 数据库地址
    dbport: 3306,               // 数据库端口
    dbname: 'yun_wechat',       // 数据库名
    dbUsername: 'root',         // 数据库用户名
    dbPassword: 'root',         // 数据库密码
    isDevelope: true,
    jwtSecret: 'a56yun_wechat'  // token㊙密钥
};

module.exports = config;

