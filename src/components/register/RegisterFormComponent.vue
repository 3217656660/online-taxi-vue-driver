<template>
  <div id="registerForm">
    <div class="steps-content">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="填写信息"></el-step>
        <el-step title="验证码"></el-step>
        <el-step title="填写密码"></el-step>
      </el-steps>
    </div>

    <el-form :model="driver" status-icon :rules="rules" ref="driver" label-width="0px" class="driverForm">

      <div class="first-step" v-if="this.active === 0">
        <div class="input-container">
          <el-form-item prop="mobile">
            <el-input type="text" key="input-1" v-model="driver.mobile" autocomplete="off" placeholder="请输入手机号"
              class="input">
            </el-input>
          </el-form-item>
        </div>

        <div class="input-container">
          <el-form-item prop="username">
            <el-input type="text" key="input-2" v-model="driver.username" autocomplete="off" placeholder="请输入用户名"
              class="input">
            </el-input>
          </el-form-item>
        </div>

        <div class="input-container">
          <el-form-item prop="carType">
            <el-input type="text" key="input-3" v-model="driver.carType" autocomplete="off" placeholder="请输入车牌号"
              class="input">
            </el-input>
          </el-form-item>
        </div>

        <div class="input-container">
          <el-form-item prop="carNumber">
            <el-input type="text" key="input-4" v-model="driver.carNumber" autocomplete="off" placeholder="请输入车辆类型"
              class="input">
            </el-input>
          </el-form-item>
        </div>
        <el-button round @click="next" class="login-btn" key="button-0">下一步</el-button>
      </div>

      <div class="second-step" v-if="this.active === 1">
        <div class="input-container">
          <el-form-item prop="email">
            <el-input type="text" key="input-5" v-model="driver.email" autocomplete="off" placeholder="请输入邮箱"
              class="input">
            </el-input>
          </el-form-item>
        </div>

        <div class="input-container">
          <el-form-item prop="code">
            <el-input type="text" key="input-6" v-model="driver.code" autocomplete="off" placeholder="请输入六位验证码"
              class="code-input">
            </el-input>
            <el-button class="code-btn" @click="sendCode" :disabled="disabled">{{ sendBtnText }}</el-button>
          </el-form-item>
        </div>

        <el-button round @click="pre" class="login-btn" key="button-1">上一步</el-button>
        <el-button round @click="next" class="login-btn" key="button-2" :disabled="verityCode">下一步</el-button>
      </div>

      <div class="third-step" v-if="this.active === 2">
        <div class="input-container">
          <el-form-item prop="password">
            <el-input type="password" key="input-7" v-model="driver.password" autocomplete="off" placeholder="请输入密码"
              class="input">
            </el-input>
          </el-form-item>
        </div>

        <div class="input-container">
          <el-form-item prop="confirmPassword">
            <el-input type="password" key="input-8" v-model="driver.confirmPassword" autocomplete="off"
              placeholder="请再次确认您的密码" class="input">
            </el-input>
          </el-form-item>
        </div>

        <el-button round @click="pre" class="login-btn" key="button-3">上一步</el-button>
        <el-button round @click="submit" class="login-btn" key="button-4" :disabled="!agree">注册！</el-button>

        <div class="login-link-container">
          <el-link style="position: relative;margin-left: 15%;" href="/agreement">
            是否同意协议<i class="el-icon-view el-icon--right"></i>
          </el-link>

          <el-switch style="position: relative;margin-left: 8%;" v-model="agree">
          </el-switch>
          <span style="position: relative;margin-left: 2%;">{{ chooseText }}</span>
        </div>
      </div>

    </el-form>
  </div>
</template>

<script>
import { makeElButtonBlurMixin } from '@/common/mixin';
import { Error_Msg } from '@/common/string';
import { regex } from '@/common/util';
// import { requestGateway } from '@/network/request';

export default {
  name: "RegisterFormComponent",
  data() {
    //手机号校验
    let validateMobile = (rule, value, callback) => {
      if (!regex.phoneRegex.test(value))
        callback(new Error(Error_Msg.PHONE_REGEX_ERROR));
      else
        callback();
    };

    //用户名校验
    let validateUsername = (rule, value, callback) => {
      if (!regex.userNameRegex.test(value))
        callback(new Error(Error_Msg.USERNAME_REGEX_ERROR));
      else
        callback();
    };

    //邮箱校验
    let validateEmail = (rule, value, callback) => {
      if (!regex.emailRegex.test(value))
        callback(new Error("邮箱格式错误"));
      else
        callback();
    };

    //密码校验
    let validatePassword = (rule, value, callback) => {
      if (!regex.passwordRegex.test(value))
        callback(new Error(Error_Msg.PASSWORD_REGEX_ERROR));
      else
        callback();
    };

    //再次确认密码校验
    let validateConfirmPassword = (rule, value, callback) => {
      if (!regex.passwordRegex.test(value))
        callback(new Error(Error_Msg.PASSWORD_REGEX_ERROR));
      else if (value !== this.driver.password)
        callback(new Error(Error_Msg.CONFIRMPASSWORD_REGEX_ERROR));
      else
        callback();
    };

    //验证码
    let validateCode = (rule, value, callback) => {
      if (!regex.codeRegex.test(value))
        callback(new Error("验证码格式错误,应为6位数字"));
      else
        callback();
    };

    return {
      sendBtnText: '发送验证码',
      disabled: false,
      verityCode: false,//在请求后修改
      timeOut: 0,
      countdown: 60,
      agree: false,
      active: 0,
      driver: {
        mobile: '15246882520',
        username: 'zxy',
        password: '123456',
        confirmPassword: '123456',
        email: '3217656660@qq.com',
        carNumber: '黑A106AM',
        carType: '黑色奔驰',
        code: 123456
      },
      rules: {
        mobile: [{ validator: validateMobile, trigger: 'blur' }],
        username: [{ validator: validateUsername, trigger: 'blur' }],
        email: [{ validator: validateEmail, trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }],
        confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
        code: [{ validator: validateCode, trigger: 'blur' }],
      },
    }
  },
  mixins: [makeElButtonBlurMixin],
  methods: {
    /**
     * 注册
     */
    submit(event) {
      this.makeElButtonBlur(event)
      //数据格式校验
      if (!this.agree) return;
      const vm = this;
      vm.$refs.driver.validate((valid) => {
        if (!valid) {
          vm.$message({ showClose: true, message: "请先完善填写", type: 'error', offset: '60' })
          return;
        }
        // requestGateway({
        //   url: '/api/user/update/register',
        //   method: 'post',
        //   data: {
        //     mobile: vm.user.mobile,
        //     password: vm.user.password,
        //     username: vm.user.username,
        //     email: vm.user.email,
        //   }, 
        // }).then(res => {
        //   if(res.data.status === 200){
        //     vm.$router.push('/home')
        //     vm.$message({showClose: true, message: '注册成功', type: 'success', offset: '60'})
        //     return;
        //   }
        //   vm.$message({showClose: true,message: res.data.message, type: 'error', offset: '60'})
        // }).catch(err => {
        //   console.log('err :>> ', err);
        // })
      });
    },

    //上一步
    pre(event) {
      this.makeElButtonBlur(event)
      this.active--;
    },

    //下一步
    next(event) {
      this.active++;
      this.makeElButtonBlur(event)
    },

    /**
    * 给邮箱发送验证码
    */
    sendCode() {
      const vm = this
      // requestGateway({
      //   url: '/api/user/sendEmail',
      //   method: 'get',
      //   params: {
      //     mobile: vm.driver.mobile,
      //     email: vm.driver.email
      //   }
      // })
      //   .then(res => {
      //     if (res.data.status === 200)
      //       return;
      //     vm.$message({ showClose: true, message: res.data.message, type: 'error', offset: '60' })
      //   })
      //   .catch(err => { vm.$message({ showClose: true, message: err, type: 'error', offset: '60' }) })

      //设置发送邮件按钮不可按，倒计时一分钟,可以再次发送验证码
      vm.disabled = true
      vm.timeOut = setInterval(() => {
        if (vm.countdown > 0) {
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

    //验证验证码
    verityCodeSafe() {
      const vm = this;
      vm.verityCode = false
    },

  },
  computed: {
    chooseText() {
      return this.agree ? "同意" : "不同意";
    }
  }
}
</script>

<style scoped>
#registerForm {
  width: 100%;
  height: 100%;
}

.steps-content {
  top: 60px;
  margin-left: 5%;
  margin-right: 5%;
  width: 90%;
}

.input-container {
  position: relative;
  margin-left: 15%;
  margin-top: 8%;
  width: 70%;
}

.login-btn {
  position: relative;
  margin-top: 4%;
  margin-left: 15%;
  width: 70%;
  height: 50px;
}

.input {
  font-size: 16px;
}

.code-input {
  position: relative;
  font-size: 14px;
  width: 60%;
}

.code-btn {
  position: relative;
  text-align: center;
  font-size: 12px;
  width: 40%;
}

.login-link-container {
  position: relative;
  margin-top: 8%;
}
</style>