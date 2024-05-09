<template>
  <div>
    <div id="not-null" v-show="!isNull">
      <el-descriptions class="descriptions" title="待支付订单" :column="1" :size="size" :border="true">
        <el-descriptions-item label="订单号">{{ this.order.id }}</el-descriptions-item>
        <el-descriptions-item label="起点">{{ this.order.startAddress }}</el-descriptions-item>
        <el-descriptions-item label="终点">{{ this.order.endAddress }}</el-descriptions-item>
        <el-descriptions-item label="距离">{{ this.order.distance / 1000 }}km</el-descriptions-item>
        <el-descriptions-item label="价格">{{ this.order.price }}元</el-descriptions-item>
        <el-descriptions-item label="司机信息">
          <el-popover
              placement="top-start"
              width="300px"
              trigger="click">
              <el-descriptions title="" direction="vertical" :column="2" border>
                <el-descriptions-item label="姓名">{{ this.driver.username }}</el-descriptions-item>
                <el-descriptions-item label="手机号">{{ this.driver.mobile }}</el-descriptions-item>
                <el-descriptions-item label="车辆类型">{{ this.driver.carType }}</el-descriptions-item>
                <el-descriptions-item label="车牌号">{{ this.driver.carType }}</el-descriptions-item>
              </el-descriptions>
              <el-link type="primary" @click="getDriverMsg" slot="reference">
                点我查看
              </el-link>
            </el-popover>
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ this.order.createTime }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ this.order.endTime }}</el-descriptions-item>
      </el-descriptions>
      <div class="pay-btn-content">
        <el-button type="primary" @click="handlerPay">支付宝支付</el-button>
      </div>
    </div>

    <div id="null" v-show="isNull">
      <el-empty description="没有未支付的订单"></el-empty>
    </div>
    <div v-html="payHtml">
    </div>
  </div>
</template>

<script>
import { formatDateMixin } from '@/common/mixin';
import { requestGateway } from '@/network/request';
import store from '@/store';

export default {
  name: "UserNoPaymentComponent",
  data(){
    return{
      size: 'medium',
      order: {
        id:0,
        userId: 0,
        driverId: 0,
        startAddress: "",
        endAddress: "",
        distance: 0,
        price: 0,
        createTime: "",
        endTime: ""
      },
      driver:{
        id: 0,
        mobile: '',
        username: '',
        carType: '',
        carNumber: '',
      },
      payHtml: '',
      isNull: true,
    }
  },
  mixins:[formatDateMixin],
  methods: {
    //获取当前未支付订单的司机信息
    getDriverMsg(){
      const vm = this
      requestGateway({
        url: "/api/driver/getById",
        method: 'get',
        params:{
          id: vm.order.driverId,
        }
      }).then(res => {
        if(res.data.status == 600){
          vm.$message({showClose: true,message: res.data.message, type: 'error',offset: '60'})
          return;
        }
        vm.driver = res.data.data
        store.commit('setDriver', res.data.data);
      }).catch(err => {
        console.log('err :>> ', err);
      })
    },

    //支付函数
    //支付回调没写完
    handlerPay(){
      const vm = this
      requestGateway({
        url: "/api/payment/doPay",
        method: 'get',
        params:{
          id: vm.order.id,
        }
      }).then(res => {
        if(res.data.status == 600){
          vm.$message({showClose: true,message: res.data.message, type: 'error',offset: '60'})
          return;
        }
        let str = res.data.data
        vm.payHtml = str.replace('style="display:none"', 'style="display:none" id="pay-btn"')
        setInterval(function(){
          document.getElementById('pay-btn').click()
        }, 50);
      }).catch(err => {
        console.log('err :>> ', err);
      })

    },

    getNoPayOrder(){
      let localUser = JSON.parse( localStorage.getItem('User') )
      const userId = localUser.id
      const vm = this
      //查询个人信息
      requestGateway({
        url: "/api/order/checkOrder",
        method: 'get',
        params:{
          userId: userId,
        }
      }).then(res => {
        if(res.data.status == 600){
          vm.$message({showClose: true,message: res.data.message, type: 'error',offset: '60'})
          return;
        }
        if(res.data.data === null || res.data.data.status !== 3){
          vm.isNull = true
          return
        }else {
          vm.isNull = false
        }
        vm.order = res.data.data
        vm.order.createTime = vm.formatDate(vm.order.createTime)
        vm.order.endTime = vm.formatDate(vm.order.endTime)
      }).catch(err => {
        console.log('err :>> ', err);
      });
    }


  },
  mounted(){
    //获取当前未支付订单信息
    this.getNoPayOrder()
  }
}
</script>

<style scoped>
@import url('@/assets/css/profile.css');
</style>