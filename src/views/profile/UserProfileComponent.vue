<template>
  <div id="userProfile">
    <h2 class="title">个人信息</h2>
    <div class="select-container">
      <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1" class="el-menu-item">全部订单</el-menu-item>
        <el-menu-item index="2" class="el-menu-item">正在进行</el-menu-item>
        <el-menu-item index="3" class="el-menu-item">个人信息</el-menu-item>
      </el-menu>
    </div>
    <div id="display">
      <routerView></routerView>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserProfileComponent",
  data() {
    return {
      activeIndex: '1',
    }
  },
  methods: {

    handleSelect(key) {
      if (key === this.activeIndex) return;
      if (key === '1') {
        this.$router.replace('/profile/userProfile/allOrder');
      } else if (key === '2') {
        this.$router.replace('/profile/userProfile/taking');
      } else if (key === '3') {
        this.$router.replace('/profile/userProfile/setting');
      }
      this.activeIndex = key;
    },


    /**
     * 处理路由问题
     */
    init() {
      if (this.$route.path.indexOf('allOrder') !== -1) {
        return
      }
      this.$router.replace('/profile');
      this.activeIndex = '1'
    },
  },
  mounted(){
    this.init();
  },
}
</script>

<style scoped>
@import url('@/assets/css/profile.css');
</style>