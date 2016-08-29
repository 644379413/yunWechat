'use strict';
var path = require('path');
let newPath = path.posix.join('./static', 'css/[name].[contenthash].css');
console.info(newPath);
console.info(path.relative(newPath,'./'));
console.info(path.resolve('./static', 'css/[name].[contenthash].css'));