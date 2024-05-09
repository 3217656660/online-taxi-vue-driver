<template>
  <div id="private-msg-content">
    <el-descriptions class="descriptions" title="" :column="1" :size="size" :border="true">
      <el-descriptions-item label="手机号">{{ this.mobile }}</el-descriptions-item>
      <el-descriptions-item label="注册时间">{{ this.createTime }}</el-descriptions-item>

      <el-descriptions-item label="用户名" v-if="defaultInputStyle">{{ this.username }}</el-descriptions-item>
      <el-descriptions-item label="用户名" v-else>
        <el-input v-model="username"></el-input>
      </el-descriptions-item>

      <el-descriptions-item label="邮箱" v-if="defaultInputStyle">{{ this.email }}</el-descriptions-item>
      <el-descriptions-item label="邮箱" v-else>
        <el-input v-model="email"></el-input>
      </el-descriptions-item>
    </el-descriptions>

    <div class="edit-btn-content">
      <el-button 
        type="primary" 
        icon="el-icon-edit" 
        @click="prepareEdit" 
        v-if="defaultInputStyle"
        >编辑
      </el-button>
      <div v-else>
        <el-button type="primary" icon="el-icon-close" @click="cancelEdit">取消</el-button>
        <el-button type="primary" icon="el-icon-finished" @click="submitEdit">修改</el-button>
      </div>
      
    </div>
  </div>
</template>

<script>
import { formatDateMixin } from '@/common/mixin';
import { requestGateway } from '@/network/request';
import store from '@/store';
export default {
  name: "SettingComponent",
  data(){
    return {
      size:'',
      defaultInputStyle: true,
      id: 0,
      username:"",
      mobile: "",
      email: "",
      createTime: "",
      oldUsername:'',
      oldEmail:''
    }
  },
  mixins:[formatDateMixin],
  methods:{
    //编辑前准备
    prepareEdit(){
      this.defaultInputStyle = !this.defaultInputStyle
      this.oldUsername = this.username
      this.oldEmail = this.email
    },

    //取消编辑
    cancelEdit(){
      this.defaultInputStyle = !this.defaultInputStyle
      this.username = this.oldUsername
      this.email = this.oldEmail
    },

    //提交更改的信息
    submitEdit(){
      this.defaultInputStyle = !this.defaultInputStyle
      const vm = this
      //查询个人信息
      requestGateway({
        url: "/api/user/update/message",
        method: 'put',
        data:{
          mobile: vm.mobile,
          username: vm.username,
          email: vm.email
        }
      }).then(res => {
        if(res.data.status == 600){
          vm.$message({showClose: true,message: res.data.message, type: 'error',offset: '60'})
          return;
        }
        vm.$message({showClose: true,message: res.data.data, type: 'success',offset: '60'})
        store.commit('setUser', {
          username: vm.username,
          email: vm.email
        });
      }).catch(err => {
        console.log('err :>> ', err);
      })
    },

    //请求个人信息
    getUserProfile(){
      let localUser = JSON.parse( localStorage.getItem('User') )
      const mobile = localUser.mobile
      const vm = this
      //查询个人信息
      requestGateway({
        url: "/api/user/get",
        method: 'get',
        params:{
          mobile: mobile
        }
      }).then(res => {
        if(res.data.status == 600){
          vm.$message({showClose: true,message: res.data.message, type: 'error',offset: '60'})
          return;
        }
        const user = res.data.data
        store.commit('setUser', res.data.data);
        vm.mobile = user.mobile
        vm.id = user.id
        vm.username = user.username
        vm.email = user.email
        vm.createTime = this.formatDate(user.createTime)
      }).catch(err => {
        console.log('err :>> ', err);
      })
    }

  },
  mounted(){
    this.getUserProfile()
  }
}
</script>

<style scoped>
#private-msg-content{
  margin-top: 10%;
  margin-left: 3%;
  margin-right: 3%;
  width: 94%;
}

.edit-btn-content{
  margin-top: 5%;
  margin-left: 5%;
}
</style>