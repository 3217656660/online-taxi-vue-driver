<template>
  <div id="acceptList-content">

    <NavBarComponent class="nav-content">
      <div slot="left">
        <el-button class="back-btn" @click="$router.back()">
          <i class="el-icon-back"></i>
        </el-button>
      </div>

      <div slot="center">
        <h3>可接单列表</h3>
      </div>

      <div slot="right">
        <i :class="fleshClass" id="flesh-i" @click="reLoad"></i>
      </div>
    </NavBarComponent>

    <div v-show="tableData.length !== 0" class="infinite-list-wrapper">
      <template>
        <ul class="infinite-list" v-infinite-scroll="load" :infinite-scroll-disabled="disable" style="overflow:auto">
          <li v-for="(item, i) in tableData" class="infinite-list-item" :key="i">
            <div class="order-content">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>订单详情：</span>
                  <el-button style="float: right; padding: 3px 0" type="text" @click="acceptOrder(item)">接单</el-button>
                </div>
                <div>
                  订单id: {{ item.id }}
                </div>
                <div>
                  起点：{{ item.startAddress }}
                </div>
                <div>
                  终点：{{ item.endAddress }}
                </div>
                <div>
                  距离：{{ item.distance / 1000 }}km
                </div>
                <div>
                  估价：{{ showPrice(item.distance) }}元
                </div>
              </el-card>
            </div>
          </li>
        </ul>
      </template>
    </div>

    <div v-show="tableData.length === 0" class="empty-content">
      <el-empty description="还没有可接订单"></el-empty>
    </div>

  </div>
</template>

<script>
import { Error_Msg } from '@/common/string';
import NavBarComponent from '@/components/navbar/NavBarComponent.vue';
import { requestGateway } from '@/network/request';
import store from '@/store';

export default {
  name: "AcceptListComponent",
  mounted() {
    //获取可接单列表
    this.getList();
  },
  components: {
    NavBarComponent,

  },
  data() {
    return {
      tableData: [],
      haveMsg: false,
      AMap: null,
      fleshClass: 'el-icon-refresh-left',
      staticFleshClass: 'el-icon-refresh-left',
      loadingFleshClass: 'el-icon-loading',
      pageNum: 0,
      pageSize: 5,
      disable: false,
    }
  },
  methods: {
    /**
     * 司机接单
     * @param {*} order 点击的订单信息
     */
    acceptOrder(order) {
      order.driverId = store.state.Driver.id;
      console.log(order);
      const vm = this;
      requestGateway({
        url: '/api/order/acceptOrder',
        method: 'put',
        data: order
      }).then(res => {
        if (res.data.status === 600) {
          vm.$message({ showClose: true, message: res.data.message, type: 'error', offset: '60' })
          return;
        } else if (res.data.status === 200) {
          //接单成功
          store.commit('setOrder', order);
          //改变界面
          this.$router.push('/accept/taking');
          vm.$message({ showClose: true, message: res.data.message, type: 'success', offset: '60' })
        }
      }).catch(err => {
        console.log('err :>> ', err);
      });
    },


    load() {
      this.getList()
    },


    /**
     * 重新加载
     */
    reLoad() {
      this.disable = false;
      this.tableData = []
      this.pageNum = 0
      this.getList()
    },


    /**
     * 获取接单列表
     */
    getList() {
      const vm = this;
      vm.fleshClass = vm.loadingFleshClass;
      const nextPage = vm.pageNum + 1;
      requestGateway({
        url: '/api/order/getAcceptList',
        method: 'get',
        params: {
          "longitude": 1,//test store.state.CurrentLocation.longitude
          "latitude": 1,//test store.state.CurrentLocation.latitude
          "pageNum": nextPage,  //请求下一页
          "pageSize": vm.pageSize,
        }
      }).then(res => {
        vm.fleshClass = vm.staticFleshClass;
        console.log('res.data :>> ', res.data);
        if (res.data.status === 600 && res.data.message === '当前没有可接订单') {
          //没订单接
          this.disable = true
          vm.$message({ showClose: true, message: Error_Msg.NO_ACCEPTABLE_ORDER, type: 'info', offset: '60' })
          return;
        } else if (res.data.status === 600) {
          //出现错误
          this.disable = true
          vm.$message({ showClose: true, message: res.data.message, type: 'error', offset: '60' })
          return;
        } else if (res.data.status === 200 && res.data.data === 'over') {
          //到头了
          vm.$message({ showClose: true, message: '到头啦', type: 'info', offset: '60' })
          vm.disable = true;
          return;
        }
        //拼接list
        vm.pageNum = nextPage;
        vm.tableData = vm.tableData.concat(res.data.data);
      }).catch(err => {
        console.log('err :>> ', err);
        vm.fleshClass = vm.staticFleshClass;
      });
    },


    showPrice(distance) {
      const km = distance / 1000
      if (km <= 3) return 8;
      //保留两位小数
      return Math.round((8 + (km - 3) * 2.4) * 100) / 100;
    },

  },

  computed: {

  }

}
</script>

<style scoped>
.nav-content {
  position: fixed;
  z-index: 99;
}

.el-icon-back {
  font-size: 25px;
}

#flesh-i {
  font-size: 22px;
}

.back-btn {
  /* 让按钮透明 */
  background-color: transparent;
  border-color: transparent;
}

.order-content {
  position: relative;
  margin-top: 2px;
}

.infinite-list {
  position: fixed;
  width: 100%;
  top: 44px;
  left: 0;
  bottom: 50px;
}

.infinite-list-wrapper {
  position: relative;
  top: 0px;
  bottom: 300px;
}

.empty-content {
  position: relative;
  top: 200px;
}
</style>