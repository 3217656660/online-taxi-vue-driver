import { Error_Msg } from '@/common/string';
import { requestGateway } from '@/network/request';
import store from '@/store';
import GeoLocationPlugin from './GeoLocationPlugin';

export const submitFormMixin = {
  methods: {
    /**
     * 注册登录通用提交函数
     * @param {*} context 当前上下文（vue实例）
     * @param {*} config 提交配置
     */
    submitForm(context , config) {
      const vm = context
      //数据格式校验
      vm.$refs.user.validate( (valid) => {
        if (!valid){
          vm.$message({showClose: true,message: "失败",type: 'error',offset: '60'})
          return;
        }
        requestGateway(config)
        .then(res => {
          if (res.data.status === 200) {//将用户信息传入vuex中修改
            if(vm.$route.path === '/login'){
              store.commit('setUser', {mobile: vm.user.mobile, password: vm.user.password})
              store.commit('setIsLogin', "yes")
              store.commit('setXToken', res.data.data)
            }
            //退回
            vm.$router.back()
            vm.$message({showClose: true,message: "成功",type: 'success',offset: '60'})
            return;
          } 
          vm.$message({showClose: true,message: res.data.message,type: 'info',offset: '60'})
        })
      .catch(err => {vm.$message({showClose: true, message: err, type: 'error', offset: '60'})})
      });
    },


  }

}

export const checkIsLogin = {
  methods: {
    /**
     * 判断用户登录状态通用函数
     * @param {*} context 上下文（vue实例）
     * @returns 
     */
    checkLogin(context){
      const vm = context;
      const userId = store.state.User.id;
      if( userId <= 0 || store.state.XToken === '' ) {
        vm.$router.push('/login')
        vm.$message({showClose: true, message: Error_Msg.PLEASE_LOGIN, type: 'error', offset: '60'})
        return;
      }
      //去后端校验登录状态
      requestGateway({
        url: '/api/main/checkLogin',
        method: 'get'
      }).then(res => {
        if (res.response !== undefined && res.response.status === 401){
          vm.$router.push('/login')
          vm.$message({showClose: true, message: Error_Msg.PLEASE_LOGIN, type: 'error', offset: '60'})
          return;
        }else if(res.response !== undefined && res.response.status !== 200){
          vm.$router.push('/')
          vm.$message({showClose: true, message: Error_Msg.SERVE_ERROR, type: 'error', offset: '60'})
        }

      }).catch(err => {
        vm.$message({showClose: true, message: err, type: 'error', offset: '60'})
      })
    },
    
  }
}

export const makeElButtonBlurMixin = {
  methods:{
    /**
     * 让el-button按完后自动失焦
     * @param {*} event 传入按钮点击事件
     */
    makeElButtonBlur(event){
      let target = event.target
      if (target.nodeName == 'SPAN') {
          target = event.target.parentNode
      }
      target.blur()
    }
  }
}

export const formatDateMixin= {
  methods:{
    formatDate(timestamp){
      if(timestamp === null)
        return null
      let date = new Date(timestamp);
      let year = date.getFullYear();
      let month = (date.getMonth() + 1).toString().padStart(2, '0');
      let day = date.getDate().toString().padStart(2, '0');
      let hours = date.getHours().toString().padStart(2, '0');
      let minutes = date.getMinutes().toString().padStart(2, '0');
      let seconds = date.getSeconds().toString().padStart(2, '0');
      let formattedDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
      return formattedDate
    }
  }
}

export const geoLocationWithSDK = {
  methods: {
    async geoLocation(map, vm) {
      try {
        const result = await GeoLocationPlugin.getLocation();
        map.setZoomAndCenter(18, [result.longitude, result.latitude]);
        store.commit('setCurrentLocation', {
          longitude: result.longitude,
          latitude: result.latitude,
          address: result.address,
        });
        store.commit('setCity', result.city);
        store.commit('setStartCity', result.city);
        store.commit('setEndCity', result.city);
        console.log('vue :getCurrentLocation :>> ', JSON.stringify(store.state.CurrentLocation));
        console.log('vue :city :>> ', store.state.City);

        if (vm.marker != null) {
          vm.marker.setMap(null);
          vm.marker = null;
        }
        //添加点标记
        const marker = new vm.aMap.Marker({
          icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
          position: [store.state.CurrentLocation.longitude, store.state.CurrentLocation.latitude],
          offset: new vm.aMap.Pixel(-13, -30)
        });
        marker.setMap(this.map);
        vm.marker = marker;
      } catch (e) {
        console.error('vue: Error getting location:', e);
      }
    }
  }
}

export const sleepMixin = {
  methods: {
    //自定义睡眠函数
    sleep(time) {
      return new Promise(resolve => setTimeout(resolve, time));
    },
  }
}