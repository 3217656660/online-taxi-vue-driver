<template>
  <div id="prepare-take-order">
    <el-descriptions title="订单信息" :column="2" size="mini" border>
      <el-descriptions-item label="起点">{{start}}</el-descriptions-item>
      <el-descriptions-item label="终点">{{end}}</el-descriptions-item>
      <el-descriptions-item label="预估距离">{{distance / 1000}}km</el-descriptions-item>
      <el-descriptions-item label="预估价格">{{price}}元</el-descriptions-item>
      <el-descriptions-item label="预计到达时间">{{arriveTimeStr}}</el-descriptions-item>
      <el-descriptions-item label="订单状态">{{orderStatus}}</el-descriptions-item>
      <template slot="extra">
        <el-button size="medium" @click="takeOrder" round :style="createOrderSuccessPreDisplay" >
          下单
        </el-button>
        <el-button size="medium" @click="cancel" round :style="createOrderSuccessPreDisplay">
          取消
        </el-button>
        <el-button size="medium" @click="cancelOrder" round :style="createOrderSuccessDisplay">
          取消订单
        </el-button>
      </template>
    </el-descriptions>
    <div :style="createOrderSuccessDisplay">
      正在等待司机接单..., 剩余时间:{{countdown}}秒
    </div>
  </div>
</template>

<script>
import store from '@/store';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

export default {
  name: "PrepareTakeOrderComponent",
  props: [
    'start', 'end', 'distance', 'arriveTime'
  ],
  data() {
    return {
      createOrderSuccessPreDisplay: {display: ''},
      createOrderSuccessDisplay: {display: 'none'},
      timeOut: 0,
      countdown: 600,
      stompClient: null,
      message: '',
      orderStatus: '未下单',
      
    }
  },
  methods: {
    /**
     * 取消预备订单，也就是没有提交到服务端的订单
     */
    cancel() {
      //给父组件通信，清空所有相关信息
      this.$emit('cancel-event')
    },

    
    /**
     * 提交订单到服务端
     */
    takeOrder() {
      this.orderStatus = '待接单'
      const vm = this;
        //1.收集数据
        const order = {
          userId: store.state.User.id,
          startAddress: vm.start,
          startLongitude: store.state.StartPosition[0],
          startLatitude: store.state.StartPosition[1],
          endAddress: vm.end,
          endLongitude: store.state.EndPosition[0],
          endLatitude: store.state.EndPosition[1],
          distance: Math.round( (vm.distance / 1000) * 100) / 100,
        };
        console.log('order :>> ', order);
        //2.发送请求


        //3.界面变化
        vm.handleCreateOrderSuccess();
    },


    /**
     * 处理订单创建
     */
    handleCreateOrderSuccess() {
      const vm = this
      //1.修改页面信息，展示正在寻找司机
      vm.createOrderSuccessPreDisplay = {display: 'none'}
      vm.createOrderSuccessDisplay = {display: ''}
      vm.orderStatus = '待接单'
      //2.websocket订阅是否有司机接单
      //vm.connect();
      //马鞍山市人民医院
      //马鞍山金鹰
      //3.显示倒计时10分钟，倒计时结束后自动请求后端查询订单状态，根据信息取消订单，并告知用户没有司机接单
      vm.timeOut = setInterval(() => {
        if (vm.countdown > 0)
          vm.countdown--;
        else {
          //后端会自动取消订单
          vm.$message({showClose: true, message: "暂无司机接单,请重新尝试", type: 'error', offset: '60'});
          //关闭倒计时，布局改变
          vm.cancelOrder();
        }
      }, 1000);

    },


    /**
     * 订阅订单是否被接单
     */
    connect() {
      const vm = this
      const socket = new SockJS('/websocket/ws');
      vm.stompClient = Stomp.over(socket);
      vm.stompClient.connect({}, frame => {
        console.log('Connected: ' + frame);
        //订阅司机接单消息
        const userId = store.state.User.id;
        vm.stompClient.subscribe(`/user/${userId}/queue/orderAccept/notifications`, notification => {
          vm.message = JSON.parse(notification.body).content;
          //改变仓库数据
          store.commit('setUserCreateOrderVo', {"driverId": vm.message.driverId, "status": 1})
          store.commit('setAcceptPosition', [vm.message.nowAddressLongitude, vm.message.nowAddressLatitude])
          //通知父组件接单成功
          this.$emit('take-order-success-event');
        });

      }, error => {
        console.error('Error connecting to WebSocket:', error);
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
    },


    /**
     * 取消已经创建好的订单
     */
    cancelOrder() {
      const vm = this;
      if(vm.countdown === 0){//倒计时结束的取消订单
        vm.createOrderSuccessPreDisplay = {display: ''}
        vm.createOrderSuccessDisplay = {display: 'none'}
        vm.orderStatus = '已取消'
        vm.countdown = 600
        clearInterval(vm.timeOut)
        return;
      }

      //用户主动取消订单
      //1.发送取消请求，提示取消结果
      //2.取消成功关闭websocket连接，解除倒计时，改变页面。取消失败继续进行订单
      const orderId = store.state.Order.id
      //取消请求
      console.log('orderId :>> ', orderId);
      vm.createOrderSuccessPreDisplay = {display: ''}
      vm.createOrderSuccessDisplay = {display: 'none'}
      vm.orderStatus = '已取消'
      vm.countdown = 600
      clearInterval(vm.timeOut)
      return;

    },


  },
  computed: {
    /**
     * 预估价格计算属性
     * 三公里内8元起步价，三公里以上每公里收2.4元
     */
    price() {
      const km = this.distance / 1000
      if (km <= 3) return 8;
      //保留两位小数
      return Math.round( (8 + (km-3)*2.4)*100 ) / 100;
    },


    /**
     * 预计到达时间计算属性
     */
    arriveTimeStr() {
      const second = this.arriveTime
      const hour = Math.floor(second / 3600)
      //分钟默认去尾+1
      const minute = Math.floor(second / 60 % 60 + 1)
      return hour >= 1 ? hour+'小时'+minute+'分钟' : minute+'分钟';
    }

  },
  beforeDestroy() {
    this.disconnect();
  }
}
</script>

<style scoped>
#prepare-take-order{
  background-color:lavender;
  position: fixed;
  width: 100%;
  top: 14%;
  z-index: 99;
}
</style>