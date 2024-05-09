<template>
  <div id="find-content">
    <back-nav-bar-component :default-nav-color="defaultNavColor" :back-nav-color="backNavColor"/>
    <h4 id="login-text">找回密码</h4>
    <el-form :model="form" status-icon :rules="rules" ref="form" label-width="0px" class="userForm">
      <div class="input-container">
          <el-form-item prop="mobile">
            <el-input type="text" v-model="form.mobile" autocomplete="off" placeholder="请输入手机号" class="input">
            </el-input>
          </el-form-item>
      </div>

      <div class="input-container">
          <el-form-item prop="email">
            <el-input type="text" v-model="form.email" autocomplete="off" placeholder="请输入邮箱" class="input">
            </el-input>
          </el-form-item>
      </div>

      <div class="input-container">
        <el-form-item prop="code">
            <el-input type="text" v-model="form.code" autocomplete="off" placeholder="请输入六位验证码" class="code-input">
            </el-input>
            <el-button class="code-btn" @click="sendCode" :disabled="disabled">{{ sendBtnText }}</el-button>
        </el-form-item>
      </div>

      <div class="input-container">
          <el-form-item prop="newPassword">
            <el-input type="password" v-model="form.newPassword" autocomplete="off" placeholder="请输入新密码" class="input">
            </el-input>
          </el-form-item>
      </div>
      <el-button round @click="submit" class="login-btn">提交！</el-button>
    </el-form>
  </div>
</template>

<script>
import { makeElButtonBlurMixin } from '@/common/mixin';
import { Error_Msg } from '@/common/string';
import { regex } from '@/common/util';
import { requestGateway } from '@/network/request';
import BackNavBarComponent from '../navbar/BackNavBarComponent.vue';

export default {
  name: "FindPasswordComponent",
  data(){
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

    //邮箱校验
    let validateEmail = (rule, value, callback) => {
    if( !regex.emailRegex.test(value) )
      callback(new Error("邮箱格式错误"));
    else
      callback();
    };

    //验证码
    let validateCode = (rule, value, callback) => {
      if( !regex.codeRegex.test(value) )
        callback(new Error("验证码格式错误,应为6位数字"));
      else
        callback();
    };

    return {
      sendBtnText: '发送验证码',
      defaultNavColor: 'black',
      backNavColor: 'darkgray',
      disabled: false,
      timeOut: 0,
      countdown: 60,
      form: {
        mobile: '',
        newPassword: '',
        email: '',
        code: '',
      },
      rules: {
        mobile: [ {validator: validateMobile, trigger: 'blur'} ],
        newPassword: [ {validator: validatePassword, trigger: 'blur'} ],
        email: [ {validator: validateEmail, trigger: 'blur'} ],
        code: [ {validator: validateCode, trigger: 'blur'} ],
      }
    }
  },
  mixins:[makeElButtonBlurMixin],
  components:{
    BackNavBarComponent
  },
  methods: {
    /**
     * 给邮箱发送验证码
     */
    sendCode(){
      const vm = this
      requestGateway({
          url: '/api/user/sendEmail',
          method: 'get',
          params:{
            mobile: vm.form.mobile,
            email: vm.form.email
          }
        })
        .then(res => {
          if (res.data.status === 200) 
            return;
          vm.$message({showClose: true,message: res.data.message,type: 'error',offset: '60'})
        })
        .catch(err => {vm.$message({showClose: true, message: err, type: 'error', offset: '60'})})
        
        //设置发送邮件按钮不可按，倒计时一分钟,可以再次发送验证码
        vm.disabled = true
        vm.timeOut  = setInterval(() => {
          if (vm.countdown > 0){
            vm.sendBtnText = vm.countdown
            vm.countdown--;
          }
          else {
            //关闭倒计时，布局改变
            clearInterval(vm.timeOut)
            vm.disabled = false
            vm.countdown = 60
            vm.sendBtnText = '发送验证码'
          }
        }, 1000);
        
    },

    
    /**
     * 忘记密码并修改密码
     */
     submit(event) {
      this.makeElButtonBlur(event)
      const vm = this
      //数据格式校验
      vm.$refs.form.validate( (valid) => {
        if (!valid){
          vm.$message({showClose: true, message: "请先完善填写", type: 'error', offset: '60'})
          return;
        }
        requestGateway({
          url: '/api/user/updatePwdWithVerityCode',
          method: 'post',
          params:{
            mobile: vm.form.mobile,
            email: vm.form.email,
            newPassword: vm.form.newPassword,
            code: vm.form.code,
          }
        })
        .then(res => {
          if (res.data.status === 200){
            vm.$router.push('/login')
            vm.$message({showClose: true, message: "密码更改成功", type: 'success', offset: '60'})
            return;
          }
          vm.$message({showClose: true,message: res.data.message,type: 'error',offset: '60'})
        })
        .catch(err => {vm.$message({showClose: true, message: err, type: 'error', offset: '60'})})
      });

    },

  },

}
</script>

<style scoped>
  #find-content{
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
  }

  #login-text{
    top: 2%;
    position: relative;
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
    font-size: 14px;
  }

  .code-input{
    position: relative;
    font-size: 14px;
    width: 60%;
  }

  .code-btn{
    position: relative;
    text-align: center;
    font-size: 12px;
    width: 40%;
  }
</style>