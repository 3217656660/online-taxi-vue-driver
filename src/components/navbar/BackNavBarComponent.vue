<template>
  <div>
    <nav-bar-component>
      <div slot="left">
          <el-button class="back-btn" @click="changeColorAndBack">
            <i class="el-icon-back" :style="navColor"></i>
          </el-button>
        </div>
    </nav-bar-component>
  </div>
</template>

<script>
import NavBarComponent from './NavBarComponent.vue';
export default {
  name: "BackNavBarComponent",
  props: ['defaultNavColor','backNavColor'],
  components: {
    NavBarComponent
  },
  data() {
    return {
      //返回按钮颜色，默认defaultNavColor，返回backNavColor,从父组件传入
      navColor: {
      color: this.defaultNavColor
      } 
    }
  },
  methods: {
    /**
     * 改变颜色并返回
     */
     changeColorAndBack(){
      this.navColor.color = this.navColor.color === 'black' ? this.backNavColor : 'black';
      this.$router.back()
    }
    
  }

}

</script>

<style scoped>
.el-icon-back{
  font-size: 25px;
}

.back-btn{
  /* 让按钮透明 */
  background-color: transparent;
  border-color: transparent;
}
</style>