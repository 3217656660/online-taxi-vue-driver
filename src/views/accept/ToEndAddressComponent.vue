<template>
  <div>

    <NavBarComponent>
      <div slot="center">
        {{ navText }}
      </div>
      <div slot="right" v-show="veritySuccess">
        <el-button @click="arriveEndAddress" type="text">到达终点</el-button>
      </div>
    </NavBarComponent>

    <div v-show="!veritySuccess">

      <div class="input-content">
        <el-input v-model="input" placeholder="请输入四位验证码" maxlength="4" show-word-limit></el-input>
      </div>

      <div class="btn-content">
        <el-button @click="verityCode">验证</el-button>
      </div>

    </div>

    <div v-show="veritySuccess" class="map-content">
      <MapComponent ref="childMap" @map-init-success="getMapProperties" />
      <div id="panel" style="display: none;"></div>
    </div>

  </div>
</template>

<script>
import { geoLocationWithSDK } from '@/common/mixin';
import MapComponent from '@/components/home/MapComponent.vue';
import NavBarComponent from '@/components/navbar/NavBarComponent.vue';
import { requestGateway } from '@/network/request';
import store from '@/store';

export default {
  name: 'ToEndAddressComponent',
  components: {
    NavBarComponent,
    MapComponent
  },
  mixins: [geoLocationWithSDK],
  mounted() {
    this.init();
  },
  data() {
    return {
      navText: '请输入用户提供的四位数字',
      input: '',
      veritySuccess: false,
      map: null,
      aMap: null,
    }
  },
  methods: {

    init() {
      
    },


    /**
    * 获取地图的属性,地图子组件加载完成时触发
    */
    getMapProperties() {
      this.map = this.$refs.childMap.map
      this.aMap = this.$refs.childMap.aMap

      //打包的时候解开 test
      //this.geoLocation(this.map, this);
    },


    //自动定位
    autoLocation() {
      this.geoLocation(this.map, this);
    },


    /**
     * 验证验证码
     */
    verityCode() {

      if (this.input.length !== 4) {
        this.$message({ showClose: false, message: "输入的验证码长度不正确", type: 'error', offset: '60' });
        return;
      }
      const vm = this;
      requestGateway({
        url: '/api/order/verityCode',
        method: 'post',
        params: {
          id: store.state.Order.id,
          code: vm.input,
        }
      }).then(res => {
        console.log('res :>> ', res);
        if (res.data.status === 600) {
          vm.$message({ showClose: false, message: res.data.message, type: 'error', offset: '60' });
          return;
        }
        //验证成功，从起点到终点导航
        vm.veritySuccess = true
        vm.navText = '正在前往终点'
        vm.drivingToEndAddress(0);
      }).catch(err => {
        console.log('err :>> ', err);
      });
    },


    /**
     * 导航到订单起点处
     * @param {*} strategy 路线选择策略
     */
    drivingToEndAddress(strategy) {
      // 添加起点和终点标记 test
      const vm = this
      const startPoint = new vm.aMap.LngLat(116.403322, 39.920255); // 起点经纬度 store.state.CurrentLocation.longitude, store.state.CurrentLocation.latitude
      const endPoint = new vm.aMap.LngLat(116.305475, 39.982821); // 终点经纬度 store.state.Order.endAddressLongitude, store.state.Order.endAddressLatitude
      const startMarker = new vm.aMap.Marker({
        position: startPoint,
        map: vm.map,
        icon: 'https://webapi.amap.com/images/car.png',
        offset: new vm.aMap.Pixel(-26, -13)
      });
      new vm.aMap.Marker({
        position: endPoint,
        map: vm.map
      });

      // 调用导航服务，并显示导航路径
      const driving = new vm.aMap.Driving({
        map: vm.map,
        panel: "panel",
        policy: strategy,
      });

      driving.search(startPoint, endPoint, function (status, result) {
        if (status === 'complete') {
          if (result.routes && result.routes.length) {
            const path = result.routes[0];
            let routeArr = [];
            for (let i = 0, l = path.steps.length; i < l; i++) {
              routeArr = routeArr.concat(path.steps[i].path);
            }

            // 将导航路径展示在地图上 const polyline = 
            new vm.aMap.Polyline({
              map: vm.map,
              path: routeArr,
              showDir: true,
              strokeColor: "#28F",  // 线颜色
              strokeWeight: 6,      // 线宽
              strokeOpacity: 0.5    // 线透明度
            });
            vm.map.setFitView();

            let i = 0;
            // 实时更新当前位置，并沿导航路线移动
            vm.driveringTimer = setInterval(function () {
              startMarker.setPosition(routeArr[i]); //store.state.CurrentLocation.longitude, store.state.CurrentLocation.latitude
              vm.map.setCenter(routeArr[i]); //store.state.CurrentLocation.longitude, store.state.CurrentLocation.latitude
              i++;
            }, 1000); // 每秒移动一次

          }
        } else {
          alert("导航失败！");
        }
      });
    },


    /**
     * 到达终点
     */
    arriveEndAddress() {
      const vm = this;
      requestGateway({
        url: '/api/order/arriveEndAddress',
        method: 'post',
        params: {
          id: store.state.Order.id,
        }
      }).then(res => {
        console.log('res :>> ', res);
        if (res.data.status === 600) {
          vm.$message({ showClose: false, message: res.data.message, type: 'error', offset: '60' });
          return;
        }
        //到达终点成功,订单结束
        vm.$router.replace('/accept/orderOver')
      }).catch(err => {
        console.log('err :>> ', err);
      });
    },



  },
}
</script>

<style scoped>
.input-content {
  top: 100px;
  position: fixed;
  left: 5%;
  width: 60%;
}

.btn-content {
  top: 100px;
  position: fixed;
  left: 70%;
  width: 60%;
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