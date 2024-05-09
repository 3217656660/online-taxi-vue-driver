<template>
  <div id="registerForm">
    <h4 id="register-text">注册</h4>
    <el-form :model="user" status-icon :rules="rules" ref="user" label-width="0px" class="userForm">
        <div class="input-container">
          <el-form-item prop="mobile">
            <el-input type="text" v-model="user.mobile" autocomplete="off" placeholder="请输入手机号" class="input">
            </el-input>
          </el-form-item>
        </div>

        <div class="input-container">
          <el-form-item prop="username">
            <el-input type="text" v-model="user.username" autocomplete="off" placeholder="请输入用户名" class="input">
            </el-input>
          </el-form-item>
        </div>

        <div class="input-container">
          <el-form-item prop="email">
            <el-input type="text" v-model="user.email" autocomplete="off" placeholder="请输入邮箱" class="input">
            </el-input>
          </el-form-item>
        </div>

        <div class="input-container">
          <el-form-item prop="password">
            <el-input type="password" v-model="user.password" autocomplete="off" placeholder="请输入密码" class="input">
            </el-input>
          </el-form-item>
        </div>

        <div class="input-container">
          <el-form-item prop="confirmPassword">
            <el-input type="password" v-model="user.confirmPassword" autocomplete="off" placeholder="请再次确认您的密码" class="input">
            </el-input>
          </el-form-item>
        </div>

        <el-button round @click="submit" class="login-btn" :disabled="!agree">注册！</el-button>
        <div class="login-link-container">
          <el-link style="position: relative;margin-left: 15%;" href="/agreement">
              是否同意协议<i class="el-icon-view el-icon--right"></i>
          </el-link>

          <el-switch style="position: relative;margin-left: 8%;" v-model="agree">
          </el-switch>
          <span style="position: relative;margin-left: 2%;">{{chooseText}}</span>
        </div>
      </el-form>
  </div>
</template>

<script>
import { makeElButtonBlurMixin } from '@/common/mixin';
import { Error_Msg } from '@/common/string';
import { regex } from '@/common/util';
import { requestGateway } from '@/network/request';

export default {
  name: "RegisterFormComponent",
  data() {
    //手机号校验
    let validateMobile = (rule, value, callback) => {
      if( !regex.phoneRegex.test(value) )
        callback(new Error(Error_Msg.PHONE_REGEX_ERROR));
      else
        callback();
    };

    //用户名校验
    let validateUsername = (rule, value, callback) => {
      if( !regex.userNameRegex.test(value) )
        callback(new Error(Error_Msg.USERNAME_REGEX_ERROR));
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

    //密码校验
    let validatePassword = (rule, value, callback) => {
      if( !regex.passwordRegex.test(value) )
        callback(new Error(Error_Msg.PASSWORD_REGEX_ERROR));
      else
        callback();
    };

    //再次确认密码校验
    let validateConfirmPassword = (rule, value, callback) => {
      if( !regex.passwordRegex.test(value) )
        callback(new Error(Error_Msg.PASSWORD_REGEX_ERROR));
      else if ( value !== this.user.password )
        callback(new Error(Error_Msg.CONFIRMPASSWORD_REGEX_ERROR));
      else
        callback();
    };

    return {
      user: {
        mobile:'',
        username:'',
        password: '',
        confirmPassword:'',
        email:'',
      },
      rules: {
        mobile: [ {validator: validateMobile, trigger: 'blur'} ],
        username: [ {validator: validateUsername, trigger: 'blur'} ],
        email: [ {validator: validateEmail, trigger: 'blur'} ],
        password: [ {validator: validatePassword, trigger: 'blur'} ],
        confirmPassword: [ {validator: validateConfirmPassword, trigger: 'blur'} ]
      },
      agree: false,
    }
  },
  mixins:[makeElButtonBlurMixin],
  methods: {
    /**
     * 注册
     */
    submit(event) {
      this.makeElButtonBlur(event)
      //数据格式校验
      if(!this.agree) return;
      const vm = this;
      vm.$refs.user.validate( (valid) => {
        if (!valid){
          vm.$message({showClose: true,message: "请先完善填写",type: 'error',offset: '60'})
          return;
        }
        requestGateway({
          url: '/api/user/update/register',
          method: 'post',
          data: {
            mobile: vm.user.mobile,
            password: vm.user.password,
            username: vm.user.username,
            email: vm.user.email,
          }, 
        }).then(res => {
          if(res.data.status === 200){
            vm.$router.push('/home')
            vm.$message({showClose: true, message: '注册成功', type: 'success', offset: '60'})
            return;
          }
          vm.$message({showClose: true,message: res.data.message, type: 'error', offset: '60'})
        }).catch(err => {
          console.log('err :>> ', err);
        })
      });
    },
    
  },
  computed: {
    chooseText(){
      return this.agree ? "同意" : "不同意";
    }
  }
}
</script>

<style scoped>
  #registerForm{
    width: 100%;
    height: 100%;
  }

  #register-text{
    text-align: center;
  }

  .input-container{
    position: relative;
    margin-left: 15%;
    margin-top: 8%;
    width: 70%;
  }

  .login-btn{
    position: relative;
    margin-top: 4%;
    margin-left: 15%;
    width: 70%;
    height: 50px;
  }

  .input{
    font-size: 16px;
  }

  .login-link-container{
    position: relative;
    margin-top: 8%;
  }
</style>