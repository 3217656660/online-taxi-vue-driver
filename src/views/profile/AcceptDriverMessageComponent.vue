<template>
  <div id="acceptDriverMessage">
    <div class="title">
      <h3>司机信息</h3>
    </div>
    <div class="container">
      <el-table :data="tableData">
        <el-table-column prop="mobile" label="手机号" width="110">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="70">
        </el-table-column>
        <el-table-column prop="carType" label="车辆类型" width="97">
        </el-table-column>
        <el-table-column prop="carNumber" label="车牌号">
        </el-table-column>
      </el-table>
    </div>
    <div class="editBtnContainer">
      <el-button type="primary" icon="el-icon-edit" @click="handleEdit">编辑</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="handleDelete">注销</el-button>
    </div>
    <div class="editContainer">
      <accept-edit-message-form-component 
        v-if="isLoadedData"
        :style="isDisplay" :driver-msg="tableData[0]"
        @update-driver-message="handleUpdate"
      />
    </div>
  </div>
</template>

<script>
import { Error_Msg } from '@/common/string';
import { requestGateway } from '@/network/request';
import store from '@/store';
import AcceptEditMessageFormComponent from '@/views/profile/AcceptEditMessageFormComponent.vue';
export default {
  name: "AcceptDriverMessageComponent",
  components: {
    AcceptEditMessageFormComponent,
  },
  mounted(){
    //请求信息
    this.getDriverMessage()
  },
  data() {
    return{
      tableData: [
        {
          mobile: '',
          name: '',
          carType: '',
          carNumber: ''
        },
      ],
      isDisplay: {display : 'none'},
      isLoadedData: false,
    }
  },
  methods: {
    /**
     * 获取司机信息
     */
    getDriverMessage(){
      const vm = this;
      requestGateway({
        url: '/api/driver/getById/' + store.state.Driver.id,
        method: 'get',
      }).then(res => {
        if(res.data === Error_Msg.FIND_ERROR){
          //没找到，去认证
          
          return;
        }

        store.commit('setDriver', res.data);
        vm.tableData[0].mobile = res.data.mobile;
        vm.tableData[0].name = res.data.name;
        vm.tableData[0].carType = res.data.carType;
        vm.tableData[0].carNumber = res.data.carNumber;
        vm.isLoadedData = true;
      }).catch(err => {
        console.log('err :>> ', err);
      })
    },


    /**
     * 处理编辑
     */
    handleEdit(){
      //展示变化
      if(this.isDisplay.display === 'none') this.isDisplay = {display : ''}
      else this.isDisplay = {display : 'none'}
    },


    /**
     * 处理删除
     */
    handleDelete(){
      //注销逻辑
      const vm = this;
      vm.$confirm('确定注销信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          //注销司机
          requestGateway({
            url: '/api/driver/delete',
            method: 'delete',
            data: {id: store.state.Driver.id}
          }).then(res => {
            if(res.data === Error_Msg.DELETE_ERROR){
              vm.$message({showClose: true, message: Error_Msg.DELETE_ERROR, type: 'success', offset: '60'})
              return;
            }
            vm.$message({showClose: true, message: "删除成功!", type: 'success', offset: '60'})
          }).catch(err => {
            console.log('err :>> ', err);
          });
        }).catch(() => {
          vm.$message({showClose: true, message: "已取消删除", type: 'info', offset: '60'})
        });
    },


    /**
     * 处理子组件传来的司机信息更新事件
     */
    handleUpdate(){
      this.tableData[0].name = store.state.Driver.name;
      this.tableData[0].carType = store.state.Driver.carType;
      this.tableData[0].carNumber = store.state.Driver.carNumber;
    },


    

  }
}
</script>

<style  scoped>
  @import url('@/assets/css/accept.css');

</style>