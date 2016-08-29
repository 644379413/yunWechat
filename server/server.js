/**
 * Created by liangyifen on 16/6/8.
 */
'use strict';

let config = require('../config.js');
var debug = require('debug')('56yun_weixin:server');
let http = require('http');

class Server {
    constructor(app) {
        this.rootApp = app;
        this.httpServer = http.createServer(this.rootApp);
        this.config = config;
    }

    start() {
        let httpServer = this.httpServer;
        httpServer.listen(this.config.port);
        console.log('app server start,plz visite http://localhost:' + this.config.port);
        httpServer.on('error', this.onError);
    }

    /**
     * Event listener for HTTP server "error" event.
     */

    onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof config.port === 'string'
            ? 'Pipe ' + config.port
            : 'Port ' + config.port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }


}


module.exports = Server;
