<template>
  <div id="messageLine">
    <div class="left"><slot name="left"></slot></div>
    <div class="left-center"><slot name="left-center"></slot></div>
    <div class="right-center"><slot name="right-center"></slot></div>
    <div class="right"><slot name="right"></slot></div>
  </div>
</template>

<script>
export default {
  name:"MessageItemComponent",

}
</script>

<style scoped>
@import url('@/assets/css/message.css');
</style>