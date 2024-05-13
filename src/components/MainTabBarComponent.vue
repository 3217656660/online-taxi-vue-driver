<template>
  <div>
    <tab-bar-component>
      <tab-bar-item-component path="/accept">
        <i class="el-icon-s-order" slot="item-icon" style="color: darkgray;"></i>
        <i class="el-icon-s-order" slot="item-icon-active"></i>
        <div slot="item-text">接单</div>
      </tab-bar-item-component>
      <tab-bar-item-component path="/message">
        <i class="el-icon-s-comment" slot="item-icon" style="color: darkgray;"></i>
        <i class="el-icon-s-comment" slot="item-icon-active"></i>
        <div slot="item-text">消息</div>
      </tab-bar-item-component>
      <tab-bar-item-component path="/profile">
        <i class="el-icon-user-solid" slot="item-icon" style="color: darkgray;"></i>
        <i class="el-icon-user-solid" slot="item-icon-active"></i>
        <div slot="item-text">我的</div>
      </tab-bar-item-component>
    </tab-bar-component>
  </div>
</template>

<script >
import TabBarComponent from './tabbar/TabBarComponent.vue';
import TabBarItemComponent from './tabbar/TabBarItemComponent.vue';
export default {
  name: "MainTabBarComponent",
  components: {
    TabBarComponent,
    TabBarItemComponent
  }
}
</script>

<style scoped>

</style>