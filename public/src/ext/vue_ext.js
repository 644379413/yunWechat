import md5obj from './md5';
window.md5obj = md5obj;
exports.install = function (Vue, options) {

    Object.defineProperties(Vue.prototype, {

        $getFormValue: {
            get: function () {
                return getFormValue;
            }
        },

        $prefixedEvent: {
            get: function () {
                return prefixedEvent.bind(this);
            }
        },

        $extends: {
            get: function () {
                return extendObject;
            }
        },

        $h5setValue: {
            get: function () {
                return h5setValue;
            }
        },

        $h5getValue: {
            get: function () {
                return h5getValue;
            }
        },

        $h5remove: {
            get: function () {
                return h5remove;
            }
        },

        $getCookie: {
            get: function () {
                return getCookie;
            }
        },

        $setHeaders: {
            get: function () {
                return setHeaders;
            }
        },

        $md5: {
            get: function () {
                return md5;
            }
        }

    });

    var extendObject = function (target) {
        var array = [];
        var args = array.slice.call(arguments, 1);
        var deep;
        if (typeof target === 'boolean') {
            deep = target;
            target = args.shift();
        }
        args.forEach(function (arg) {
            extend(target, arg, deep);
        });
        return target;
    };

    /**
     **localstorage的存储
     */
    var h5setValue = function (key, value) {
        window.localStorage.setItem(key, value);
    };

    /**
     *localstorage的查询
     * @param key
     * @returns {string}
     */
    var h5getValue = function (key) {
        if (key === 'userid') {
            if (document.cookie.length > 0) {
                var c_start = document.cookie.indexOf(key + '=');
                if (c_start !== -1) {
                    c_start = c_start + key.length + 1;
                    var c_end = document.cookie.indexOf(';', c_start);
                    if (c_end === -1) c_end = document.cookie.length;
                    return unescape(document.cookie.substring(c_start, c_end));
                }
            }
            return '';
        } else {
            return window.localStorage.getItem(key);
        }
    };


    var h5remove = function (key) {
        window.localStorage.removeItem(key);
    };


    /**
     * 获取cookie的值
     * @param key
     * @returns {string}
     */
    var getCookie = function (key) {
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(key + '=');
            if (c_start !== -1) {
                c_start = c_start + key.length + 1;
                var c_end = document.cookie.indexOf(';', c_start);
                if (c_end === -1) c_end = document.cookie.length;
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return '';
    };


    /**
     * request中设置header
     * @param json
     */
    var setHeaders = function (json) {
        var custom = Vue.http.headers.custom;
        Vue.http.headers.custom = extendObject(json, custom);
    };

    /**
     * 监听各浏览器动画状态，以便回调 type为：animationstart animationiteration animationend
     * @param element
     * @param type
     * @param callback
     */
    var prefixedEvent = function (element, type, callback) {
        callback.bind(this);
        var pfx = ['webkit', 'moz', ''];
        for (var p = 0; p < pfx.length; p++) {
            if (!pfx[p]) type = type.toLowerCase();
            element.addEventListener(pfx[p] + type, callback, false);
        }
    };


    /**
     * 内部方法
     * @param target
     * @param source
     * @param deep
     */
    function extend (target, source, deep) {
        for (var key in source) {
            /*
             if (deep && (_.isPlainObject(source[key]) || _.isArray(source[key]))) {
             if (_.isPlainObject(source[key]) && !_.isPlainObject(target[key])) {
             target[key] = {};
             }
             if (_.isArray(source[key]) && !_.isArray(target[key])) {
             target[key] = [];
             }
             extend(target[key], source[key], deep);
             } else if (source[key] !== undefined) {
             target[key] = source[key];
             }*/
            target[key] = source[key];
        }
    };

    var getFormValue = function (doms) {
        var form = doms.querySelectorAll('input');
        var submitObject = {};
        for (var i = 0; i < form.length; i++) {
            var dom = form[i];
            switch (dom.type) {
                case 'radio':
                    if (dom.checked) {
                        submitObject[dom.name] = dom.value;
                    }
                    break;
                case 'checkbox':
                    if (dom.checked) {
                        if (submitObject[dom.name]) {
                            submitObject[dom.name].push(dom.value);
                        } else {
                            submitObject[dom.name] = [];
                            submitObject[dom.name].push(dom.value);
                        }
                    }
                    break;
                default:
                    if (dom.list) {
                        submitObject[dom.name] = '';
                        if (!dom.value) {
                            submitObject[dom.name] = '';
                        }
                        var datalistOption = dom.list.querySelectorAll('option');
                        if (datalistOption.length > 0) {
                            for (var j = 0; j < datalistOption.length; j++) {
                                if (datalistOption[j].value === dom.value) {
                                    submitObject[dom.name] = datalistOption[j].text;
                                    break;
                                }
                            }
                        }
                    } else {
                        submitObject[dom.name] = dom.value;
                    }

            }

        }
        var select = doms.querySelectorAll('select');
        if (select.length > 0) {
            for (var k = 0; k < select.length; k++) {
                submitObject[select[k].name] = select[k].value;
            }
        }
        return submitObject;
    };


    var md5 = function (string) {
        return md5obj.hex_md5(string);
    };


};
