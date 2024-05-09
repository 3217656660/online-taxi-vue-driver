<template>
    <div id="home">
      <nav-bar-component>
        <div slot="left">
          <i class="el-icon-search"></i>
        </div>
        <div slot="center">
          <search-suggest-component />
        </div>
        <div slot="right">
          <el-button type="text" @click="searchBtn">搜索</el-button>
        </div>
      </nav-bar-component>
      <div id="map-container">
        <map-component ref="childMap"/>
      </div>
    </div>
</template>

<script>
import { Error_Msg } from '@/common/string';
import MapComponent from '@/components/home/MapComponent.vue';
import NavBarComponent from '@/components/navbar/NavBarComponent.vue';
import SearchSuggestComponent from '@/components/searchSuggest/SearchSuggestComponent.vue';
import store from '@/store';

export default {
    name: "HomeComponent",
    components: {
      NavBarComponent,
      MapComponent,
      SearchSuggestComponent,
      
    },
    data() {
      return {
        
      }
    },
    methods: {
      /**
       * 监控搜索按钮，并设置中心点
       */
      searchBtn() {
        const vm = this
        if (store.state.HomePosition.length === 0) {
        vm.$message({showClose: true, message: Error_Msg.INPUTISNULL, type: 'error', offset: '60'})
        return;
        }
        //定位到指定地点
        this.$refs.childMap.map.setZoomAndCenter(18, store.state.HomePosition)
      },

    },
    
  }
</script>

<style scoped>
  #home{
    width: 100%;
    height: auto;
    position: fixed;
  }
  
  #map-container{
    z-index: 1;
    position: fixed;
    width: 100%;
    height: auto;
    padding: 0;
    top: 44px;
    bottom: 0;
  }
</style>