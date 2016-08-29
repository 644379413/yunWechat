/**
 * Created by lyf on 14/10/10.
 */

'use strict';

module.exports = {

    /**
     * 从请求里面获取 参数的json格式
     * @param req
     * @param params
     * @returns {{}}
     */
    getJson: function (req, params) {
        var body = req.query;
        if (body && Object.keys(body).length === 0) {
            body = req.body;
        }
        var json = {};
        params.forEach(function (key) {
            if (body && body[key]) {
                json[key] = body[key];
            }
        });
        return json;
    },

    /**
     * 时间格式转换
     * @param input
     * @param format
     * @returns {*}
     */
    formatDate: function (input, format) {
        if (!input || !format) {
            return '';
        }
        var date = {
            'M+': input.getMonth() + 1,
            'd+': input.getDate(),
            'h+': input.getHours(),
            'm+': input.getMinutes(),
            's+': input.getSeconds(),
            'q+': Math.floor((input.getMonth() + 3) / 3),
            'S+': input.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (input.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? date[k] : ('00' + date[k]).substr(('' + date[k]).length));
            }
        }
        return format;
    },


    // 012345678901234567890123
    // 2014-10-22T14:40:42.341Z
    parseDateStr: function (inStr) {
        if (!inStr || inStr.length < 16) {
            return inStr;
        }
        var yy = inStr.substring(0, 4);
        var MM = inStr.substring(5, 7);
        MM -= 1;
        var dd = inStr.substring(8, 10);
        var hh = inStr.substring(11, 13);
        var mi = inStr.substring(14, 16);
        var ss = inStr.substring(17, 19);
        var mm = inStr.substring(20, 23);
        var rtn = new Date();
        rtn.setYear(yy);
        rtn.setMonth(MM);
        rtn.setDate(dd);
        rtn.setHours(hh);
        rtn.setMinutes(mi);
        rtn.setSeconds(ss);
        rtn.setMilliseconds(mm);
        return rtn;
    },

    /**
     * 跨域处理
     * @param res
     */
    setResponse: function (res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader('X-Powered-By', '3.2.1');
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
    },


    /**
     * 将时间戳 转换为时间字符串
     * @param time
     * @returns {string}
     */
    conversion: function (time) {
        var now = new Date(time * 1000);
        var year = now.getFullYear();       // 年
        var month = now.getMonth() + 1;     // 月
        var day = now.getDate();            // 日
        var hh = now.getHours();            // 时
        var mm = now.getMinutes();          // 分
        var ss = now.getSeconds();          // 秒
        var dateString = year + '-';
        if (month < 10) {
            dateString += '0';
        }
        dateString += month + '-';
        if (day < 10) {
            dateString += '0';
        }
        dateString += day + ' ';
        if (hh < 10) {
            dateString += '0';
        }
        dateString += hh + ':';
        if (mm < 10) {
            dateString += '0';
        }
        dateString += mm + ':';
        if (ss < 10) {
            dateString += '0';
        }
        dateString += ss;
        return dateString;
    }

};

