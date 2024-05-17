<template>
  <div id="acceptOrdering">

    <NavBarComponent>
      <div slot="center">{{ navText }}</div>
      <div slot="right" v-show="!arriveSuccess">
        <el-button @click="arriveStartAddress" type="text">到达起点</el-button>
      </div>
    </NavBarComponent>

    <div v-show="arriveSuccess">

      <div class="input-content">
        <el-input v-model="input" placeholder="请输入四位验证码" maxlength="4" show-word-limit></el-input>
      </div>

      <div class="btn-content">
        <el-button @click="verityCode">验证</el-button>
      </div>

    </div>

    <div class="map-content" v-show="!arriveSuccess">
      <MapComponent ref="childMap" @map-init-success="getMapProperties" />
    </div>

    <div id="panel" style="display: none;"></div>

  </div>
</template>

<script>
import { checkIsLogin, geoLocationWithSDK, makeElButtonBlurMixin } from '@/common/mixin';
import MapComponent from '@/components/home/MapComponent.vue';
import NavBarComponent from '@/components/navbar/NavBarComponent.vue';
import { requestGateway } from '@/network/request';
import store from '@/store';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

export default {
  name: "AcceptOrderingComponent",
  mixins: [checkIsLogin, makeElButtonBlurMixin, geoLocationWithSDK],
  components: {
    NavBarComponent,
    MapComponent
  },
  data() {
    return {
      marker: null,
      map: null,
      aMap: null,
      stompClient: null,
      clearIntervalTime: 0,
      sendTime: 3000,
      driveringTimer: 0,
      order: {},
      arriveSuccess: false,
      navText: '正在前往起点',
      input: '',

    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.disconnect();
  },
  methods: {

    /**
     * 初始化
     */
    init() {

      this.order = store.state.Order;
      //定位,获取司机当前位置 test
      //this.autoLocation() 
      //实时共享位置给用户
      this.connect();

      //检查是否到达起点 
      const vm = this;
      requestGateway({
        url: '/api/order/checkArriveStartAddress',
        method: 'get',
        params: {
          id: store.state.Order.id
        }
      }).then(res => {
        console.log('res :>> ', res);
        if (res.data.status === 200) {
          console.log('司机到达起点成功');
          clearInterval(vm.driveringTimer);
          //等待验证码
          vm.arriveSuccess = true;
          clearInterval(vm.clearIntervalTime);
          vm.navText = '等待用户的四位验证码';
        }
      }).catch(err => {
        console.log('err :>> ', err);
      });
    },


    /**
    * 关闭连接
    */
    disconnect() {
      if (this.stompClient !== null) {
        this.stompClient.disconnect();
      }
      console.log("Disconnected");
      //清除
      clearInterval(this.clearIntervalTime)
      clearInterval(this.driveringTimer)
    },


    /**
     * 建立连接
     */
    connect() {
      const vm = this
      const socket = new SockJS('/websocket/ws');
      vm.stompClient = Stomp.over(socket);
      vm.stompClient.connect({
      }, frame => {
        console.log('Connected: ' + frame);

        //固定周期调用一次
        vm.clearIntervalTime = setInterval(function () {
          vm.showPositionToUser();
        }, vm.sendTime);

        //监听用户是否取消
        vm.listenUserCancelOrder();

      }, error => {
        console.error('Error connecting to WebSocket:', error);
      });
    },


    /**
     * 实时共享位置给用户(周期：定位一次并推送给用户)
     */
    showPositionToUser() {
      //定位获取最新位置 test
      //this.autoLocation()
      //真实发送 test
      // const vm = this
      // const driverActionTakeOrderVo = {
      //   id: store.state.Order.id,
      //   driverId: store.state.Driver.id,
      //   userId: store.state.Order.userId,
      //   nowAddressLongitude: store.state.CurrentLocation.longitude,
      //   nowAddressLatitude: store.state.CurrentLocation.latitude,
      // }

      // vm.stompClient.send('/app/sendLocation', JSON.stringify(driverActionTakeOrderVo), { 'content-type': 'application/json' });
    },


    /**
     * 监听用户是否取消订单
     */
    listenUserCancelOrder() {
      const vm = this
      const driverId = store.state.Order.driverId;
      vm.stompClient.subscribe(`/user/${driverId}/queue/cancelOrder/notifications`, notification => {
        const message = JSON.parse(notification.body)
        console.log('乘客发来一条消息内容是' + message);
        //乘客取消订单，直接结束
        if (message.type === "cancelOrder") {
          vm.disconnect();
          //返回接单列表界面
          vm.$router.replace('/accept');
          vm.$message({ showClose: false, message: message.content, type: 'success', offset: '60', duration: 0 });
        }
      });
    },


    /**
     * 导航到订单起点处
     */
    drivingToStartAddress() {
      // 添加起点和终点标记 test
      const vm = this
      const startPoint = new vm.aMap.LngLat(116.403322, 39.920255); // 起点经纬度 store.state.CurrentLocation.longitude, store.state.CurrentLocation.latitude
      const endPoint = new vm.aMap.LngLat(116.305475, 39.982821); // 终点经纬度 store.state.Order.startAddressLongitude, store.state.Order.startAddressLatitude
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
        panel: "panel"
      });

      driving.search(startPoint, endPoint, function (status, result) {
        if (status === 'complete') {
          if (result.routes && result.routes.length) {
            const path = result.routes[0];
            let routeArr = [];
            for (let i = 0, l = path.steps.length; i < l; i++) {
              routeArr = routeArr.concat(path.steps[i].path);
            }
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
              //模拟发送 test
              if (i < routeArr.length) {
                i++;
              }

              const driverActionTakeOrderVo = {
                id: store.state.Order.id,
                driverId: store.state.Driver.id,
                userId: store.state.Order.userId,
                nowAddressLongitude: routeArr[i].lng,
                nowAddressLatitude: routeArr[i].lat,
              }
              vm.stompClient.send('/app/sendLocation', JSON.stringify(driverActionTakeOrderVo), { 'content-type': 'application/json' });
              startMarker.setPosition(routeArr[i]); //store.state.CurrentLocation.longitude, store.state.CurrentLocation.latitude
              vm.map.setCenter(routeArr[i]); //store.state.CurrentLocation.longitude, store.state.CurrentLocation.latitude
            }, 1000); // 每秒移动一次

          }
        } else {
          alert("导航失败！");
        }
      });
    },


    /**
     * 司机到达起点
     */
    arriveStartAddress() {
      console.log('司机到达起点');
      const vm = this;

      //发送请求
      requestGateway({
        url: '/api/order/arriverStartAddress',
        method: 'post',
        params: {
          id: store.state.Order.id
        }
      }).then(res => {
        console.log('res :>> ', res);
        if (res.data.status === 200) {
          console.log('司机到达起点成功');
          clearInterval(vm.driveringTimer);

          //最后推送一次司机的当前位置
          vm.showPositionToUser();

          //等待验证码
          vm.arriveSuccess = true;
          clearInterval(vm.clearIntervalTime);
          vm.navText = '等待用户的四位验证码';
        } else {
          vm.$message({ showClose: false, message: "到达起点错误，请稍后重试", type: 'error', offset: '60' });
        }
      }).catch(err => {
        console.log('err :>> ', err);
      });
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
        //验证成功,路由改变
        vm.$router.replace('/accept/toEndAddress');
      }).catch(err => {
        console.log('err :>> ', err);
      });
    },


    //自动定位
    autoLocation() {
      this.geoLocation(this.map, this);
    },


    /**
     * 获取地图的属性,地图子组件加载完成时触发
     */
    getMapProperties() {
      this.map = this.$refs.childMap.map
      this.aMap = this.$refs.childMap.aMap

      //打包的时候解开 test
      //this.geoLocation(this.map, this);
      this.drivingToStartAddress();
    },

  },

}
</script>

<style scoped>
#acceptOrdering {
  position: fixed;
  padding: 0px;
  top: 0;
  width: 100%;
}

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