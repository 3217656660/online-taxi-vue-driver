<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="isActive"><slot name="item-icon-active"></slot></div>
    <div v-else><slot name="item-icon"></slot></div>
    <div :class="{active: !isActive}"><slot name="item-text"></slot></div>
  </div>
</template>

<script>
export default {
  name: "TabBarItemComponent",
  props: {
    path: String
  },
  data() {
    return {
      
    }
  },
  computed: {
    isActive() {
      //判断当前活跃的路由路径中是否包括传入的路由路径。indexOf() 不等于-1的时候就找到了.
      return this.$route.path.indexOf(this.path) !== -1
    }
  },
  methods: {
    itemClick() {
      //一个地方点两次会报错，解决办法：
      this.$router.replace(this.path).catch(err => err)
    }
  }
}
</script>

<style scoped>
  .tab-bar-item {
    flex: 1;
    text-align: center;
    /* 一般情况下移动端tar-bar高度为49px */
    height: 49px; 
    font-size: 14px;
  }

  .tab-bar-item i {
    font-size: 25px;
    margin-top: 3px;
    margin-bottom: 2px;
    vertical-align: middle;
  }

  .active {
    color: darkgray;
  }
</style>