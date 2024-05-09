<template>
  <div id="profile">
    <nav-bar-component>
      <div slot="left"><h3>个人</h3></div>
    </nav-bar-component>
    
    <routerView></routerView>
  </div>
</template>

<script>
import { checkIsLogin } from '@/common/mixin';
import NavBarComponent from '@/components/navbar/NavBarComponent.vue';

  export default {
    name: "ProfileComponent",
    mixins:[checkIsLogin],
    created(){
      //创建后检查登录状态,没有登录就让用户去登录界面进行登录
      //this.checkLogin(this)
    },
    components: {
      NavBarComponent
    },
    data(){
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
        if (command === this.path)  return;
        this.path = command;
        this.$router.push('/' + command);
      },
      
    }

  }
</script>

<style scoped>

</style>