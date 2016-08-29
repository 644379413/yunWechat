/**
 * 日志文件操作
 * Created by liangyifen on 16/6/8.
 */
'use strict'
let fs = require('fs');
var logDir = process.cwd();
let info = fs.createWriteStream(logDir + '/info.log', {flags: 'a', mode: '0666'});
let error = fs.createWriteStream(logDir + '/error.log', {flags: 'a', mode: '0666'});
let logger = new console.Console(info, error);


module.exports = class LogFactory {

    static info (content) {
        logger.info(new Date().toString() + ':' + content.toString());
        console.info(new Date().toString() + ':' + content.toString());
    }

    static error (content) {
        logger.error(new Date().toString() + ':' + content.toString());
        console.error(new Date().toString() + ':' + content.toString());
    }


}

