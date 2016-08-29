<template>
  <div>
    <div class="freightInquiry">
      <!--<div class="yunback"></div>-->
      <div class="consultation">
        <div class="yunconsultation" @click="consulteOpen"></div>
        <img src="../../assets/freightinquiry/consultation.png">
      </div>
      <div class="adCarousel">
        <div class="adCarousel_container swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <img src="../../assets/freightinquiry/cooperation_banner.png">
            </div>
            <div class="swiper-slide"><img src="../../assets/freightinquiry/huodong_banner.png"></div>
            <div class="swiper-slide"><img src="../../assets/freightinquiry/wulian_banner.png"></div>
          </div>
          <!-- 分页器 -->
          <div class="swiper-pagination"></div>
        </div>
      </div>
      <div class="context">
        <div class="freight_from">
          <div>
            <div class="place">
              <div class="place_title">做箱区域</div>
              <div class="yun_input" @click="selectDobox">
                <div style="width: 100%;">
                  <label>{{dobox.value.zone}}</label>
                </div>
              </div>
            </div>
            <div class="to">
              <img class="go" src="../../assets/freightinquiry/go.png">
            </div>
            <div class="place" style="text-align: right;">
              <div class="place_title">目的港</div>
              <div class="yun_input">
                <div style="width: 100%; text-align: right;">
                  <div>{{place.placeEnd}}</div>
                </div>
              </div>
            </div>
            <div style="clear: left"></div>
          </div>
          <div style="margin-top: 1rem">
            <div class="place">
              <div class="place_title">箱型</div>
              <div class="yun_input" @click="selectBoxType">
                <div style="width: 100%; ">
                  <div>{{boxType.value | array2string }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="to">&nbsp;&nbsp;</div>
          <div class="place">
            <div class="place_title" style="text-align: right;">重量</div>
            <div class="yun_input" @click="selectWeightType">
              <div style="width: 100%; text-align: right;">
                <div>{{weightType.value | value2name weightType.list }}</div>
              </div>
            </div>
          </div>
          <div style="clear: both"></div>
        </div>
        <div class="context_button">
          <button @click="queryFreight" class="weui_btn  yun_button yun_button_orange">查询运价</button>
        </div>
      </div>
    </div>
    <div class="notices">
      <div class="notice_context">
        <label>注意：默认显示外港价格，洋山港,大箱需另加500元,小箱300元。</label>
      </div>
    </div>
    <!-- 菜单响应 -->
    <actionsheet :show.sync="consultation.show" :menus="consultation.menus" @on-click-menu="consulteMenuClick"
                 show-cancel
                 @cancel-text="取消"></actionsheet>
    <popup-picker :show.sync="boxType.showPopupPicker" :data="boxType.list" :value.sync="boxType.value"
                  :show-cell="false"></popup-picker>
    <popup-picker :show.sync="weightType.showPopupPicker" :data="weightType.list" :value.sync="weightType.value"
                  :show-cell="false" :columns="1"></popup-picker>
    <address-list :value.sync="dobox.value" :show.sync="dobox.show"></address-list>
  </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import '../../assets/js/main.js';
  import Actionsheet from 'vux-components/actionsheet';
  import PopupPicker from 'vux-components/popup-Picker';
  import value2name from 'vux/src/filters/value2name';
  import constrants from '../../helpers/constrants';
  import array2string from 'vux/src/filters/array2String';
  import addressList from '../../components/addressList';
  export default {
    name: 'freightInquiry',
    data: function () {
      return {
        dobox: {
          value: {pro: null, city: null, zone: null},
          show: false
        },
        place: {
          placeEnd: '外港'
        },
        adSwoper: {},
        consultation: {
          show: false,
          menus: {
            qq: 'QQ在线客服',
            tel: '拨打电话'
          }
        },
        boxType: {
          value: ['20', 'GP'],
          list: [],
          showPopupPicker: false
        },
        weightType: {
          value: ['FifteenTon'],
          list: [{name: '15吨以下', value: 'FifteenTon'}, {name: '15~20吨', value: 'FifteenTwentyTon'}, {
            name: '20吨以上',
            value: 'TwentyTon'
          }],
          showPopupPicker: false
        }, cityPicker: null
      };
    },
    watch: {
      'boxType.value': function (newValue, oldValue) {
        let eum = [{name: '15吨以下', value: 'FifteenTon'}, {name: '15~20吨', value: 'FifteenTwentyTon'}, {
          name: '20吨以上',
          value: 'TwentyTon'
        }];
        let eum2 = [{name: '18吨以下', value: 'EighteenTon'}, {
          name: '18~22吨',
          value: 'EighteenTwentyTwoTon'
        }, {name: '22吨以上', value: 'TwentyTwoTon'}];
        if (!newValue) {
          this.weightType.value = [];
          this.weightType.list = [];
        } else if (newValue[0] === '20') {
          this.weightType.value = ['FifteenTon'];
          this.weightType.list = eum;
        } else {
          this.weightType.value = ['EighteenTon'];
          this.weightType.list = eum2;
        }
      }
    },
    compiled: function () {
      setTimeout(() => {
        this.adSwoper = new Swiper('.swiper-container', {
          direction: 'horizontal',
          loop: true,
          autoplay: 3000,
          speed: 300,
          // 如果需要分页器
          pagination: '.swiper-pagination'
        });
      }, 500);

      this.initPickerData();
    },
    ready: function () {
    },
    destroyed: function () {

    },
    methods: {
      initPickerData: function () {
        // 初始化选择器数据
        let containerSizeEnums = [];
        let containerTypeEnums = [];
        let containerSizeEnum = constrants.containerSizeEnum;
        let containerTypeEnum = constrants.containerTypeEnum;
        for (let key in containerSizeEnum) {
          containerSizeEnums.push(containerSizeEnum[key]);
        }
        for (let key in containerTypeEnum) {
          containerTypeEnums.push(containerTypeEnum[key]);
        }
        this.boxType.list.push(containerSizeEnums);
        this.boxType.list.push(containerTypeEnums);

      },
      consulteOpen: function () {
        this.consultation.show = true;
      },
      consulteMenuClick: function (menuKey) {
        if (menuKey === 'qq') {
          window.openQQWindow();
        } else if (menuKey === 'tel') {
          window.location.href = 'tel://' + 13580551774;
        } else {
          this.consultation.show = false;
        }
      }, selectBoxType: function () {
        this.boxType.showPopupPicker = true;
      }, selectWeightType: function () {
        this.weightType.showPopupPicker = true;
      }, selectDobox: function () {
        this.dobox.show = true;
      }, queryFreight: function () {
        let containerSizeEnum = this.boxType.value[0] || '';
        let containerTypeEnum = this.boxType.value[1] || '';
        let grossWeightEnum = this.weightType.value[0] || '';
        for (let key in constrants.containerSizeEnum) {
          if (constrants.containerSizeEnum[key] === containerSizeEnum) {
            containerSizeEnum = key;
            break;
          }
        }
        this.$router.go({
          name: 'freightList',
          query: {
            containerSizeEnum: containerSizeEnum,
            containerTypeEnum: containerTypeEnum,
            grossWeightEnum: grossWeightEnum,
            pro: this.dobox.value.province,
            city: this.dobox.value.city,
            zone: this.dobox.value.zone,
            placeEnd: this.place.placeEnd
          }
        });
      }

    },
    components: {
      'actionsheet': Actionsheet,
      'popupPicker': PopupPicker,
      'addressList': addressList
    }, filters: {
      value2name: value2name,
      array2string: array2string
    }
  };
</script>
<style>

  .freightInquiry {
    width: 100vw;
    height: auto;
    background: #F9F9F9;
  }

  .freightInquiry .adCarousel {
    width: 100%;
    height: 12.2rem;
    top: 0;
    left: 0;
    position: relative;
  }

  .adCarousel .adCarousel_container {
    height: 12.2rem;
    z-index: 1;
  }

  .adCarousel .adCarousel_container img {
    width: 100%;
    height: 12.2rem;
  }

  .freightInquiry .freight_from {
    margin-left: 0.8rem;
    margin-right: 0.8rem;
    padding-top: 1.2rem;
  }

  .freight_from .place_title {
    font-size: 0.7rem;;
    color: #A1A6BB;
  }

  .freight_from .place {
    width: 8.2rem;
    float: left;
    height: 3.5rem;
  }

  .freight_from .place .yun_input {
    margin-top: -0.5rem;
    height: 3rem;
  }

  .freight_from .to {
    width: 2.2rem;
    float: left;
    margin: auto auto;
  }

  .freight_from .to .go {
    width: 2.2rem;
    padding-top: 1.5rem;
  }

  .yunback {
    z-index: 9999;
    top: 0.7rem;
    left: 1rem;
    width: 1.6rem;
    height: 1.6rem;
    opacity: 0.36;
    background-color: #000000;
    border-radius: 50px;
    position: fixed;
    background-repeat: no-repeat;
    background-image: url('../../assets/freightinquiry/back.png');
    background-size: 0.7rem 1.2rem;
    background-position: 0.4rem 0.2rem;
  }

  .yunback:active {
    opacity: 0.8;
  }

  .consultation .yunconsultation {
    width: 2.9rem;
    z-index: 9999;
    top: 0.7rem;
    right: 0rem;
    -webkit-transform: translateX(0.6rem);
    -ms-transform: translateX(0.6rem);
    -o-transform: translateX(0.6rem);
    transform: translateX(0.6rem);
    height: 1.6rem;
    opacity: 0.36;
    background-color: #000000;
    border-radius: 50px;
    position: fixed;
    /*background-repeat: no-repeat;*/
    /*background-image: url('../../assets/freightinquiry/consultation.png');*/
    /*background-size: 1.3rem 1.3rem;*/
    /*background-position: 0.3rem 0.2rem;*/
  }

  .consultation img {
    width: 1.3rem;
    height: 1.3rem;
    padding: 0.1rem;
    position: fixed;
    top: 0.8rem;
    right: 14px;
    z-index: 9999;
  }

  .yunconsultation:active {
    opacity: 0.8;
  }

  .freightInquiry .context {
    width: 20.3rem;
    height: 15rem;
    margin: 1.1rem 0.3rem 0.8rem 0.3rem;
    background-color: #ffffff;
    border-radius: 25px;
  }

  .notices {
    width: 20.3rem;
    height: auto;
    margin-left: 0.3rem;
    margin-right: 0.3rem;
    text-align: center;
    background-color: #ffffff;
    border-radius: 25px;
    background-repeat: no-repeat;
    background-image: url('../../assets/freightinquiry/icon.png');
    background-position: 20px 15px;
    background-size: 1.1rem 1.1rem;
    position: static;
  }

  .notices .notice_context {
    padding-left: 45px;
    font-size: 0.8rem;
    color: #A1A6BB;
    padding-top: 13px;
    padding-bottom: 13px;
    position: relative;
    text-align: left;
    padding-right: 10px;
  }

  .context_button {
    margin-top: 1.7rem;
    margin-left: 3.5rem;
    margin-right: 3.5rem;
    margin-bottom: 1.9rem;
  }
</style>
