<template>
  <div id="register">
    <back-nav-bar-component :default-nav-color="defaultNavColor" :back-nav-color="backNavColor"/>
    <div id="register-form-container">
      <register-form-component/>
    </div>
  </div>
</template>

<script>
import BackNavBarComponent from '../navbar/BackNavBarComponent.vue';
import RegisterFormComponent from './RegisterFormComponent.vue';
export default {
  name: "RegisterComponent",
  components: {
    BackNavBarComponent,
    RegisterFormComponent
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
#register-form-container {
  position: fixed;
  margin-top: 20px;
  width: 100%;
  height: 600px;
}
</style>