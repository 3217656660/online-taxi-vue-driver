import store from "@/store";
import axios from "axios";
import { MapIpSearchCityUrl, MapSearchSuggestUrl, MapSearchUrl, MapServerApiKey } from '../common/string';

// 示例
// export function requestGateway(config){
//   //1.创建axios实例
//   const instance = axios.create({
//     baseURL:'http://127.0.0.1/taxi',
//     timeout: 5000
//   })
//   //2.1 axios拦截器
//   //全局拦截axios.interceptors
//   //局部拦截
//   instance.interceptors.request.use(config => {
//     //1.可以检验config信息

//     //2.每次发送请求的时候，显示加载图标

//     //3.某些网络请求必须携带信息，如（token）

//     //一定要发送回去，不然无法请求
//     return config 
//   },error => {
//     console.log('error :>> ', error);
//   //一般请求没有发出去的时候进入
//   })
//   //2.2响应拦截
//   instance.interceptors.response.use(result => {
//     //一定要发送回去，不然无法接受响应
//     return result
//   },error => {
//     console.log('error :>> ', error);
//   //一般响应错误的时候进入
//   })
//   //3.发送真正的网络请求并以Promise返回
//   return instance(config)
// }


/**
 * 单请求gateway网关服务器
 * @param {*} config 请求配置
 * @returns Promise对象
 */
export function requestGateway(config){
    const instance = axios.create({
      //baseURL:GatewayUrl,
      timeout: 5000,
      headers: {
        'X-Token': store.state.XToken,
        'mobile': store.state.User.mobile
      },
    })
    
    instance.interceptors.request.use(config => {
      return config
    },error => {
      return error
    })

    instance.interceptors.response.use(result => {
      return result
    },error => {
      return error
    })
    return instance(config)
}


/**
 * 并发请求
 */
export function requestGatewayConcurrency(config) {
  const axiosInstances = [];
  const requests = Array.isArray(config) ? config : [config];

  requests.forEach((requestConfig) => {
    const instance = axios.create({
      //baseURL: GatewayUrl,
      timeout: 5000,
      headers: {
        'X-Token': store.state.XToken
      },
    });

    instance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      (response) => {
        if (response.headers['x-token'] !== undefined) {
          // 从响应头中获取 X-Token 的值
          const token = response.headers['x-token'];
          // 更新 Vuex 中的 XToken 变量
          store.commit('setXToken', token);
        }
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axiosInstances.push(instance(requestConfig));
  });

  return Promise.all(axiosInstances);
}


/**
 * 高德地图api 实现ip => 城市
 * @returns Promise对象 其中then中的参数为所转换到的城市
 */
export function requestMapIpToCity(){
  const url = MapIpSearchCityUrl + '?key=' + MapServerApiKey;
  const instance = axios.create({
    baseURL:url,
    timeout: 5000
  })
  instance.interceptors.response.use(result => {
    return result.data.city
  })
  return instance()
}


/**
 * 高德地图api，实现 地名 => 地理经纬度转换
 * @param {*} config 请求配置
 * @returns Promise对象
 */
export function requestMapSearch(config){
  const url = MapSearchUrl + '?key=' + MapServerApiKey + '&address=' + config.searchAddress;
  const instance = axios.create({
    baseURL:url,
    timeout: 5000
  })
  instance.interceptors.request.use(config => {
    return config 
  },error => {
    return error
  })
  instance.interceptors.response.use(result => {
    return result
  },error => {
    return error
  })
  return instance(config)
}


/**
 * 高德地图api，实现 关键词查询
 * @param {*} config 用户输入的关键字和需要携带的城市
 * @returns Promise对象 其中then中的参数为匹配到的信息列表
 */
export function requestMapSearchSuggest(config){
  //先获取所在城市
  const url = MapSearchSuggestUrl + '?key=' + MapServerApiKey +
  '&keywords=' + config.searchKeywords + 
  '&city=' + config.city + '&citylimit=true';
  const instance = axios.create({
    baseURL:url,
    timeout: 5000
  })
  instance.interceptors.response.use(result => {
    console.log('result.data :>> ', result.data);
    return result.data.tips;
  })
  return instance()
}


