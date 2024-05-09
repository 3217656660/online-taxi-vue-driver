<template>
  <div>
    <back-nav-bar-component :default-nav-color="defaultNavColor" :back-nav-color="backNavColor"/>
    <div class="order-content">
        <el-descriptions class="descriptions" title="订单详情" :column="1" :size="size" :border="true">
          <el-descriptions-item label="订单号">{{ this.order.id }}</el-descriptions-item>
          <el-descriptions-item label="起点">{{ this.order.startAddress }}</el-descriptions-item>
          <el-descriptions-item label="终点">{{ this.order.endAddress }}</el-descriptions-item>
          <el-descriptions-item label="距离">{{ this.order.distance / 1000 }}km</el-descriptions-item>
          <el-descriptions-item label="价格">{{ Price }}</el-descriptions-item>
          <el-descriptions-item label="司机信息" v-if="this.order.driverId !== 0">

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
          <el-descriptions-item label="订单状态">{{ this.order.statusText }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ this.order.createTime }}</el-descriptions-item>
          <el-descriptions-item label="结束时间" v-if="this.order.status >= 4 && this.order.endTime!==null">{{ this.order.endTime }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="delete-btn-content">
        <el-button type="primary" @click="handlerDelete" :disabled="!(order.status >= 4)">删除订单</el-button>
      </div>
  </div>
</template>

<script>
import { formatDateMixin } from '@/common/mixin';
import BackNavBarComponent from '@/components/navbar/BackNavBarComponent.vue';
import { requestGateway } from '@/network/request';
import store from '@/store';

export default {
  name:"OrderItemComponent",
  components: {
    BackNavBarComponent,
  },
  data(){
    return{
      size: 'medium',
      order: {
        id:0,
        userId:0,
        driverId:0,
        startAddress: '',
        endAddress: '',
        distance: 0,
        status: 0,
        price: 0,
      },
      driver: {
        id: 0,
        mobile: '',
        username: '',
        carType: '',
        carNumber: '',
      },
      defaultNavColor: 'black',
      backNavColor: 'darkgray'
    }
  },
  mixins:[formatDateMixin],
  methods:{
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

    handlerDelete(){
      const vm = this
      requestGateway({
        url: "/api/order/update/deleteByUser",
        method: 'delete',
        params:{
          id: vm.order.id,
        }
      }).then(res => {
        if(res.data.status == 600){
          vm.$message({showClose: true,message: res.data.message, type: 'error',offset: '60'})
          return;
        }
        this.$router.back()
        store.commit('setOrder', {})
        store.commit('setDriver', {})
        vm.$message({showClose: true,message: res.data.data, type: 'success',offset: '60'})
      }).catch(err => {
        console.log('err :>> ', err);
      })
    },

    setStatusTextAndDate(){
      const vm = this
      // 创建一个映射对象，将status值映射到相应的statusText
      const statusMapping = {
          0: '待接单',
          1: '待行驶',
          2: '行驶中',
          3: '待支付',
          4: '已支付',
          5: '已取消',
      };
      vm.order.statusText = statusMapping[vm.order.status] || 'Unknown';
      vm.order.createTime = this.formatDate(vm.order.createTime)
      vm.order.endTime = this.formatDate(vm.order.endTime)
    },

  },
  mounted(){
    this.order = store.state.Order
    this.setStatusTextAndDate()
  },
  computed:{
  
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

  }

}
</script>

<style scoped>
.order-content{
  position: relative;
  left: 5%;
  right: 5%;
  width: 90%;
}

.delete-btn-content{
  position: relative;
  margin-left: 60%;
  margin-top: 5%;
}
</style>