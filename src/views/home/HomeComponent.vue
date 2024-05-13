<template>
  <div id="home">
    <nav-bar-component>
      <div slot="left">
        <i class="el-icon-search"></i>
      </div>
      <div slot="center">
        <search-suggest-component ref="searchChild" :is-disabled="false" />
      </div>
      <div slot="right">
        <el-button type="text" @click="searchBtn">搜索</el-button>
      </div>
    </nav-bar-component>
    <div id="map-container">
      <map-component ref="childMap" />
    </div>
  </div>
</template>

<script>
import { sleepMixin } from '@/common/mixin';
import { Error_Msg } from '@/common/string';
import MapComponent from '@/components/home/MapComponent.vue';
import NavBarComponent from '@/components/navbar/NavBarComponent.vue';
import SearchSuggestComponent from '@/components/searchSuggest/SearchSuggestComponent.vue';
import { requestMapSearch } from '@/network/request';
import store from '@/store';

export default {
  name: "HomeComponent",
  mixins: [sleepMixin],
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
      if (this.$refs.searchChild.searchSuggestInput === '') {
        vm.$message({ showClose: true, message: Error_Msg.INPUTISNULL, type: 'error', offset: '60' });
        return;
      }
      if (store.state.HomePosition.longitude === 0) {//用户没选
        const regex = /市/
        let address = vm.$refs.searchChild.searchSuggestInput
        const result = regex.test(address)
        //添加市缩小范围
        if (!result)
          address = store.state.City + address
        requestMapSearch({
          searchAddress: address
        }).then(res => {
          const list = ('' + res.data.geocodes[0].location).split(',')
          vm.$refs.childMap.map.setZoomAndCenter(18, list);
        }).catch(err => {
          console.log('vue: err :>> ', err);
        });
      } else {//用户选了
        vm.$refs.childMap.map.setZoomAndCenter(18, [store.state.HomePosition.longitude, store.state.HomePosition.latitude]);
        store.commit('setHomePosition', null)
      }

    },

  },
}
</script>

<style scoped>
#home {
  width: 100%;
  height: auto;
  position: fixed;
}

#map-container {
  z-index: 1;
  position: fixed;
  width: 100%;
  height: auto;
  padding: 0;
  top: 44px;
  bottom: 0;
}
</style>