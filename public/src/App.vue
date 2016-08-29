<template>
  <div class="wrapper">
    <div>
      <router-view keep-alive transition="expand"
                   transition-mode="out-in">
      </router-view>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import resouceConfig from './helpers/resourceConfig';
  export default {
    data: function () {
      return {
        resouceConfig: resouceConfig,
        pulldownConfig: {
          content: '下拉刷新',
          height: 60,
          autoRefresh: false,
          downContent: '下拉刷新',
          upContent: '释放刷新',
          loadingContent: 'Loading...',
          clsPrefix: 'xs-plugin-pulldown-'
        },
        pullupConfig: {
          content: '上拉加载',
          pullUpHeight: 100,
          height: 60,
          autoRefresh: false,
          downContent: '上拉加载',
          upContent: '释放加载',
          loadingContent: 'Loading...',
          clsPrefix: 'xs-plugin-pullup-'
        }
      };
    },
    ready: function () {
    },
    destroyed: function () {

    },
    methods: {},
    components: {}
  };
</script>
<style>
  @import '~vux/dist/vux.css';

  html, body {
    width: 100vw;
    height: 100%;
    font-size: 16px;
  }

  body {
    background-color: #F9F9F9;
  }

  .vux-popup-picker-header {
    color: #FB8557 !important;
  }

  .wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    /* Prevent native touch events on Windows */
    -ms-touch-action: none;
    /* Prevent the callout on tap-hold and text selection */
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    /* Prevent text resize on orientation change, useful for web-apps */
    -webkit-text-size-adjust: none;
    -moz-text-size-adjust: none;
    -ms-text-size-adjust: none;
    -o-text-size-adjust: none;
    text-size-adjust: none;
  }


</style>
