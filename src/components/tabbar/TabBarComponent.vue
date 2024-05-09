<template>
  <div>
    <div class="tab-bar">
        <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
  name: "TarBarComponent"
}
</script>

<style scoped>
  .tab-bar {
    display: flex;
    background-color: #f6f6f6;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: 0 -3px 1px rgba(100,100,100,.1);
    z-index: 999;
  }
</style>
