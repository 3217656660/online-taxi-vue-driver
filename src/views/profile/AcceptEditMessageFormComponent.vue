<template>
  <div class="editFormContainer">
    <el-form label-position="right" label-width="80px" :model="driver">
      <el-form-item label="姓名">
        <el-input v-model="driver.name"></el-input>
      </el-form-item>
      <el-form-item label="车辆类型">
        <el-input v-model="driver.carType"></el-input>
      </el-form-item>
      <el-form-item label="车牌号">
        <el-input v-model="driver.carNumber"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-popover
          placement="top"
          title="规则"
          width="300"
          trigger="click"
          content='1.姓名: 1-10位中文, 2.车辆类型: 3-10位中文, 3.车牌号: 第1位中文,第2、6、7位大写英文,第3-5为数字。'>
          <el-button slot="reference">修改规则</el-button>
        </el-popover>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Error_Msg } from '@/common/string';
import { regex } from '@/common/util';
import { requestGateway } from '@/network/request';
import store from '@/store';
export default {
  name: "AcceptEditMessageFormComponent",
  props:['driverMsg'],
  data(){
    return {
      driver: {
        id: store.state.Driver.id,
        name: this.driverMsg.name,
        carType: this.driverMsg.carType,
        carNumber: this.driverMsg.carNumber
      },

    }
  },
  methods: {
    /**
     * 表单提交
     */
    submitForm(){
      //1.参数校验
      //2.提交修改
      const vm = this;
      const a = regex.driverNameRegex.test(vm.driver.name);
      const b = regex.driverCarTypeRegex.test(vm.driver.carType);
      const c = regex.driverCarNumberRegex.test(vm.driver.carNumber);
      if(!a){
        vm.$message({showClose: true, message: "姓名格式错误,详见修改规则", type: 'error', offset: '60'})
        return;
      }
      if(!b){
        vm.$message({showClose: true, message: "车辆描述格式错误,详见修改规则", type: 'error', offset: '60'})
        return;
      }
      if(!c){
        vm.$message({showClose: true, message: "车牌号格式错误,详见修改规则", type: 'error', offset: '60'})
        return;
      }
      
      requestGateway({
        url: '/api/driver/message',
        method: 'put',
        data: vm.driver
      }).then(res => {
        console.log('res :>> ', res);
        if (res.data === Error_Msg.UPDATE_ERROR) {
          vm.$message({showClose: true, message: Error_Msg.UPDATE_ERROR, type: 'error', offset: '60'})
          return;
        }
        vm.$message({showClose: true, message: Error_Msg.UPDATE_SUCCESS, type: 'success', offset: '60'})
        //修改仓库中相应内容
        store.commit('setDriver', vm.driver);
        vm.$emit('update-driver-message');
      }).catch(err => {
        console.log('err :>> ', err);
      })
    },


  },

}
</script>

<style scoped>

</style>