/**
 * IScroll 上拉刷新,下拉加载 依赖 iscroll-probe.js
 *
 * Created by liangyifen on 16/8/10.
 */

'use strict';

(function (win, doc) {
  var RefreshScroll = function (el, refreshcb, LoadCb) {
    this.el = el;
    this.wrapper = document.querySelector(el);
    this.mySroll = null;
    this.scroller = null;
    this.refreshContent = null;
    this.refreshcb = refreshcb;
    this.LoadCb = LoadCb;
    this.minHeight = '35px';
    this.state = 0;
    this.init();
    this.scrolEvent();
  };
  var r = RefreshScroll.prototype;

  r.init = function () {
    this.scroller = document.createElement('div');
    this.scroller.className = 'scroller';
    this.scroller.appendChild(this.wrapper.children[0]);
    this.wrapper.innerHTML = '';
    this.wrapper.appendChild(this.scroller);
    this.refresh = this.wrapper.querySelector('.refresh');
    if (!this.refresh) {
      this.refresh = document.createElement('div');
      this.refresh.className = 'refresh';
      this.refresh.style.display = 'none';
      this.refresh.style.position = 'relative';
      this.refresh.style.height = this.minHeight;
      this.refresh.style.lineHeight = this.minHeight;
      this.refreshContent = document.createElement('div');
      this.refresh.insertBefore(this.refreshContent, null);
      this.refreshContent.className = 'refreshContent';
      this.refreshContent.style.position = 'absolute';
      this.refreshContent.style.bottom = '0';
      this.refreshContent.style.width = '100%';
      this.refreshContent.style.textAlign = 'center';
      this.refreshContent.style.fontSize = '16px';
      this.refreshContent.style.minHeight = this.minHeight;
      this.refreshContent.style.color = '#ccc';
      this.scroller.insertBefore(this.refresh, this.scroller.firstChild);
    }
    this.lodeIscroll = this.wrapper.querySelector('.loadIscroll');
    if (!this.lodeIscroll) {
      this.lodeIscroll = document.createElement('div');
      this.lodeIscroll.className = 'loadIscroll';
      this.lodeIscroll.style.display = 'none';
      this.lodeIscroll.style.position = 'relative';
      this.lodeIscroll.style.height = this.minHeight;
      this.lodeIscroll.style.lineHeight = this.minHeight;
      this.lodeContent = document.createElement('div');
      this.lodeIscroll.insertBefore(this.lodeContent, null);
      this.lodeContent.className = 'lodeContent';
      this.lodeContent.style.position = 'absolute';
      this.lodeContent.style.bottom = '0';
      this.lodeContent.style.width = '100%';
      this.lodeContent.style.textAlign = 'center';
      this.lodeContent.style.fontSize = '16px';
      this.lodeContent.style.minHeight = this.minHeight;
      this.lodeContent.style.color = '#ccc';
      this.scroller.appendChild(this.lodeIscroll);
    }

    this.mySroll = new IScroll(this.el, {
      probeType: 3
    });
  };

  r.scrolEvent = function () {
    // 滚动触发
    var that = this;
    this.mySroll.on('scroll', function () {
      console.info(this.y);
      if (this.y > 0 && that.state === 0) {
        pullDownFun(that, this.y);
      } else if (this.y < (this.maxScrollY + 50) && that.state === 0) {
        lodeIscrollstart(that);
      }
    });

    // 滚动结束
    this.mySroll.on('scrollEnd', function () {
      if (this.y === 0 && that.state === 1) {
        refreshstart(that);
        if (that.refreshcb) {
          win.setTimeout(function () {
            that.refreshcb(null, function (err, data) {
              if (!err) {
                that.mySroll.refresh();
                refreshend(that);
              } else {
                console.error(err);
              }
            });
          }, 1000);
        }
      } else if (this.y < (this.maxScrollY + 50) && that.state === 1) {
        if (that.LoadCb) {
          win.setTimeout(function () {
            that.LoadCb(null, function (err, data) {
              if (!err) {
                that.mySroll.refresh();
                lodeIscrollend(that);
              } else {
                console.error(err);
              }
            });
          }, 1000);
        }
      }
    });
  };

  // 下拉滑动开始
  function pullDownFun (that, y) {
    that.refreshContent.innerHTML = '<div class="loading"><div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div></div>';
    that.refreshContent.className = 'refreshContent';
    that.refresh.style.transitionDuration = '0ms';
    that.refresh.style.display = 'block';
    that.refresh.style.opacity = 1;
    that.refresh.style.height = that.minHeight;
    that.refresh.style.lineHeight = that.minHeight;
    that.state = 1; //
  }

  // 下拉刷新开始
  function refreshstart (that) {
    that.state = 2;
  }

  // 下拉刷新结束
  function refreshend (that) {
    that.refreshContent.className = 'spread';
    setTimeout(function () {
       that.refresh.style.height = 0;
       that.refresh.style.opacity = 0;

      that.refresh.style.transitionDuration = '500ms';
      that.state = 0;
      that.refresh.style.display = 'none';
    }, 800);
  }

  // 上拉加载更多
  function lodeIscrollstart (that) {
    that.state = 1;
    that.lodeContent.innerHTML = '<div>加载中...</div>';
    that.lodeIscroll.style.transitionDuration = '0ms';
    that.lodeIscroll.style.display = 'block';
    that.lodeIscroll.style.height = that.minHeight;
    that.lodeIscroll.style.lineHeight = that.minHeight;
  }

  // 上拉加载更多
  function lodeIscrollend (that) {
    that.lodeIscroll.style.height = 0;
    that.lodeIscroll.style.display = 'none';
    that.lodeIscroll.style.transitionDuration = '100ms';
    that.state = 0;
  }

  win.refreshScroll = function (el, refreshcb, LoadCb) {
    return new RefreshScroll(el, refreshcb, LoadCb);
  };

}(window, document));

