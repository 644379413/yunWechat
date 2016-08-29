'use strict';
var colors = require('colors');
let domain = require('domain');
let logger = require('../log/logFactory.js');

/**
 * 存储日志
 * @param req
 * @param res
 * @param title
 * @param stack
 */
function saveLog (req, res, title, stack) {

    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'PRODUCTION') {
        if (req.method === 'post') {
            logger.error('url:' + req.url + '+,params:' + JSON.stringify(req.body) + ',error:' + title + ',' + stack);
        } else {
            logger.error('url:' + req.url + '+,params:' + JSON.stringify(req.query || req.params) + ',error:' + title + ',' + stack);
        }
    } else {
        // 开发环境
        const title = req.method + ':' + req.url;
        if (req.method === 'post') {
            logger.error('url:' + req.url + '+,params:' + JSON.stringify(req.body) + ',error:' + title + ',' + stack);
        } else {
            logger.error('url:' + req.url + '+,params:' + JSON.stringify(req.query || req.params) + ',error:' + title + ',' + stack);
        }
        console.info(colors.red('Error info is, "%s" .'), title);
        console.info(colors.green('Error stack is, "%s" .'), stack);
    }
    res.statusCode = 500;
    res.json({
        code: 500,
        data: title
    });
}


var IOException = {

    // 将异常异步抛出,最后交给异步异常处理器统一处理
    throwException: function (err) {
        setTimeout(() => {
            if (err instanceof Error) {
                throw err;
            } else if (err instanceof String) {
                throw new Error(err);
            } else if (err instanceof Object) {
                throw new Error(JSON.stringify(err));
            } else {
                throw new Error(err.toString());
            }

        }, 0);
    },

    // 异步异常处理器
    nioExceptionHandle: function (req, res, next) {
        var serverDomain = domain.create();
        // 监听domain的错误事件
        serverDomain.on('error', function (err) {
            console.log('nioExceptionHandle err-----');
            const stack = err.stack;
            const title = err.message;
            saveLog(req, res, title, stack);
            serverDomain.dispose();
        });
        serverDomain.add(req);
        serverDomain.add(res);
        serverDomain.run(next);
    },

    // 同步异常处理Handle
    bioExceptionHandle: function (err, req, res, next) {
        console.log('bioExceptionHandle err-----');
        const stack = err.stack;
        const title = err.message;
        // 正式生产环境
        if (err) {
            saveLog(req, res, title, stack);
        } else {
            next();
        }
    },

    // unhandledRejection
    unhandledRejectionHandle: function () {
        process.on('unhandledRejection', function (err, promise) {
            const stack = err.stack;
            const title = err.message;
            logger.error('unhandledRejection---------------------------');
            logger.error('error:' + title + ',' + stack);
        });
    },


    rejectionHandled: function () {
        process.on('rejectionHandled', function (err, promise) {
            const stack = err.stack;
            const title = err.message;
            logger.error('rejectionHandled----------------------------------');
            logger.error('error:' + title + ',' + stack);
        });
    },

    // uncaughtException
    uncaughtException: function () {
        process.on('uncaughtException', function (err) {
            const stack = err.stack;
            const title = err.message;
            logger.error('error:' + title + ',' + stack);
        });
    }

};

module.exports = IOException;

