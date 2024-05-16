<template>
  <div id="login">
    <div id="login-form-container">
      <login-form-component/>
    </div>
  </div>
</template>

<script>
import LoginFormComponent from './LoginFormComponent.vue';
export default {
  name: "LoginComponent",
  components: {
    LoginFormComponent
  },
  data(){
    return{
      
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