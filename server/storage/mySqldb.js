/**
 * Created by liangyifen on 16/6/14.
 */
'use strict';
let config = require('../../config.js');
let Sequelize = require('sequelize');
var fs = require('fs');
let path = require('path');
let modelDir = path.resolve(__dirname, '../model');
const logger = require('../log/logFactory.js');

class MySqlDao {


    /**
     * 构造函数
     */
    constructor () {
        this.Sequelize = Sequelize;
        this.sequelize = {};
        this.models = {};
    };

    /**
     * 初始化数据连接
     */
    _init () {
        let option = {
            'dialect': config.dbDialect,    // 数据库使用mysql
            'host': config.dbhost,          // 数据库服务器ip
            'port': config.dbport,          // 数据库服务器端口
            'define': {                     // 字段以下划线（_）来分割（默认是驼峰命名风格）
                'underscored': true
            },
            logging: console.log,
            benchmark: true,
            timezone: '+08:00',
            typeValidation: true
        };
        let self = this;
        console.log('mysqlDao init start.....');
        this.sequelize = new Sequelize(config.dbname, config.dbUsername, config.dbPassword, option);
        try {
            let files = fs.readdirSync(modelDir);
            files.map(file => {
                let model = this.sequelize.import(path.resolve(modelDir, file));
                this.models[model.name] = model;
            });
            console.info(this.models);
            // 初始化模型关系
            Object.keys(self.models).forEach(function (modelName) {
                if ('associate' in self.models[modelName]) {
                    self.models[modelName].associate(self.models);
                }
            });

            this.sequelize.sync();
            console.log('mysql table sync end.....');
        } catch (err) {
            console.info('----------------- mysql init error handle --------------');
            const stack = err.stack;
            const title = err.message;
            logger.error('error:' + title + ',' + stack);
        }
    };


};

var mySqlDao = new MySqlDao();
mySqlDao._init();
module.exports = mySqlDao;
