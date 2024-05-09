<template>
  <div id="loginForm">
    <h4 id="login-text">登录</h4>
    <el-form :model="user" status-icon :rules="rules" ref="user" label-width="0px" class="userForm">
        <div class="input-container">
          <el-form-item prop="mobile">
            <el-input type="text" v-model="user.mobile" autocomplete="off" placeholder="请输入手机号" class="input">
            </el-input>
          </el-form-item>
        </div>
        <div class="input-container">
          <el-form-item prop="password">
            <el-input type="password" v-model="user.password" autocomplete="off" placeholder="请输入密码" class="input">
            </el-input>
          </el-form-item>
        </div>
        <el-button round @click="submit" class="login-btn">登录！</el-button>
        <div class="login-link-container">
            <el-link style="position: relative;margin-left: 15%;" @click="goFindPassword">忘记密码？</el-link>
            <el-link style="position: relative;margin-left: 40%;" @click="goRegister">去注册！</el-link>
        </div>
      </el-form>
  </div>
</template>

<script>
import { makeElButtonBlurMixin } from '@/common/mixin';
import { Error_Msg } from '@/common/string';
import { regex } from '@/common/util';
import { requestGateway } from '@/network/request';
import store from '@/store';

export default {
  name: "LoginFormComponent",
  data() {
    //手机号校验
    let validateMobile = (rule, value, callback) => {
      if( !regex.phoneRegex.test(value) )
        callback(new Error(Error_Msg.PHONE_REGEX_ERROR));
      else
        callback();
    };

    //密码校验
    let validatePassword = (rule, value, callback) => {
      if( !regex.passwordRegex.test(value) )
        callback(new Error(Error_Msg.PASSWORD_REGEX_ERROR));
      else
        callback();
    };
    return {
      user: {
        mobile:'',
        password: '',
      },
      
      rules: {
        mobile: [ {validator: validateMobile, trigger: 'blur'} ],
        password: [ {validator: validatePassword, trigger: 'blur'} ]
      }
    }
  },
  mixins:[makeElButtonBlurMixin],
  methods: {
    /**
     * 登录
     */
    submit(event) {
      this.makeElButtonBlur(event)
      const vm = this
      //数据格式校验
      vm.$refs.user.validate( (valid) => {
        if (!valid){
          vm.$message({showClose: true, message: "请先完善填写", type: 'error', offset: '60'})
          return;
        }
        requestGateway({
          url: '/api/user/login',
          method: 'post',
          data: this.user
        })
        .then(res => {
          if (res.data.status === 200) {//将用户信息传入vuex中修改
            store.commit('setUser', {mobile: vm.user.mobile, password: vm.user.password})
            store.commit('setIsLogin', "yes")
            store.commit('setXToken', res.data.data)
            //退回
            vm.$router.push('/home')
            vm.$message({showClose: true,message: "成功",type: 'success',offset: '60'})
            return;
          } 
          vm.$message({showClose: true,message: res.data.message,type: 'info',offset: '60'})
        })
        .catch(err => {vm.$message({showClose: true, message: err, type: 'error', offset: '60'})})
      });
    },

    /**
     * 去注册
     */
    goRegister(){
      this.$router.push('/register')
    },
    
    /**
     * 找回密码
     */
    goFindPassword(){
      this.$router.push('/findPassword')
    }

  }
}

</script>

<style scoped>
  #loginForm{
    width: 100%;
    height: 100%;
  }

  #login-text{
    text-align: center;
  }

  .input-container{
    position: relative;
    margin-left: 15%;
    margin-top: 10%;
    width: 70%;
  }

  .login-btn{
    position: relative;
    margin-left: 15%;
    margin-top: 6%;
    width: 70%;
    height: 60px;
  }

  .input{
    font-size: 16px;
  }

  .login-link-container{
    position: relative;
  }
</style>