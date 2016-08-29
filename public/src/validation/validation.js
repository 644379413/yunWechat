/**
 * Created by lyf on 2016/4/22 0022.
 */
'use strict';

exports.install = function (Vue, options) {
    Vue.validator('error', function (val, message) {
        if (val) {
            return message;
        } else {
            return false;
        }
    });

    Vue.validator('email', {
        message: '非法邮箱',
        check: function (val) {
            if (val === '' || val === null) {
                return true;
            }
            return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(val);
        }
    });

    Vue.validator('phone', {
        message: '非法手机号',
        check: function (val) {
            if (val === '' || val === null) {
                return true;
            }
            return /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(val);
        }
    });
    Vue.validator('telephone', {
        message: '非法电话',
        check: function (val) {
            if (val === '' || val === null) {
                return true;
            }
            return /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$|(^(13[0-9]|15[0|3|6|7|8|9]|18[8|9])\d{8}$)/.test(val);
        }
    });


    Vue.validator('fax', {
        message: '非法传真',
        check: function (val) {
            if (val === '' || val === null) {
                return true;
            }
            return /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/.test(val);
        }
    });

    Vue.validator('citizen_no', {
        message: '非法身份证',
        check: function (val) {
            if (val === '' || val === null) {
                return true;
            }
            return /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(val);
        }
    });

};
