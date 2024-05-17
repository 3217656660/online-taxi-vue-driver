<template>
  <div id="profile">
    <nav-bar-component>
      <div slot="left">
        <h3>个人</h3>
      </div>
      <div slot="right">
        <el-dropdown @command="handleCommand" trigger="click">
          <i class="el-icon-more"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="findPassword">忘记密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            <el-dropdown-item command="delete">注销账号</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </nav-bar-component>

    <routerView></routerView>
  </div>
</template>

<script>
import { checkIsLogin } from '@/common/mixin';
import NavBarComponent from '@/components/navbar/NavBarComponent.vue';
import { requestGateway } from '@/network/request';
import store from '@/store';

export default {
  name: "ProfileComponent",
  mixins: [checkIsLogin],
  created() {
    //创建后检查登录状态,没有登录就让用户去登录界面进行登录
    //this.checkLogin(this)
  },
  components: {
    NavBarComponent
  },
  data() {
    return {
      path: 'userProfile'
    }
  },
  methods: {
    /**
     * 选择页面
     * @param {*} command 选择的路由
     */
    handleCommand(command) {
      if (command === 'findPassword') {

        this.$router.push('/findPassword');

      } else if (command === 'logout') {

        this.$confirm('退出登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          //退出登录逻辑
          this.logout();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消退出登录'
          });
        });

      } else if (command === 'delete') {

        this.$confirm('注销账号, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          //注销逻辑
          this.delete();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消注销'
          });
        });
      }
    },


    logout() {
      requestGateway({
        url: '/api/driver/logout',
        method: 'post',
        params: {
          mobile: store.state.Driver.mobile
        }
      }).then(res => {
        console.log('res :>> ', res);
        if (res.data.statue === 600) {
          this.$message({ showClose: true, message: res.data.message, type: 'error', offset: '60' })
          return;
        }
        //路由改变
        this.$router.replace('/login')
        this.$message({ type: 'success', message: '退出登录成功!' });
      }).catch(err => {
        console.log('err :>> ', err);
      });
    },


    delete() {
      requestGateway({
        url: '/api/driver/update/delete',
        method: 'delete',
        params: {
          mobile: store.state.Driver.mobile
        }
      }).then(res => {
        console.log('res :>> ', res);
        if (res.data.statue === 600) {
          this.$message({ showClose: true, message: res.data.message, type: 'error', offset: '60' })
          return;
        }
        //路由改变
        this.$router.replace('/login');
        this.$message({ type: 'success', message: '账号注销成功!' });
      }).catch(err => {
        console.log('err :>> ', err);
      });
    },

  }

}
</script>

<style scoped>
.el-icon-more {
  font-size: 25px;
}
</style>