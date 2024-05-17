<template>
  <div id="update-content">
    <back-nav-bar-component :default-nav-color="defaultNavColor" :back-nav-color="backNavColor" />
    <h4 id="login-text">修改密码</h4>
    <el-form :model="form" status-icon :rules="rules" ref="form" label-width="0px" class="userForm">
      <div class="input-container">
        <el-form-item prop="mobile">
          <el-input type="text" v-model="form.mobile" autocomplete="off" placeholder="请输入手机号" class="input">
          </el-input>
        </el-form-item>
      </div>

      <div class="input-container">
        <el-form-item prop="oldPassword">
          <el-input type="password" v-model="form.oldPassword" autocomplete="off" placeholder="请输入旧密码" class="input">
          </el-input>
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
  name: "UpdatePasswordComponent",
  components: {
    BackNavBarComponent,

  },
  mixins: [makeElButtonBlurMixin],
  data() {
    //手机号校验
    let validateMobile = (rule, value, callback) => {
      if (!regex.phoneRegex.test(value))
        callback(new Error(Error_Msg.PHONE_REGEX_ERROR));
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

    //新密码校验
    let validateNewPassword = (rule, value, callback) => {
      if (!regex.passwordRegex.test(value))
        callback(new Error(Error_Msg.PASSWORD_REGEX_ERROR));
      else
        callback();
    };

    return {
      form: {
        mobile: '',
        oldPassword: '',
        newPassword: '',
      },
      rules: {
        mobile: [{ validator: validateMobile, trigger: 'blur' }],
        oldPassword: [{ validator: validatePassword, trigger: 'blur' }],
        newPassword: [{ validator: validateNewPassword, trigger: 'blur' }]
      },
      defaultNavColor: 'black',
      backNavColor: 'darkgray',
    }
  },
  methods: {
    //提交修改密码
    submit(event) {
      this.makeElButtonBlur(event)
      const vm = this
      vm.$refs.form.validate((valid) => {
        if (!valid) {
          vm.$message({ showClose: true, message: "请先完善填写", type: 'error', offset: '60' })
          return;
        }
        requestGateway({
          url: '/api/driver/update/password',
          method: 'put',
          params: this.form
        }).then(res => {
          if (res.data.status === 600) {
            vm.$message({ showClose: true, message: res.data.message, type: 'error', offset: '60' })
            return;
          }else if(res.data.status === 200){
            vm.$message({ showClose: true, message: "密码修改成功", type: 'success', offset: '60' })
            this.$router.back();
          }
        }).catch(err => {
          vm.$message({ showClose: true, message: "密码修改失败，请稍后重试", type: 'error', offset: '60' })
          console.log('err :>> ', err);
        });

      });
    },

  }

}
</script>

<style scoped>
#update-content {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
}

#login-text {
  top: 2%;
  position: relative;
  text-align: center;
}

.input-container {
  position: relative;
  margin-left: 15%;
  margin-top: 10%;
  width: 70%;
}

.login-btn {
  position: relative;
  margin-left: 15%;
  margin-top: 6%;
  width: 70%;
  height: 60px;
}

.input {
  font-size: 14px;
}
</style>