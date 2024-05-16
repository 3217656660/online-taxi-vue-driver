<template>
  <div id="accept">

    <nav-bar-component>
      <div slot="left">
        <el-button class="location-btn" @click="location" type="text">定位</el-button>
      </div>
      <div slot="center">
        <SearchSuggestComponent ref="searchChild" :is-disabled="false" />
      </div>
      <div slot="right">
        <el-button class="accept-btn" @click="toAccept" type="text">接单</el-button>
      </div>
    </nav-bar-component>

    <div class="map-content">
      <map-component ref="childMap" @map-init-success="getMapProperties" />
    </div>

  </div>
</template>

<script>
import { checkIsLogin, geoLocationWithSDK, makeElButtonBlurMixin } from '@/common/mixin';
import MapComponent from '@/components/home/MapComponent.vue';
import NavBarComponent from '@/components/navbar/NavBarComponent.vue';
import SearchSuggestComponent from '@/components/searchSuggest/SearchSuggestComponent.vue';
import { requestGateway, requestMapSearch } from '@/network/request';
import store from '@/store';

export default {
  name: "AcceptComponent",
  mixins: [checkIsLogin, makeElButtonBlurMixin, geoLocationWithSDK],
  components: {
    NavBarComponent,
    MapComponent,
    SearchSuggestComponent
  },
  data() {
    return {
      input: '安徽工业大学东校区',
      driving: null, //AMap.Driving实例
      marker: null,
      map: null,
      aMap: null,
    }
  },
  mounted() {
    //初始化
    this.init();

    this.$message({ showClose: true, message: "如定位不准请手动输入当前位置点击定位", type: 'info', offset: '60', duration: 0 })
  },
  methods: {
    
    init() {
      //查询司机信息设置到本地
      requestGateway({
        url: '/api/driver/getByMobile',
        method: 'get',
        params: {
          mobile: store.state.Driver.mobile,
        }
      }).then(res => {
        if(res.data.status === 600){
          this.$message({ showClose: true, message: "司机信息获取失败", type: 'error', offset: '60'})
          return;
        }
        store.commit('setDriver', res.data.data);
      }).catch(err => {
        console.log('err :>> ', err);
      });
    },

    
    /**
     * 获取地图的属性,地图子组件加载完成时触发
     */
    getMapProperties() {
      this.map = this.$refs.childMap.map
      this.marker = this.$refs.childMap.marker
      this.aMap = this.$refs.childMap.aMap

      //打包的时候解开
      //this.geoLocation(this.map, this);
      console.log('this.map,this.marker,this.aMap :>> ', this.map, this.marker, this.aMap);
    },


    //自动定位
    autoLocation() {
      this.geoLocation(this.map, this);
      this.addPoint([store.state.CurrentLocation.longitude, store.state.CurrentLocation.latitude])
    },


    //手动定位
    location() {
      const vm = this
      vm.removePoint()
      if (vm.input === null) {
        vm.$message({ showClose: false, message: "输入地点不能为空", type: 'error', offset: '60', duration: 0 })
        return;
      }
      //用户手敲的地址并没有选择提示框内的地址
      const regex = /市/
      let address = this.$refs.searchChild.searchSuggestInput
      const result = regex.test(address)
      //添加市缩小范围
      if (!result) {//没有市默认本市
        address = store.state.City + address
        requestMapSearch({
          searchAddress: address
        }).then(res => {
          const list = ('' + res.data.geocodes[0].location).split(',')
          store.commit('setAcceptPosition', list)
          vm.$refs.childMap.map.setZoomAndCenter(17, list)
          //将点展示出来
          vm.addPoint(list);
        }).catch(err => {
          console.log('err :>> ', err);
          vm.$message({ showClose: true, message: "起点地址查询失败，请稍后重试", type: 'error', offset: '60' });
        });
      }
    },


    //添加点标记
    addPoint(location) {
      const vm = this
      const map = vm.$refs.childMap.map
      const aMap = vm.$refs.childMap.aMap
      const marker = new aMap.Marker({
        icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        position: location,
        offset: new aMap.Pixel(-13, -30)
      });
      marker.setMap(map);
      vm.marker = marker;
      this.$message({ showClose: false, message: "地址查询成功", type: 'success', offset: '60' });
    },


    //删除点标记
    removePoint() {
      const vm = this
      if (vm.marker != null) {
        vm.marker.setMap(null);
        vm.marker = null;
      }
    },


    //去接单
    toAccept() {
      //去可接单列表的界面
      this.$router.push('/accept/list');
    },

  }

}
</script>

<style scoped>
#accept {
  position: fixed;
  padding: 0px;
  top: 0;
  width: 100%;
}

.map-content {
  position: fixed;
  width: 100%;
  height: auto;
  padding: 0;
  top: 44px;
  bottom: 50px;
}
</style>