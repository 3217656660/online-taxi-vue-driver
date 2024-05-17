<template>
  <div>
    <div class="table-container">
      <el-table
        :data="tableData" border height="420">
        <el-table-column prop="startAddress" label="起点" width="120"></el-table-column>
        <el-table-column prop="endAddress" label="终点" width="120"></el-table-column>
        <el-table-column prop="statusText" label="订单状态" width="80"></el-table-column>
        <el-table-column label="操作" fixed="right" width="50">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-content">
        <el-pagination
          small
          background
          :page-size="pageSize"
          :total="total"
          :current-page="currentPage"
          @current-change="handleSelectPage"
          layout="prev, pager, next">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { requestGateway } from '@/network/request';
import store from '@/store';
export default {
  name: "UserAllOrderComponent",
  data(){
    return {
      pageSize: 7,
      total: 0,
      currentPage: 0,
      tableData: [],
    }
  },
  methods: {
    //点击查看处理函数
    handleClick(row) {
      store.commit('setOrder', row)
      this.$router.push('/orderItem')
    },

    //选页处理函数
    handleSelectPage(clickPage){
      this.currentPage = clickPage
      let localDriver = JSON.parse( localStorage.getItem('Driver') )
      const driverId = localDriver.id
      const vm = this
      requestGateway({
        url:"/api/order/get/driver/history",
        params:{
          driverId: driverId,
          pageNum: clickPage,
          pageSize: vm.pageSize
        }
      }).then(res => {
        if(res.data.status === 600){
          vm.$message({showClose: true,message: res.data.message, type: 'error',offset: '60'})
          return;
        }
        vm.tableData = res.data.data.items
        vm.total = res.data.data.totalItems
        vm.setStatusText()
      }).catch(err => {
        console.log('err :>> ', err);
      })
    },

    setStatusText(){
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
      vm.tableData.forEach(item => {
          item.statusText = statusMapping[item.status] || 'Unknown';
      });
    }

  },
  mounted(){
    this.handleSelectPage(1)
  },
}
</script>

<style scoped>
@import url('@/assets/css/profile.css');
</style>