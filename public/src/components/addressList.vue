<template>
  <div v-if="show" class="address_content">
    <div>
      <div class="address_search" style="font-size: 14px;" v-show="searchShow">
        <search @result-click="resultClick" @on-change="getResult" :results="results" :value.sync="searchValue"
                top="0px" cancel-text="取消"></search>
      </div>

      <div class="picker-box" v-el:picker-box>
        <div v-show="proShow" v-el:navbar class="navbar" :class="{'active':navbar.active}">
          <a v-for="a in navbar.Letters" @click="clickaItem(a)">{{a}}</a>
        </div>
        <div v-el:prompt class="prompt" v-show="prompt.active">{{prompt.currentLetter}}</div>
        <section class="pro-picker" v-el:pro-picker v-show="proShow">
          <dl class="current">
            <dt>当前</dt>
            <dd>
              <button class="city_button weui_btn weui_btn_mini weui_btn_default" v-if="current">
                <label>{{current}}</label>
              </button>
              <div v-else="current">
                <label>定位中...</label>
              </div>

            </dd>
          </dl>
          <dl class="history">
            <dt>历史查询</dt>
            <dd>
              <button class="city_button weui_btn weui_btn_mini weui_btn_default" v-for=" city in hisCity"
                      @click="resultClick(city)">
                <label>{{city.zone}}</label>
              </button>

            </dd>
          </dl>
          <dl v-for="(letterKey,letterValue) in provinces" v-if="letterValue!=null">
            <dt id="{{letterKey}}">{{letterKey}}</dt>
            <dd v-for="(name,value) in letterValue" data-letter='{{letterKey}}'
                @click="proClick(name,value)">{{name}}
            </dd>
          </dl>
        </section>
        <div class="city-picker " v-el:city-picker v-show="cityShow">
          <dt>当前城市:{{city}}</dt>
          <ul>
            <li v-for="(index,city) in cities" @click="cityClick(city)">{{city}}</li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import Search from 'vux-components/Search';

  var allCity = ['玄武区,南京市,江苏省|xuanwuqu,nanjing,jiangsu|xwq,nj,js',
    '白下区,南京市,江苏省|baixiaqu,nanjing,jiangsu|bxq,nj,js',
    '秦淮区,南京市,江苏省|qinhuaiqu,nanjing,jiangsu|qhq,nj,js',
    '建邺区,南京市,江苏省|jianyequ,nanjing,jiangsu|jyq,nj,js',
    '鼓楼区,南京市,江苏省|gulouqu,nanjing,jiangsu|glq,nj,js',
    '下关区,南京市,江苏省|xiaguanqu,nanjing,jiangsu|xgq,nj,js',
    '浦口区,南京市,江苏省|pukouqu,nanjing,jiangsu|pkq,nj,js',
    '栖霞区,南京市,江苏省|qixiaqu,nanjing,jiangsu|qxq,nj,js',
    '雨花台区,南京市,江苏省|yuhuataiqu,nanjing,jiangsu|yhtq,nj,js',
    '江宁区,南京市,江苏省|jiangningqu,nanjing,jiangsu|jnq,nj,js',
    '六合区,南京市,江苏省|liuhequ,nanjing,jiangsu|lhq,nj,js',
    '溧水县,南京市,江苏省|lishuixian,nanjing,jiangsu|lsx,nj,js',
    '高淳县,南京市,江苏省|gaochunxian,nanjing,jiangsu|gcx,nj,js',
    '崇安区,无锡市,江苏省|chonganqu,wuxi,jiangsu|caq,wx,js',
    '南长区,无锡市,江苏省|nanzhangqu,wuxi,jiangsu|nzq,wx,js',
    '北塘区,无锡市,江苏省|beitangqu,wuxi,jiangsu|btq,wx,js',
    '锡山区,无锡市,江苏省|xishanqu,wuxi,jiangsu|xsq,wx,js',
    '惠山区,无锡市,江苏省|huishanqu,wuxi,jiangsu|hsq,wx,js',
    '滨湖区,无锡市,江苏省|binhuqu,wuxi,jiangsu|bhq,wx,js',
    '江阴市,无锡市,江苏省|jiangyinshi,wuxi,jiangsu|jys,wx,js',
    '宜兴市,无锡市,江苏省|yixingshi,wuxi,jiangsu|yxs,wx,js',
    '鼓楼区,徐州市,江苏省|gulouqu,xuzhou,jiangsu|glq,xz,js',
    '云龙区,徐州市,江苏省|yunlongqu,xuzhou,jiangsu|ylq,xz,js',
    '九里区,徐州市,江苏省|jiuliqu,xuzhou,jiangsu|jlq,xz,js',
    '贾汪区,徐州市,江苏省|jiawangqu,xuzhou,jiangsu|jwq,xz,js',
    '泉山区,徐州市,江苏省|quanshanqu,xuzhou,jiangsu|qsq,xz,js',
    '丰县,徐州市,江苏省|fengxian,xuzhou,jiangsu|fx,xz,js',
    '沛县,徐州市,江苏省|peixian,xuzhou,jiangsu|px,xz,js',
    '铜山县,徐州市,江苏省|tongshanxian,xuzhou,jiangsu|tsx,xz,js',
    '睢宁县,徐州市,江苏省|suiningxian,xuzhou,jiangsu|snx,xz,js',
    '新沂市,徐州市,江苏省|xinyishi,xuzhou,jiangsu|xys,xz,js',
    '邳州市,徐州市,江苏省|pizhoushi,xuzhou,jiangsu|pzs,xz,js',
    '天宁区,常州市,江苏省|tianningqu,changzhou,jiangsu|tnq,cz,js',
    '钟楼区,常州市,江苏省|zhonglouqu,changzhou,jiangsu|zlq,cz,js',
    '戚墅堰区,常州市,江苏省|qishuyanqu,changzhou,jiangsu|qsyq,cz,js',
    '新北区,常州市,江苏省|xinbeiqu,changzhou,jiangsu|xbq,cz,js',
    '武进区,常州市,江苏省|wujinqu,changzhou,jiangsu|wjq,cz,js',
    '溧阳市,常州市,江苏省|liyangshi,changzhou,jiangsu|lys,cz,js',
    '金坛市,常州市,江苏省|jintanshi,changzhou,jiangsu|jts,cz,js',
    '沧浪区,苏州市,江苏省|canglangqu,suzhou,jiangsu|clq,sz,js',
    '平江区,苏州市,江苏省|pingjiangqu,suzhou,jiangsu|pjq,sz,js',
    '金阊区,苏州市,江苏省|jinchangqu,suzhou,jiangsu|jcq,sz,js',
    '虎丘区,苏州市,江苏省|huqiuqu,suzhou,jiangsu|hqq,sz,js',
    '吴中区,苏州市,江苏省|wuzhongqu,suzhou,jiangsu|wzq,sz,js',
    '相城区,苏州市,江苏省|xiangchengqu,suzhou,jiangsu|xcq,sz,js',
    '常熟市,苏州市,江苏省|changshushi,suzhou,jiangsu|css,sz,js',
    '张家港市,苏州市,江苏省|zhangjiagangshi,suzhou,jiangsu|zjgs,sz,js',
    '昆山市,苏州市,江苏省|kunshanshi,suzhou,jiangsu|kss,sz,js',
    '吴江市,苏州市,江苏省|wujiangshi,suzhou,jiangsu|wjs,sz,js',
    '太仓市,苏州市,江苏省|taicangshi,suzhou,jiangsu|tcs,sz,js',
    '崇川区,南通市,江苏省|chongchuanqu,nantong,jiangsu|ccq,nt,js',
    '港闸区,南通市,江苏省|gangzhaqu,nantong,jiangsu|gzq,nt,js',
    '海安县,南通市,江苏省|haianxian,nantong,jiangsu|hax,nt,js',
    '如东县,南通市,江苏省|rudongxian,nantong,jiangsu|rdx,nt,js',
    '启东市,南通市,江苏省|qidongshi,nantong,jiangsu|qds,nt,js',
    '如皋市,南通市,江苏省|rugaoshi,nantong,jiangsu|rgs,nt,js',
    '通州市,南通市,江苏省|tongzhoushi,nantong,jiangsu|tzs,nt,js',
    '海门市,南通市,江苏省|haimenshi,nantong,jiangsu|hms,nt,js',
    '连云区,连云港市,江苏省|lianyunqu,lianyungang,jiangsu|lyq,lyg,js',
    '新浦区,连云港市,江苏省|xinpuqu,lianyungang,jiangsu|xpq,lyg,js',
    '海州区,连云港市,江苏省|haizhouqu,lianyungang,jiangsu|hzq,lyg,js',
    '赣榆县,连云港市,江苏省|ganyuxian,lianyungang,jiangsu|gyx,lyg,js',
    '东海县,连云港市,江苏省|donghaixian,lianyungang,jiangsu|dhx,lyg,js',
    '灌云县,连云港市,江苏省|guanyunxian,lianyungang,jiangsu|gyx,lyg,js',
    '灌南县,连云港市,江苏省|guannanxian,lianyungang,jiangsu|gnx,lyg,js',
    '清河区,淮安市,江苏省|qinghequ,huaian,jiangsu|qhq,ha,js',
    '楚州区,淮安市,江苏省|chuzhouqu,huaian,jiangsu|czq,ha,js',
    '淮阴区,淮安市,江苏省|huaiyinqu,huaian,jiangsu|hyq,ha,js',
    '清浦区,淮安市,江苏省|qingpuqu,huaian,jiangsu|qpq,ha,js',
    '涟水县,淮安市,江苏省|lianshuixian,huaian,jiangsu|lsx,ha,js',
    '洪泽县,淮安市,江苏省|hongzexian,huaian,jiangsu|hzx,ha,js',
    '盱眙县,淮安市,江苏省|xuyixian,huaian,jiangsu|xyx,ha,js',
    '金湖县,淮安市,江苏省|jinhuxian,huaian,jiangsu|jhx,ha,js',
    '亭湖区,盐城市,江苏省|tinghuqu,yancheng,jiangsu|thq,yc,js',
    '盐都区,盐城市,江苏省|yandouqu,yancheng,jiangsu|ydq,yc,js',
    '响水县,盐城市,江苏省|xiangshuixian,yancheng,jiangsu|xsx,yc,js',
    '滨海县,盐城市,江苏省|binhaixian,yancheng,jiangsu|bhx,yc,js',
    '阜宁县,盐城市,江苏省|funingxian,yancheng,jiangsu|fnx,yc,js',
    '射阳县,盐城市,江苏省|sheyangxian,yancheng,jiangsu|syx,yc,js',
    '建湖县,盐城市,江苏省|jianhuxian,yancheng,jiangsu|jhx,yc,js',
    '东台市,盐城市,江苏省|dongtaishi,yancheng,jiangsu|dts,yc,js',
    '大丰市,盐城市,江苏省|dafengshi,yancheng,jiangsu|dfs,yc,js',
    '广陵区,扬州市,江苏省|guanglingqu,yangzhou,jiangsu|glq,yz,js',
    '邗江区,扬州市,江苏省|hanjiangqu,yangzhou,jiangsu|hjq,yz,js',
    '郊区,扬州市,江苏省|jiaoqu,yangzhou,jiangsu|jq,yz,js',
    '宝应县,扬州市,江苏省|baoyingxian,yangzhou,jiangsu|byx,yz,js',
    '仪征市,扬州市,江苏省|yizhengshi,yangzhou,jiangsu|yzs,yz,js',
    '高邮市,扬州市,江苏省|gaoyoushi,yangzhou,jiangsu|gys,yz,js',
    '江都市,扬州市,江苏省|jiangdoushi,yangzhou,jiangsu|jds,yz,js',
    '京口区,镇江市,江苏省|jingkouqu,zhenjiang,jiangsu|jkq,zj,js',
    '润州区,镇江市,江苏省|runzhouqu,zhenjiang,jiangsu|rzq,zj,js',
    '丹徒区,镇江市,江苏省|dantuqu,zhenjiang,jiangsu|dtq,zj,js',
    '丹阳市,镇江市,江苏省|danyangshi,zhenjiang,jiangsu|dys,zj,js',
    '扬中市,镇江市,江苏省|yangzhongshi,zhenjiang,jiangsu|yzs,zj,js',
    '句容市,镇江市,江苏省|jurongshi,zhenjiang,jiangsu|jrs,zj,js',
    '海陵区,泰州市,江苏省|hailingqu,taizhou,jiangsu|hlq,tz,js',
    '高港区,泰州市,江苏省|gaogangqu,taizhou,jiangsu|ggq,tz,js',
    '兴化市,泰州市,江苏省|xinghuashi,taizhou,jiangsu|xhs,tz,js',
    '靖江市,泰州市,江苏省|jingjiangshi,taizhou,jiangsu|jjs,tz,js',
    '泰兴市,泰州市,江苏省|taixingshi,taizhou,jiangsu|txs,tz,js',
    '姜堰市,泰州市,江苏省|jiangyanshi,taizhou,jiangsu|jys,tz,js',
    '宿城区,宿迁市,江苏省|suchengqu,suqian,jiangsu|scq,sq,js',
    '宿豫区,宿迁市,江苏省|suyuqu,suqian,jiangsu|syq,sq,js',
    '沭阳县,宿迁市,江苏省|shuyangxian,suqian,jiangsu|syx,sq,js',
    '泗阳县,宿迁市,江苏省|siyangxian,suqian,jiangsu|syx,sq,js',
    '泗洪县,宿迁市,江苏省|sihongxian,suqian,jiangsu|shx,sq,js',
    '上城区,杭州市,浙江省|shangchengqu,hangzhou,zhejiang|scq,hz,zj',
    '下城区,杭州市,浙江省|xiachengqu,hangzhou,zhejiang|xcq,hz,zj',
    '江干区,杭州市,浙江省|jiangganqu,hangzhou,zhejiang|jgq,hz,zj',
    '拱墅区,杭州市,浙江省|gongshuqu,hangzhou,zhejiang|gsq,hz,zj',
    '西湖区,杭州市,浙江省|xihuqu,hangzhou,zhejiang|xhq,hz,zj',
    '滨江区,杭州市,浙江省|binjiangqu,hangzhou,zhejiang|bjq,hz,zj',
    '萧山区,杭州市,浙江省|xiaoshanqu,hangzhou,zhejiang|xsq,hz,zj',
    '余杭区,杭州市,浙江省|yuhangqu,hangzhou,zhejiang|yhq,hz,zj',
    '桐庐县,杭州市,浙江省|tongluxian,hangzhou,zhejiang|tlx,hz,zj',
    '淳安县,杭州市,浙江省|chunanxian,hangzhou,zhejiang|cax,hz,zj',
    '建德市,杭州市,浙江省|jiandeshi,hangzhou,zhejiang|jds,hz,zj',
    '富阳市,杭州市,浙江省|fuyangshi,hangzhou,zhejiang|fys,hz,zj',
    '临安市,杭州市,浙江省|linanshi,hangzhou,zhejiang|las,hz,zj',
    '海曙区,宁波市,浙江省|haishuqu,ningbo,zhejiang|hsq,nb,zj',
    '江东区,宁波市,浙江省|jiangdongqu,ningbo,zhejiang|jdq,nb,zj',
    '江北区,宁波市,浙江省|jiangbeiqu,ningbo,zhejiang|jbq,nb,zj',
    '北仑区,宁波市,浙江省|beilunqu,ningbo,zhejiang|blq,nb,zj',
    '镇海区,宁波市,浙江省|zhenhaiqu,ningbo,zhejiang|zhq,nb,zj',
    '鄞州区,宁波市,浙江省|yinzhouqu,ningbo,zhejiang|yzq,nb,zj',
    '象山县,宁波市,浙江省|xiangshanxian,ningbo,zhejiang|xsx,nb,zj',
    '宁海县,宁波市,浙江省|ninghaixian,ningbo,zhejiang|nhx,nb,zj',
    '余姚市,宁波市,浙江省|yuyaoshi,ningbo,zhejiang|yys,nb,zj',
    '慈溪市,宁波市,浙江省|cixishi,ningbo,zhejiang|cxs,nb,zj',
    '奉化市,宁波市,浙江省|fenghuashi,ningbo,zhejiang|fhs,nb,zj',
    '鹿城区,温州市,浙江省|luchengqu,wenzhou,zhejiang|lcq,wz,zj',
    '龙湾区,温州市,浙江省|longwanqu,wenzhou,zhejiang|lwq,wz,zj',
    '瓯海区,温州市,浙江省|ouhaiqu,wenzhou,zhejiang|ohq,wz,zj',
    '洞头县,温州市,浙江省|dongtouxian,wenzhou,zhejiang|dtx,wz,zj',
    '永嘉县,温州市,浙江省|yongjiaxian,wenzhou,zhejiang|yjx,wz,zj',
    '平阳县,温州市,浙江省|pingyangxian,wenzhou,zhejiang|pyx,wz,zj',
    '苍南县,温州市,浙江省|cangnanxian,wenzhou,zhejiang|cnx,wz,zj',
    '文成县,温州市,浙江省|wenchengxian,wenzhou,zhejiang|wcx,wz,zj',
    '泰顺县,温州市,浙江省|taishunxian,wenzhou,zhejiang|tsx,wz,zj',
    '瑞安市,温州市,浙江省|ruianshi,wenzhou,zhejiang|ras,wz,zj',
    '乐清市,温州市,浙江省|leqingshi,wenzhou,zhejiang|lqs,wz,zj',
    '秀城区,嘉兴市,浙江省|xiuchengqu,jiaxing,zhejiang|xcq,jx,zj',
    '秀洲区,嘉兴市,浙江省|xiuzhouqu,jiaxing,zhejiang|xzq,jx,zj',
    '嘉善县,嘉兴市,浙江省|jiashanxian,jiaxing,zhejiang|jsx,jx,zj',
    '海盐县,嘉兴市,浙江省|haiyanxian,jiaxing,zhejiang|hyx,jx,zj',
    '海宁市,嘉兴市,浙江省|hainingshi,jiaxing,zhejiang|hns,jx,zj',
    '平湖市,嘉兴市,浙江省|pinghushi,jiaxing,zhejiang|phs,jx,zj',
    '桐乡市,嘉兴市,浙江省|tongxiangshi,jiaxing,zhejiang|txs,jx,zj',
    '吴兴区,湖州市,浙江省|wuxingqu,huzhou,zhejiang|wxq,hz,zj',
    '南浔区,湖州市,浙江省|nanxunqu,huzhou,zhejiang|nxq,hz,zj',
    '德清县,湖州市,浙江省|deqingxian,huzhou,zhejiang|dqx,hz,zj',
    '长兴县,湖州市,浙江省|zhangxingxian,huzhou,zhejiang|zxx,hz,zj',
    '安吉县,湖州市,浙江省|anjixian,huzhou,zhejiang|ajx,hz,zj',
    '越城区,绍兴市,浙江省|yuechengqu,shaoxing,zhejiang|ycq,sx,zj',
    '绍兴县,绍兴市,浙江省|shaoxingxian,shaoxing,zhejiang|sxx,sx,zj',
    '新昌县,绍兴市,浙江省|xinchangxian,shaoxing,zhejiang|xcx,sx,zj',
    '诸暨市,绍兴市,浙江省|zhujishi,shaoxing,zhejiang|zjs,sx,zj',
    '上虞市,绍兴市,浙江省|shangyushi,shaoxing,zhejiang|sys,sx,zj',
    '嵊州市,绍兴市,浙江省|shengzhoushi,shaoxing,zhejiang|szs,sx,zj',
    '婺城区,金华市,浙江省|wuchengqu,jinhua,zhejiang|wcq,jh,zj',
    '金东区,金华市,浙江省|jindongqu,jinhua,zhejiang|jdq,jh,zj',
    '武义县,金华市,浙江省|wuyixian,jinhua,zhejiang|wyx,jh,zj',
    '浦江县,金华市,浙江省|pujiangxian,jinhua,zhejiang|pjx,jh,zj',
    '磐安县,金华市,浙江省|pananxian,jinhua,zhejiang|pax,jh,zj',
    '兰溪市,金华市,浙江省|lanxishi,jinhua,zhejiang|lxs,jh,zj',
    '义乌市,金华市,浙江省|yiwushi,jinhua,zhejiang|yws,jh,zj',
    '东阳市,金华市,浙江省|dongyangshi,jinhua,zhejiang|dys,jh,zj',
    '永康市,金华市,浙江省|yongkangshi,jinhua,zhejiang|yks,jh,zj',
    '柯城区,衢州市,浙江省|kechengqu,quzhou,zhejiang|kcq,qz,zj',
    '衢江区,衢州市,浙江省|qujiangqu,quzhou,zhejiang|qjq,qz,zj',
    '常山县,衢州市,浙江省|changshanxian,quzhou,zhejiang|csx,qz,zj',
    '开化县,衢州市,浙江省|kaihuaxian,quzhou,zhejiang|khx,qz,zj',
    '龙游县,衢州市,浙江省|longyouxian,quzhou,zhejiang|lyx,qz,zj',
    '江山市,衢州市,浙江省|jiangshanshi,quzhou,zhejiang|jss,qz,zj',
    '定海区,舟山市,浙江省|dinghaiqu,zhoushan,zhejiang|dhq,zs,zj',
    '普陀区,舟山市,浙江省|putuoqu,zhoushan,zhejiang|ptq,zs,zj',
    '岱山县,舟山市,浙江省|daishanxian,zhoushan,zhejiang|dsx,zs,zj',
    '嵊泗县,舟山市,浙江省|shengsixian,zhoushan,zhejiang|ssx,zs,zj',
    '椒江区,台州市,浙江省|jiaojiangqu,taizhou,zhejiang|jjq,tz,zj',
    '黄岩区,台州市,浙江省|huangyanqu,taizhou,zhejiang|hyq,tz,zj',
    '路桥区,台州市,浙江省|luqiaoqu,taizhou,zhejiang|lqq,tz,zj',
    '玉环县,台州市,浙江省|yuhuanxian,taizhou,zhejiang|yhx,tz,zj',
    '三门县,台州市,浙江省|sanmenxian,taizhou,zhejiang|smx,tz,zj',
    '天台县,台州市,浙江省|tiantaixian,taizhou,zhejiang|ttx,tz,zj',
    '仙居县,台州市,浙江省|xianjuxian,taizhou,zhejiang|xjx,tz,zj',
    '温岭市,台州市,浙江省|wenlingshi,taizhou,zhejiang|wls,tz,zj',
    '临海市,台州市,浙江省|linhaishi,taizhou,zhejiang|lhs,tz,zj',
    '莲都区,丽水市,浙江省|liandouqu,lishui,zhejiang|ldq,ls,zj',
    '青田县,丽水市,浙江省|qingtianxian,lishui,zhejiang|qtx,ls,zj',
    '缙云县,丽水市,浙江省|jinyunxian,lishui,zhejiang|jyx,ls,zj',
    '遂昌县,丽水市,浙江省|suichangxian,lishui,zhejiang|scx,ls,zj',
    '松阳县,丽水市,浙江省|songyangxian,lishui,zhejiang|syx,ls,zj',
    '云和县,丽水市,浙江省|yunhexian,lishui,zhejiang|yhx,ls,zj',
    '庆元县,丽水市,浙江省|qingyuanxian,lishui,zhejiang|qyx,ls,zj',
    '景宁畲族自治县,丽水市,浙江省|jingningshezuzizhixian,lishui,zhejiang|jnszzzx,ls,zj',
    '龙泉市,丽水市,浙江省|longquanshi,lishui,zhejiang|lqs,ls,zj',
    '黄浦区,上海市,上海省|huangpuqu,shanghai,shanghai|hp,sh,sh',
    '卢湾区,上海市,上海省|luwanqu,shanghai,shanghai|lw,sh,sh',
    '徐汇区,上海市,上海省|xuihui,shanghai,shanghai|xh,sh,sh',
    '长宁区,上海市,上海省|changning,shanghai,shanghai|cn,sh,sh',
    '静安区,上海市,上海省|jingan,shanghai,shanghai|ja,sh,sh',
    '普陀区,上海市,上海省|putuo,shanghai,shanghai|pt,sh,sh',
    '闸北区,上海市,上海省|zhabei,shanghai,shanghai|zb,sh,sh',
    '虹口区,上海市,上海省|hongkou,shanghai,shanghai|hk,sh,sh',
    '杨浦区,上海市,上海省|yangpu,shanghai,shanghai|yp,sh,sh',
    '闵行区,上海市,上海省|minhang,shanghai,shanghai|mh,sh,sh',
    '宝山区,上海市,上海省|baoshan,shanghai,shanghai|bs,sh,sh',
    '嘉定区,上海市,上海省|jiading,shanghai,shanghai|jd,sh,sh',
    '浦东新区,上海市,上海省|pudongxin,shanghai,shanghai|pdx,sh,sh',
    '金山区,上海市,上海省|jinshan,shanghai,shanghai|js,sh,sh',
    '松江区,上海市,上海省|songjiang,shanghai,shanghai|cj,sh,sh',
    '奉贤区,上海市,上海省|fengxian,shanghai,shanghai|fx,sh,sh',
    '青浦区,上海市,上海省|qingpu,shanghai,shanghai|qp,sh,sh',
    '崇明县,上海市,上海省|chongming,shanghai,shanghai|cm,sh,sh'];
  export default {
    props: {
      value: {
        type: Object,
        twoWay: true,
        default: function () {
          return {
            province: null,
            city: null,
            zone: null
          };
        }
      }, show: {
        type: Boolean,
        twoWay: true,
        default: false
      }
    },
    data: function () {
      return {
        results: [],
        searchValue: '',
        allCity: allCity,
        provinces: null,
        regEx: /^(([\u4E00-\u9FA5\uf900-\ufa2d]+),(([\u4E00-\u9FA5\uf900-\ufa2d]+),([\u4E00-\u9FA5\uf900-\ufa2d]+)))\|(\w+),(\w+),(\w+)\|(\w)\w*,(\w)\w*,(\w)\w*/i,
        historyNum: 0,
        historyStack: [],
        province: null,
        city: null,
        zone: null,
        closeEvent: {
          _closeEvent: null,
          navbarTouchstart: null,
          navbarTouchmove: null,
          navbarTouchend: null
        },
        proShow: true,
        cityShow: false,
        searchShow: true,
        cities: [],
        current: '',
        hisCity: [],
        navbar: {
          Letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
          active: false
        },
        prompt: {
          currentLetter: '',
          active: false
        }
      };
    },
    watch: {
      show: function (val) {
        if (val) {
          this.init();
        } else {
          for (let key in this.closeEvent) {
            if (this.closeEvent[key] && this.closeEvent[key].remove) {
              this.closeEvent[key].remove();
            }
          }
        }
      }, zone: function () {
        this.value = {
          province: this.pro,
          city: this.city,
          zone: this.zone
        };
      }
    },
    compiled: function () {
    },
    ready: function () {
    },
    detached: function () {
      for (let key in this.closeEvent) {
        if (this.closeEvent[key] && this.closeEvent[key].remove) {
          this.closeEvent[key].remove();
        }
      }
    },
    methods: {
      init: function () {
        this.pro = this.value.province;
        this.city = this.value.city;
        this.zone = this.value.zone;
        this.current = this.zone;
        this.proShow = true;

        this.parseCity();
        setTimeout(() => {
          this.closeEvent._closeEvent = this.eventListener(window, 'popstate', this.popstateOperation);
        }, 500);
        this.forward();
        this.navEvent();
        this.getHistory();
      },
      getHistory: function () {
        let hisCity = JSON.parse(this.$h5getValue('yun_his_city'));
        this.hisCity = hisCity || [];
      },
      recordHistory: function (item) {
        setTimeout(() => {
          let hisCityStc = this.$h5getValue('yun_his_city');
          let hisCity = hisCityStc ? JSON.parse(hisCityStc) : [];
          let newhisCity = [];
          hisCity.map((city, index) => {
            if (city.city !== item.city || city.zone !== item.zone || city.pro !== item.pro) {
              newhisCity.push(city);
            }
          });
          newhisCity.unshift(item);
          if (newhisCity.length >= 10) {
            newhisCity.splice(10, 1);
          }
          this.hisCity = newhisCity;
          this.$h5setValue('yun_his_city', JSON.stringify(newhisCity));
        }, 1000);
      },
      resultClick: function (item) {
        this.pro = item.pro;
        this.city = item.city;
        this.zone = item.zone;
        this.current = item.zone;
        this.recordHistory({pro: this.pro, city: this.city, zone: this.zone});
        this.back(this.historyNum - 0);
      },

      // 搜索
      getResult: function (val) {
        if (!val) {
          this.results = [];
        }
        var res = [];
        this.allCity.map(ocity => {
          if (ocity.indexOf(val) !== -1) {
            let match = this.regEx.exec(ocity);
            res.push({
              title: match[1],
              pro: match[5],
              city: match[4],
              zone: match[2]
            });
          }
        });
        this.results = res;
      },
      // 解析allcity对象
      parseCity: function () {
        var firstLetters = {};
        this.navbar.Letters.map(letter => {
          firstLetters[letter] = null;
        });
        this.allCity.map(ocity => {
          let match = this.regEx.exec(ocity);
          let zone = match[2];
          let city = match[4];
          let province = match[5];
          let letter = match[10].toUpperCase();
          let cityobj = firstLetters[letter] = firstLetters[letter] !== null ? firstLetters[letter] : {};
          if (cityobj) {
            if (cityobj[city] && cityobj[city]['province'] === province) {
              if (zone.indexOf(cityobj[city]['zone']) === -1) {
                cityobj[city]['zone'].push(zone);
              }
            } else {
              cityobj[city] = {zone: [zone], province: province};
            }
          }
        });
        this.provinces = firstLetters;
      },
      clickaItem: function (item) {
        if (document.getElementById(item)) {
          var top = document.getElementById(item).offsetTop;
          document.getElementsByClassName('pro-picker')[0].scrollTop = top;
        }
      },
      // 获取 元素相对body的top
//      getElemPos: function (obj) {
//        var pos = {'top': 0, 'left': 0};
//        if (obj.offsetParent) {
//          while (obj.offsetParent) {
//            pos.top += obj.offsetTop;
//            pos.left += obj.offsetLeft;
//            obj = obj.offsetParent;
//          }
//        } else if (obj.x) {
//          pos.left += obj.x;
//        } else if (obj.x) {
//          pos.top += obj.y;
//        }
//        return {x: pos.left, y: pos.top};
//      },
      proClick: function (name, value) {
        let zones = value.zone;
        let province = value.province;
        this.pro = province;
        this.city = name;
        this.createCityList(zones);
        this.forward();
        this.proShow = false;
      },
      createCityList: function (zones) {
        this.cities = zones;
        this.cityShow = true;
      }, cityClick: function (cityname) {
        this.zone = cityname;
        this.pickerShow = false;
        this.proShow = false;
        this.cityShow = false;
        this.current = this.zone;
        this.recordHistory({pro: this.pro, city: this.city, zone: this.zone});
        this.back(this.historyNum - 0);

      },
      navEvent: function () {
        var navbar = this.$els.navbar;
        const that = this;
        this.closeEvent.navbarTouchstart = this.eventListener(navbar, 'touchstart', function (event) {

          that.prompt.currentLetter = event.target.innerHTML;
          that.prompt.active = true;
          that.navbar.active = true;
        });
        this.closeEvent.navbarTouchmove = this.eventListener(navbar, 'touchmove', function (event) {

        });
        this.closeEvent.navbarTouchend = this.eventListener(navbar, 'touchend', function (event) {
          that.navbar.active = false;
          that.prompt.active = false;
        });
      },

      popstateOperation: function () {
        if (this.historyNum === 1) {
          this.pickerShow = false;
          this.show = false;
          console.info('this.show:' + this.show);
          this.closeEvent._closeEvent.remove();
        } else if (this.historyNum === 2) {
          this.pickerShow = true;
          this.proShow = true;
          this.cityShow = false;
        } else {
          return;
        }
        this.historyNum--;
        this.historyStack.pop();
        console.info(this.historyNum);
        console.info(this.historyStack);
      },
      forward: function () {
        var url = window.location.href;
        history.pushState({}, '', url);
        this.historyNum++;
        this.historyStack.push(url);
        console.info(this.historyNum);
        console.info(this.historyStack);
      }, back: function (num) {
        this.historyNum -= (num - 1);
        for (var i = 0; i < num - 1; i++) {
          this.historyStack.pop();
        }
        window.history.go(-num);
      },
      eventListener: function (target, eventType, callback) {
        console.info('target:' + target);
        if (target.addEventListener) {
          target.addEventListener(eventType, callback, false);
          return {
            remove: function () {
              target.removeEventListener(eventType, callback, false);
            }
          };
        } else if (target.attachEvent) {
          target.attachEvent('on' + eventType, callback);
          return {
            remove: function () {
              target.detachEvent('on' + eventType, callback);
            }
          };
        } else {
          return;
        }
      }
    },
    components: {
      search: Search
    }
  };


</script>
<style>

  .address_content {
    position: fixed;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: 9999;
  }

  .address_search {
    font-size: 14px;
  }

  .address_search .vux-search_show {
    z-index: 9999;
    -webkit-overflow-scrolling: touch;
  }

  .address_search .vux-search-fixed .weui_search_bar {
  }

  .address_search .weui_search_inner {
    padding-right: 0px !important;
  }

  .picker-box {
    font-size: 16px;
    position: absolute;
    top: 44px;
    left: 0;
    bottom: 0;
    background-color: #fff;
    width: 100%;
    opacity: 1;
    -webkit-user-select: none;
  }

  .picker-box dt {
    background-color: #F9F9F9;
    padding: 8px 15px;
    color: #4A4A4A;
    font-size: 12px;
  }

  .picker-box dd {
    padding: 10px 20px;
    border-bottom: 1px solid #dbdbdb;
    color: #4A4A4A;
  }

  .pro-picker, .city-picker {
    position: relative;
    left: 0;
    background-color: #fff;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    line-height: 1;
    -webkit-overflow-scrolling: touch;
  }

  .picker-box .city-picker li {
    padding: 10px 20px;
    border-bottom: 1px solid #E4E7F0;;
  }

  .picker-box .navbar {
    position: fixed;
    top: 50%;
    right: 0;
    width: 25px;
    overflow-y: auto;
    -webkit-transform: translate(0, -50%);
    transform: translate(0, -50%);
    border-radius: 5px;
    z-index: 1;
  }

  .picker-box .navbar a {
    display: block;
    text-align: center;
    color: darkorange;
    font-size: 14px;
    line-height: 1.3;
  }

  .picker-box .navbar.active {
    background-color: grey;
  }

  .picker-box .navbar.active a {
    color: #fff;
  }

  .picker-box .prompt {
    display: block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    border-radius: 50%;
    background-color: gray;
    color: #fff;
    text-align: center;
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    z-index: 1;
  }

  .picker-box .city_button {
    border: 1px solid #E0E3EE;
    border-radius: 7px;
    font-size: 16px;
    text-align: center;
    background-color: #ffffff;
    margin-right: 15px;
    line-height: 2.2;
    width: 90px;
  }

  .city_button:after {
    border: none;
  }

  .picker-box .city-box .active {
    color: #FD7947;
  }

  .city-box label {
    padding-left: 5px;
    padding-right: 5px;
  }
</style>
