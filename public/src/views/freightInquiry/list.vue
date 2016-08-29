<template>
  <div>
    <div>
      <div class="yun_titie">
        <!--<div class="yunback"></div>-->
        <div class="title_name">
          <label>{{query.zone}}</label> <i v-show="query.zone">&rarr;</i> <label>{{query.placeEnd}}</label></div>
      </div>
      <div class="notices" style="margin-top: 0.6rem;margin-bottom: 0.6rem">
        <div class="notice_context">
          <label>注意：默认显示外港价格，洋山港,大箱需另加500元,小箱300元。</label>
        </div>
      </div>
      <div class="content">

        <div style="font-size: 16px;color: #A1A6BB;line-height: 3">
          <div>
            <scroller lock-x scrollbar-y height="26rem" v-ref:scroller use-pulldown
                      use-pullup
                      :pulldown-config="$root.pulldownConfig"
                      :pullup-config="$root.pullupConfig"
                      @pullup:loading="loadMore"
                      @pulldown:loading="refresh"
              >
              <div id="freightRateList" class="freight_rate_list">
                <div v-if="data.priceSheet.length<=0" style="text-align: center">
                  <label>当前没有数据</label>
                </div>
                <div class="freight_rate" v-for="data in data.priceSheet" @click="freightDetail">
                  <div class="freight_rate_content">
                    <flexbox>
                      <flexbox-item>
                        <div class="place">
                          <div class="start_place">{{data.zone}}
                          </div>
                          <div class="province">{{data.province | changename}}-{{data.city | changename}}</div>
                        </div>
                      </flexbox-item>
                      <flexbox-item>
                        <div class="boxType">
                          <div>
                            {{data.containerSizeEnum | eumValue2name
                            constrants.containerSizeEnum}}{{data.containerTypeEnum | eumValue2name
                            constrants.containerTypeEnum}}

                          </div>
                        </div>
                      </flexbox-item>
                      <flexbox-item>
                        <div class="weight">
                          <div>{{data.grossWeightEnum | eumValue2name constrants.grossWeightEnum2}}</div>
                        </div>
                      </flexbox-item>
                      <flexbox-item>
                        <div class="min_price">
                          <div class="price"><span style="font-size: 0.7rem;">¥&nbsp;</span>{{data.price[0]?data.price[0].price:''}}
                          </div>
                          <div class="price_name">{{data.price[0]?data.price[0].name:''}}</div>
                        </div>
                      </flexbox-item>
                    </flexbox>
                  </div>
                  <div class="order_price" v-if="data.price.length>1">
                    <div class="price_box">
                      <flexbox>
                        <flexbox-item v-for="(index,price) in data.price" v-if="index!==0">
                          <div class="price_item">
                            <span class="price_name">{{price.name}}</span>
                            <span class="price"><span style="font-size: 0.7rem;">¥&nbsp;</span>{{price.price}}</span>
                          </div>
                        </flexbox-item>
                      </flexbox>
                    </div>
                  </div>
                </div>
              </div>
            </scroller>
          </div>

        </div>
      </div>
      <alert :show.sync="alert.show" title="敬请期待" button-text="知道了">
        <p style="text-align:center;">{{alert.text}}</p>
      </alert>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import flexbox from 'vux-components/flexbox';
  import flexboxItem from 'vux-components/flexbox-item';
  import alert from 'vux-components/alert';
  import scroller from 'vux-components/Scroller';
  import spinner from 'vux-components/spinner';
  import constrants from '../../helpers/constrants';
  export default {
    data: function () {
      return {
        data: {
          discountRate: 0,
          totalCount: null,
          priceSheet: []
        },
        page: 0,
        size: 20,
        height: null,
        alert: {
          text: '',
          show: false
        },
        query: {
          containerSizeEnum: '',
          containerTypeEnum: '',
          grossWeightEnum: '',
          pro: '',
          city: '',
          zone: '',
          placeEnd: ''
        },
        constrants: constrants
      };
    },
    attached: function () {
      document.title = '';
      for (let key in this.$route.query) {
        if (this.query[key] !== this.$route.query[key]) {
          this.query = this.$route.query;
          this.init();
          return;
        }
      }
    },
    destroyed: function () {

    },
//    watch: {
//      'data.priceSheet': function (val) {
//        this.changePullupStatus(val.length);
//      }
//    },
    methods: {
      init: function () {
        this.page = 0;
        this.getData().then(data => {
          this.data.discountRate = data.discountRate;
          this.data.totalCount = data.totalCount;
          this.data.priceSheet = data.priceSheet;
          this.priceSheetAnalysis(this.data.priceSheet);
          this.$nextTick(() => {
            this.$refs.scroller.reset({top: 0});
          });
        });
      },
      getData: function () {
        let url = this.$root.resouceConfig.dualServiceHost + '/api/priceSheets';
        let containerSizeEnum = this.query.containerSizeEnum;
        let containerTypeEnum = this.query.containerTypeEnum;
        let grossWeightEnum = this.query.grossWeightEnum;
        let province = this.query.pro || '';
        let city = this.query.city || '';
        let zone = this.query.zone || '';
        let query = {
          page: this.page,
          size: this.size,
          sort: this.sort,
          province: province,
          city: city,
          zone: zone,
          containerSizeEnum: containerSizeEnum,
          containerTypeEnum: containerTypeEnum,
          grossWeightEnum: grossWeightEnum
        };
        return this.$http.get(url, query).then(res => {
          return res.data;
        }).catch(res => {
          throw res;
        });
      },
      changePullupStatus: function (priceSheetslength) {
        if (priceSheetslength > 0) {
          this.$broadcast('pullup:enable', this.$refs.scroller.uuid);
        } else {
          this.$broadcast('pullup:disable', this.$refs.scroller.uuid);
        }
      },
      priceSheetAnalysis: function (datas) {
        datas.map((data, index) => {

          let lowPrice = data.lowPrice ? {price: data.lowPrice, name: '套箱(月结)', field: 'lowPrice'} : {};
          let normalPrice = data.normalPrice ? {price: data.normalPrice, name: '单放(月结)', field: 'normalPrice'} : {};
//          let lowPrice_discount = data.lowPrice && this.data.discountRate ? {
//            price: (Math.ceil(data.lowPrice * 100 * this.data.discountRate * 10) / 1000).toFixed(2),
//            name: '套箱(现结)',
//            field: 'lowPrice_discount'
//          } : {};
//          let normalPrice_discount = data.normalPrice && this.data.discountRate ? {
//            price: (Math.ceil(data.normalPrice * 100 * this.data.discountRate * 10) / 1000).toFixed(2),
//            name: '单放(现结)',
//            field: 'normalPrice_discount'
//          } : {};

          data.price = Array.of(lowPrice, normalPrice).filter(item => {
            return !!item.price;
          }).sort((val1, val2) => {
            return val2.price < val1.price;
          });

          this.data.priceSheet.$set(index, Object.assign({}, data));
        });

      },
      freightDetail: function () {
        window.event.stopPropagation();
        this.alert.show = true;
        this.alert.text = '平台线上服务将于10月正式推出，目前平台提供线下服务，如有需要请联系客服';
      },
      refresh: function (uuid = this.$refs.scroller.uuid) {
        this.page = 0;
        this.getData().then(data => {
          this.data.discountRate = data.discountRate;
          this.data.totalCount = data.totalCount;
          this.data.priceSheet = data.priceSheet;
          this.priceSheetAnalysis(this.data.priceSheet);
          this.$nextTick(() => {
            this.$broadcast('pulldown:reset', uuid);
          });
          this.$nextTick(() => {
            this.$refs.scroller.reset({top: 0});
          });


        }).catch(res => {
          setTimeout(() => {
            this.$nextTick(() => {
              this.$broadcast('pulldown:reset', uuid);
            });
          }, 1000);
        });
      },
      loadMore: function (uuid) {
        this.page++;
        this.getData().then(data => {
          this.data.discountRate = data.discountRate;
          this.data.totalCount = data.totalCount;
          let datas = this.data.priceSheet.concat(data.priceSheet);
          this.priceSheetAnalysis(datas);
          this.$nextTick(() => {
            this.$broadcast('pullup:reset', uuid);
          });
        }).catch(res => {
          setTimeout(() => {
            this.$nextTick(() => {
              this.$broadcast('pullup:reset', uuid);

            });
          }, 1000);
        });

      }
    },
    filters: {
      eumValue2name: function (value, eum) {
        return eum[value] || '';
      },
      // 转换省市区名称,去除最后的省市区中文
      changename: function (value) {
        let lastStr = value.replace(/^(.*[n])*.*(.|n)$/g, '$2');
        if ('省市区'.indexOf(lastStr) !== -1) {
          return value.substring(0, value.length - 1);
        } else {
          return value;
        }
      }
    },
    components: {
      'flexbox': flexbox,
      'flexbox-item': flexboxItem,
      'alert': alert,
      'scroller': scroller,
      'spinner': spinner
    }
  };
</script>
<style>
  .yun_titie {
    font-family: PingFangSC-Regular;
    width: 100%;
    height: 3.6rem;
    background: #FBDACD;
    top: 0;
    left: 0;
    position: relative;
    text-align: center;
  }

  .yun_titie .yunback {
    padding-top: 0.3rem;
    opacity: 1;
    color: #FB8557;
  }

  .yun_titie .title_name {
    font-size: 1.1rem;
    color: #FB8557;
    padding-top: 1rem;
  }

  .content {
    top: 3.6rem;
    width: 100%;
    height: auto;
  }

  .freight_rate_list {
    line-height: 1.8;
  }

  .freight_rate_list .freight_rate {
    width: 20.3rem;
    margin-left: 0.25rem;
    margin-right: 0.25rem;
    margin-bottom: 0.6rem;
    background-color: #ffffff;
    border-radius: 15px;
    position: relative;
    font-family: PingFangSC-Medium;
  }

  .freight_rate .order_price {
    border-top: 1px dashed #E0E3EE;
    margin-left: 0.4rem;
    margin-right: 0.4rem;
    font-size: 0.6rem;
    align-content: center;
  }

  .freight_rate .border_top_no {
    border-top: none;
  }

  .freight_rate .freight_rate_content {
    /*height: 3.7rem;*/
    height: auto;
    margin-left: 20px;
    margin-right: 20px;
    padding-bottom: 14px;
    padding-top: 14px;
  }

  .freight_rate_content .place .start_place {
    font-size: 1rem;
    /* padding-left: 0.1rem; */
    color: #4A90E2;
    /* text-align: center; */
    width: 100px;
    min-width: 100px;
    margin-left: -10px;
  }

  .freight_rate_content .place .province {
    margin-left: -10px;
    font-size: 0.7rem;
    color: #1A1F24;
    letter-spacing: 0px;
    width: auto;
    min-width: 100px;
  }

  .freight_rate_content .boxType {
    text-align: center;
    font-size: 1.1rem;
    color: #525C66;
    letter-spacing: 0px;
  }

  .freight_rate_content .weight {
    margin-left: -0.1rem;
    font-size: 1.1rem;
    color: #525C66;
    letter-spacing: 0px;
  }

  .freight_rate_content .min_price {
    line-height: 1.4;
    text-align: right;
  }

  .freight_rate_content .min_price .price {
    font-size: 1.3rem;
    color: #FB8557;
    letter-spacing: 0px;
  }

  .freight_rate_content .min_price .price_name {

    font-size: 0.7rem;
    color: #A1A6BB;
  }

  .order_price .price_box {
    margin-left: 1.2rem;
    margin-right: 1.2rem;
    padding-top: 3px;
    padding-bottom: 3px;
  }

  .order_price .price_item {
    float: right;
    text-align: right;
  }

  .order_price .price_item .price_name {

    font-size: 0.7rem;
    color: #A1A6BB;
  }

  .order_price .price_item .price {

    font-size: 0.9rem;
    color: #FB8557;
    letter-spacing: 0px;
  }

</style>
