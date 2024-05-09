<template>
  <div id="login">
    <back-nav-bar-component :default-nav-color="defaultNavColor" :back-nav-color="backNavColor"/>
    <div id="login-form-container">
      <login-form-component/>
    </div>
  </div>
</template>

<script>
import BackNavBarComponent from '../navbar/BackNavBarComponent.vue';
import LoginFormComponent from './LoginFormComponent.vue';
export default {
  name: "LoginComponent",
  components: {
    BackNavBarComponent,
    LoginFormComponent
  },
  data(){
    return{
      defaultNavColor: 'black',
      backNavColor: 'darkgray'
    }
  }
}
</script>

<style scoped>
#login-form-container {
  position: fixed;
  margin-top: 20px;
  width: 100%;
  height: 600px;
}
</style>