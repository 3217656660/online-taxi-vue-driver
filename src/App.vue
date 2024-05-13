<template>
  <div id="app">
    <router-view></router-view>
    <main-tab-bar-component/>
  </div>
</template>

<script>
import MainTabBarComponent from './components/MainTabBarComponent';

export default {
  name: 'App',
  components: {
    MainTabBarComponent
  }

}
</script>

<style>
  /* 引用样式 */
  @import url("@/assets/css/base.css");
</style>
