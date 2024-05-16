<template>
  <div id="container">
    
  </div>
</template>

<script type="text/javascript">
window._AMapSecurityConfig = {
  securityJsCode: "b96e81c0ef8264f5345a7da790828a5a"
};

import { geoLocationWithSDK } from '@/common/mixin';
import AMapLoader from '@amap/amap-jsapi-loader'; //导入默认的不加外面括号
export default {
  name: "MapComponent",
  mixins: [geoLocationWithSDK],
  data() {
    return {
      map: null ,//初始化地图对象
      aMap: null,
      marker: null,
    }
  },
  mounted() {
    this.initAMap();
  },
  unmounted() {
    this.map?.destroy();
  },
  methods: {
    /**
     * 初始化地图
     */
    initAMap() {
      AMapLoader.load({ 
        key: "64920b361d05ba95dd58da13746fc6ac", //开发者Key:首次调用load必须写
        version: "2.0", 
        plugins: [
          "AMap.ToolBar","AMap.Geolocation","AMap.Driving","AMap.MoveAnimation"
        ], // 需要使用的的插件列表

      })
        .then((AMap) => {
          this.aMap = AMap;
          this.$emit('child-loaded');
          this.map = new AMap.Map("container", {
            viewMode: "2D", 
            zoom: 14,
            resizeEnable: true,
          });
          
          //定位 test
          //this.geoLocation(this.map, this);
          
          //放大缩小,位置左上
          this.map.addControl(new AMap.ToolBar({position: 'RT'}));
          
          //通知父组件地图加载完毕
          this.$emit('map-init-success');
        })
        .catch((e) => {
          console.log('err' + e);
        });
    },

  },
  watch: {
  }

}
</script>

<style scoped>
  #container{
    position: relative;
    padding:0px;
    margin: 0px;
    width: 100%;
    height: 100%;
  }
</style>