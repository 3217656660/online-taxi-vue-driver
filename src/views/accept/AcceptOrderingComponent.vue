<template>
  <div id="acceptOrdering">

    <NavBarComponent>
      <div slot="center">正在进行中的订单</div>
      <div slot="right">
        <el-button @click="arriveStartAddress" type="text">到达起点</el-button>
      </div>
    </NavBarComponent>

    <div class="map-content">
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
      const vm = this
      const driverActionTakeOrderVo = {
        id: store.state.Order.id,
        driverId: store.state.Driver.id,
        userId: store.state.Order.userId,
        nowAddressLongitude: store.state.CurrentLocation.longitude,
        nowAddressLatitude: store.state.CurrentLocation.latitude,
      }
      vm.stompClient.send('/app/sendLocation', JSON.stringify(driverActionTakeOrderVo), { 'content-type': 'application/json' });
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
          vm.$router.back();
          vm.$message({ showClose: false, message: message.content, type: 'success', offset: '60' });
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
            //console.log('routeArr :>> ', routeArr);
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

            let i=0;
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
     * 司机到达起点
     */
    arriveStartAddress(){
      console.log('司机到达起点');
      const vm = this;
      clearInterval(vm.driveringTimer);
      //发送请求
      requestGateway({
        url: '/api/order/arriverStartAddress',
        method: 'post',
        params:{
          id: store.state.Order.id
        }
      }).then(res => {
        console.log('res :>> ', res);
        if(res.data.status === 200){
          console.log('司机到达起点成功');
          //最后推送一次司机的当前位置
          vm.showPositionToUser();

          //路由改变
          vm.$router.replace('/accept/toEndAddress');
        }else{
          vm.$message({ showClose: false, message: "到达起点错误，请稍后重试", type: 'error', offset: '60' });
        }
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
      this.marker = this.$refs.childMap.marker
      this.aMap = this.$refs.childMap.aMap

      //打包的时候解开 test
      //this.geoLocation(this.map, this);
      console.log('this.map,this.marker,this.aMap :>> ', this.map, this.marker, this.aMap);
      this.drivingToStartAddress();
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

.map-content {
  position: fixed;
  width: 100%;
  height: auto;
  padding: 0;
  top: 44px;
  bottom: 50px;
}
</style>