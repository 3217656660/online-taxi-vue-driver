<template>
  <div>
    <div id="not-null" v-show="!isNull">
      <div>
        <el-descriptions class="descriptions" title="" :column="1" :size="size" :border="true">
          <el-descriptions-item label="订单号">{{ this.order.id }}</el-descriptions-item>
          <el-descriptions-item label="起点">{{ this.order.startAddress }}</el-descriptions-item>
          <el-descriptions-item label="终点">{{ this.order.endAddress }}</el-descriptions-item>
          <el-descriptions-item label="距离">{{ this.order.distance / 1000 }}km</el-descriptions-item>
          <el-descriptions-item label="价格">{{ Price }}</el-descriptions-item>
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
          <el-descriptions-item label="订单状态">{{ StatusText }}</el-descriptions-item>
          <el-descriptions-item label="订单能否取消">{{ CanOrderCancelable }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="pay-btn-content">
        <el-button type="primary" @click="handlerCancel" :disabled="!(order.status < 2)">取消订单</el-button>
      </div>
    </div>

    <div id="null" v-show="isNull">
      <el-empty description="没有正在进行的订单"></el-empty>
    </div>
  </div>
</template>

<script >
import { requestGateway } from '@/network/request'
import store from '@/store'

export default {
  name: "UserTakingOrderComponent",
  data(){
    return {
      size: 'medium',
      order:{
        id:0,
        userId:0,
        driverId:0,
        startAddress: '',
        endAddress: '',
        distance: 0,
        status: 0,
        price: 0,
      },
      driver:{
        id: 0,
        mobile: '',
        username: '',
        carType: '',
        carNumber: '',
      },
      isNull: true
    }
  },
  methods:{
    handlerCancel(){
      //取消订单
      const vm = this
      requestGateway({
        url: "/api/order/cancelOrderByUser",
        method: 'post',
        params:{
          id: vm.order.id,
        }
      }).then(res => {
        if(res.data.status == 600){
          vm.$message({showClose: true,message: res.data.message, type: 'error',offset: '60'})
          return;
        }
        vm.$message({showClose: true,message: res.data.data, type: 'success',offset: '60'})
        vm.isNull = true
      }).catch(err => {
        console.log('err :>> ', err);
      })
    },

    getDriverMsg(){
      const vm = this
      if(vm.order.status === 0){
        vm.$message({showClose: true,message: "订单还没有被接单", type: 'error',offset: '60'})
        return;
      }
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

    takingOrder(){
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
        if(res.data.data === null){
          vm.isNull = true
          return
        }else{
          vm.isNull = false
        }
        vm.order = res.data.data
        store.commit('setOrder', res.data.data);
      }).catch(err => {
        console.log('err :>> ', err);
      })
    }
  },
  computed:{
    CanOrderCancelable(){
      return this.order.status < 2 ? "可取消" : "不可取消";
    },

    StatusText(){
      const vm = this
      if (vm.order.status === 0)
        return '待接单'
      else if(vm.order.status === 1)
        return '已接单'
      else if(vm.order.status === 2)
        return '行驶中'
      else if(vm.order.status === 3)
        return '未付款'
      else
        return "未知"
    },

    Price(){
      const vm = this
      if(vm.order.status === 0){
        return "待计算"
      }else{
        const km = vm.order.distance / 1000
        if (km <= 3) return 8;
        //保留两位小数
        return Math.round( (8 + (km-3)*2.4)*100 ) / 100 + "元";
      }

    },


  },
  mounted(){
    this.takingOrder()
  }

}
</script>

<style scoped>
  @import url('@/assets/css/profile.css');
</style>