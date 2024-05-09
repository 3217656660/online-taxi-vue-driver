<!-- 导航栏 -->
<template>
  <div class="nav-bar">
    <div class="left"><slot name="left"></slot></div>
    <div class="center"><slot  name="center"></slot></div>
    <div class="right"><slot  name="right"></slot></div>
  </div>
</template>

<script >
export default {
  name: "NavBarComponent"
}
</script>

<style  scoped>
  .nav-bar {
    display: flex;
    /* 导航栏大部分44px */
    line-height: 44px;
    height: 44px;
    text-align: center;
    box-shadow: 0 1px 1px rgba(100,100,100,.1);
    width: 100%;
  }

  .left, .right {
    width: 20%;
  }

  .left i {
    font-size: 25px;
    margin-top: 3px;
    margin-bottom: 2px;
    vertical-align: middle;
  }

  .center {
    flex: 1;
    width: 60%;
  }
</style>