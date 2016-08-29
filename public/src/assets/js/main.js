/**
 * Created by jchnxu on 3/31/16.
 */
(function () {
  'use strict';

  function popupWindowWithContent (w, h, content) {
    // Fixes dual-screen position                         Most browsers      Firefox
    var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = window.open('', '_blank', 'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    newWindow.document.open();
    newWindow.document.write(content);
    newWindow.document.close();
  }

  function openQQWindow () {
    popupWindowWithContent(500, 300, '<html><head><meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"><title>QQ客服</title></head><body><div style="text-align:center"><div>请点击按钮，发起聊天</div><script charset="utf-8" type="text/javascript" src="http://wpa.b.qq.com/cgi/wpa.php?key=XzkzODE4OTQ3OF8zNTc2NTZfNDAwMDYyNTI1Nl8"></script></div></body></html>');
  }

  window.openQQWindow = openQQWindow;
})();
