<template>
  <div id="accept">
    <nav-bar-component>
      <div slot="left">
        <h3>接单</h3>
      </div>
    </nav-bar-component>

    <div class="map-content">
      <map-component ref="childMap" />
    </div>

    <div class="location-content">
      <el-input class="input" v-model="input" placeholder="请输入内容"></el-input>
      <el-button class="location-btn" @click="location">定位</el-button>
      <el-button class="accept-btn" @click="toAccept">接单</el-button>
    </div>
  </div>
</template>

<script>
import { checkIsLogin, makeElButtonBlurMixin } from '@/common/mixin';
import MapComponent from '@/components/home/MapComponent.vue';
import NavBarComponent from '@/components/navbar/NavBarComponent.vue';
import { requestMapSearch } from '@/network/request';
import store from '@/store';

export default {
  name: "AcceptComponent",
  mixins: [checkIsLogin, makeElButtonBlurMixin],
  components: {
    NavBarComponent,
    MapComponent
  },
  data() {
    return {
      input: '安徽工业大学东校区',
      driving: null, //AMap.Driving实例
      marker: null,
    }
  },
  mounted() {
    this.$message({ showClose: true, message: "如定位不准请手动输入当前位置点击定位", type: 'info', offset: '60', duration: 0 })
  },
  methods: {
    //自动定位
    autoLocation() {

    },

    //手动定位
    location(event) {
      const vm = this
      vm.removePoint()
      if (vm.input === null) {
        vm.$message({ showClose: false, message: "输入地点不能为空", type: 'error', offset: '60', duration: 0 })
        return;
      }     
      vm.makeElButtonBlur(event)
      requestMapSearch({
        searchAddress: vm.input
      }).then(res => {
        const list = ('' + res.data.geocodes[0].location).split(',')
        store.commit('setAcceptPosition', list)
        vm.$refs.childMap.map.setZoomAndCenter(16, list)
        //将点展示出来
        vm.addPoint(list);
      }).catch(err => {
        console.log('err :>> ', err);
        vm.$message({ showClose: true, message: "起点地址查询失败，请稍后重试", type: 'error', offset: '60' });
      });
    },

    //添加点标记
    addPoint(location) {
      const vm = this
      const map = vm.$refs.childMap.map
      const aMap = vm.$refs.childMap.aMap
      const marker = new aMap.Marker({
        icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        position: location,
        offset: new aMap.Pixel(-13, -30)
      });
      marker.setMap(map);
      vm.marker = marker;
      this.$message({ showClose: false, message: "地址查询成功", type: 'success', offset: '60' });
    },

    //删除点标记
    removePoint() {
      const vm = this
      if (vm.marker != null) {
        vm.marker.setMap(null);
        vm.marker = null;
      }
    },

    //去接单
    toAccept(event) {
      this.makeElButtonBlur(event)

    }

  }

}
</script>

<style scoped>
#accept {
  position: fixed;
  padding: 0px;
  top: 0;
  width: 100%;
}

.map-content {
  position: fixed;
  width: 100%;
  height: auto;
  padding: 0;
  top: 44px;
  bottom: 90px;
}

.location-content {
  width: 100%;
  position: fixed;
  bottom: 50px;
}

.input {
  width: 60%;
}

.location-btn {
  position: fixed;
  right: 20%;
  width: 20%;
}

.accept-btn {
  position: fixed;
  right: 0;
  width: 20%;
}
</style>