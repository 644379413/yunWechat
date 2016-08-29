'use strict';
import Vue from 'vue';
import Router from 'vue-router';
import resource from 'vue-resource';
import validator from 'vue-validator';
import ext from './ext/vue_ext.js';
import intercept from './ext/vue_http_intercept.js';
import App from './App';
import login from './views/login.vue';
import register from './views/register.vue';
import freightInquiry from './views/freightInquiry/index.vue';
import freightList from './views/freightInquiry/list.vue';
// import addressList from './components/addressList.vue';
// 在创建路由实例之前,install路由
Vue.use(Router);
let router = new Router();
Vue.use(resource);
Vue.use(validator);
Vue.use(ext);
Vue.use(intercept);

router.map({
  '/login': {
    name: 'login',
    component: login
  },
  '/register': {
    name: 'register',
    component: register
  },
  '/freightInquiry': {
    name: 'freightInquiry',
    component: freightInquiry
  },
  '/freightList': {
    name: 'freightList',
    component: freightList
  }
});

router.redirect({
  '*': '/login'
});

router.start(App, '#app');
