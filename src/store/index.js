import Vue from "vue";
import Vuex from "vuex";
import actions from "./actions";
import getters from "./getters";
import modules from "./modules";
import mutations from "./mutations";
//安装插件
Vue.use(Vuex);

//获取本地存储的用户信息，并初始化到vuex中，注意：在修改的时候要将本地永久存储的一并需改
let localDriver = JSON.parse( localStorage.getItem('Driver') )
if ( localDriver === null ) {
  localDriver = {
    id: 0,
    username: '',
    mobile: '',
    password: '',
    email: '',
    carType: '',
    carNumber: '',
    createTime: '',
  };
}

const state = {
  XToken: localStorage.getItem('X-Token'),
  Driver: {
    id: localDriver.id,
    username: localDriver.username,
    mobile: localDriver.mobile,
    password: localDriver.password,
    email: localDriver.email,
    carType: localDriver.carType,
    carNumber: localDriver.carNumber,
    createTime: localDriver.createTime,
  },
  UserCreateOrderVo: {
    userId: 0,
    startAddress: '',
    startAddressLongitude: 0,
    startAddressLatitude: 0,
    endAddress: '',
    distance: 0,
  },
  DriverActionTakeOrderVo: {
    id: 0,
    userId: 0,
    driverId: 0,
    nowAddressLongitude: 0,
    nowAddressLatitude: 0
  },
  Order: {
    id: 0,
    userId: 0,
    driverId: 0,
    startAddress: '',
    startLatitude: 0,
    startLongitude: 0,
    endAddress: '',
    endLatitude: 0,
    endLongitude: 0,
    status: 0,
    price: 0,
    distance: 0,
    createTime: '',
    endTime: '',
  },
  City: '',
  StartCity:'',
  EndCity: '',
  HomePosition: {
    longitude: 0,
    latitude: 0,
    address: '',
  },

  StartPosition: {
    longitude: 0,
    latitude: 0,
    address: '',
  },

  EndPosition: {
    longitude: 0,
    latitude: 0,
    address: '',
  },

  AcceptPosition: [],
  IsLogin: localStorage.getItem('IsLogin'),
  CurrentLocation: {
    longitude: 1,
    latitude: 1,
    address: '马鞍山市市人民政府',
  },
};

//2.创建对象
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules
});

//3.导出
export default store;