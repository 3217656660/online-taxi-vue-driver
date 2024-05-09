<template>
  <div id="accept">
    <nav-bar-component>
      <div slot="left">
        <h3>接单</h3>
      </div>
      <div slot="right">
        <el-dropdown @command="handleCommand" trigger="click">
          <el-button type="text">
            <i class="el-icon-more-outline"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="acceptDriverMessage">查看司机信息</el-dropdown-item>
            <el-dropdown-item command="acceptOrdering">查看正在进行的订单</el-dropdown-item>
            <el-dropdown-item command="acceptList">查看可接订单</el-dropdown-item>
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

  export default {
    name: "AcceptComponent",
    mixins:[checkIsLogin],
    components: {
    NavBarComponent,
    },
    data(){
      return {
        path: 'acceptDriverMessage'
      }
    },
    created(){
      //创建后检查登录状态,没有登录就让用户去登录界面进行登录
      this.checkLogin(this)
      //检查是否进行了司机认证
      this.checkIsDriver()
    },
    methods: {

      checkIsDriver(){
        //检查是否是司机
        return;
      },

      
      /**
       * 选择页面
       * @param {*} command 选择的路由
       */
      handleCommand(command) {
        if (command === this.path)  return;
        this.path = command;
        this.$router.push('/' + command);
      },

      

    }
    
  }
</script>

<style scoped>
#accept{
  padding:0px;
  top: 0;
  width: 100%;
  height: auto;
}

.el-icon-more-outline {
  font-size: 20px;
}

</style>