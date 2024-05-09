//统一管理字符串
//key
export const MapServerApiKey = "a1c90f5c7a1d0d6c74589955e4303b0c";

//安全密钥
export const MapSecurityKey = "b96e81c0ef8264f5345a7da790828a5a";

//网关服务器地址
export const GatewayUrl = "http://localhost/taxi";

//高德api 地址 => 经纬度
export const MapSearchUrl = "https://restapi.amap.com/v3/geocode/geo";

//高德api 模糊keywords => 模糊搜索结果
export const MapSearchSuggestUrl = "https://restapi.amap.com/v3/assistant/inputtips";

//高德api ip => 所在城市
export const MapIpSearchCityUrl = "https://restapi.amap.com/v3/ip";

//token名(只是声明)
export const TokenName = "X-Token";

//处理错误信息合集
export const Error_Msg = {
  PLEASE_LOGIN : "请先登录",
  CONFIRMPASSWORD_REGEX_ERROR : "两次密码输入不一致",
  USERNAME_REGEX_ERROR : "请输入正确格式的用户名,规则:6-10位数字、大小写字母",
  PASSWORD_REGEX_ERROR: "请输入正确格式的密码,规则:6-10位数字、大小写字母",
  PHONE_REGEX_ERROR: "请输入正确格式的手机号,规则:11位数字",
  INPUTISNULL : "输入不能为空",
  ACCOUNT_ERROR : "账号不存在",
  PASSWORD_ERROR : "密码不正确",
  MOBILE_EXIST : "您当前手机号已经注册过了",
  DELETE_ERROR : "注销失败",
  DELETE_SUCCESS : "注销成功",
  REGISTER_ERROR : "注册失败",
  REGISTER_SUCCESS : "注册成功",
  FIND_ERROR : "查找失败",
  UPDATE_SUCCESS : "信息更新成功",
  UPDATE_ERROR : "信息更新失败",
  REVIEW_SUCCESS : "评价成功",
  REVIEW_ERROR : "评价失败",
  PAYMENT_SUCCESS : "支付成功",
  PAYMENT_ERROR : "支付失败",
  ORDER_CREATE_SUCCESS : "订单创建成功",
  ORDER_CREATE_ERROR : "订单创建失败",
  ORDER_CANCEL_ERROR : "订单取消失败",
  ORDER_CANCEL_SUCCESS : "订单取消成功",
  ORDER_NOT_EXIST : "订单不存在",
  ORDER_NOT_TAKEN : "订单还未被接单",
  ORDER_TAKE_ERROR : "接单失败",
  NO_ACCEPTABLE_ORDER : "没有可接的订单",
  ORDER_TAKE_SUCCESS : "接单成功",
  ORDER_NOT_SOLVED : "请先处理未处理的订单",
  MODIFY_ADDRESS_SUCCESS : "位置更新成功",
  GET_ADDRESS_ERROR : "位置获取失败",
  REQUEST_PAYMENT_SUCCESS : "发起收款成功",
  SERVE_ERROR : "服务器出问题了"
};
/**
 * 设置Error_Msg内容为只读
 */
Object.defineProperty(Error_Msg, 'PLEASE_LOGIN', {
  value: Error_Msg.PLEASE_LOGIN,
  writable: false,
});
Object.defineProperty(Error_Msg, 'CONFIRMPASSWORD_REGEX_ERROR', {
  value: Error_Msg.CONFIRMPASSWORD_REGEX_ERROR,
  writable: false,
});
Object.defineProperty(Error_Msg, 'USERNAME_REGEX_ERROR', {
  value: Error_Msg.USERNAME_REGEX_ERROR,
  writable: false,
});
Object.defineProperty(Error_Msg, 'PASSWORD_REGEX_ERROR', {
  value: Error_Msg.PASSWORD_REGEX_ERROR,
  writable: false,
});
Object.defineProperty(Error_Msg, 'PHONE_REGEX_ERROR', {
  value: Error_Msg.PHONE_REGEX_ERROR,
  writable: false,
});
Object.defineProperty(Error_Msg, 'INPUTISNULL', {
  value: Error_Msg.INPUTISNULL,
  writable: false,
});
Object.defineProperty(Error_Msg, 'ACCOUNT_ERROR', {
  value: Error_Msg.ACCOUNT_ERROR,
  writable: false,
});
Object.defineProperty(Error_Msg, 'PASSWORD_ERROR', {
  value: Error_Msg.PASSWORD_ERROR,
  writable: false,
});
Object.defineProperty(Error_Msg, 'MOBILE_EXIST', {
  value: Error_Msg.MOBILE_EXIST,
  writable: false,
});
Object.defineProperty(Error_Msg, 'DELETE_ERROR', {
  value: Error_Msg.DELETE_ERROR,
  writable: false,
});
Object.defineProperty(Error_Msg, 'DELETE_SUCCESS', {
  value: Error_Msg.DELETE_SUCCESS,
  writable: false,
});
Object.defineProperty(Error_Msg, 'REGISTER_ERROR', {
  value: Error_Msg.REGISTER_ERROR,
  writable: false,
});
Object.defineProperty(Error_Msg, 'REGISTER_SUCCESS', {
  value: Error_Msg.REGISTER_SUCCESS,
  writable: false,
});
Object.defineProperty(Error_Msg, 'FIND_ERROR', {
  value: Error_Msg.FIND_ERROR,
  writable: false,
});
Object.defineProperty(Error_Msg, 'UPDATE_SUCCESS', {
  value: Error_Msg.UPDATE_SUCCESS,
  writable: false,
});
Object.defineProperty(Error_Msg, 'UPDATE_ERROR', {
  value: Error_Msg.UPDATE_ERROR,
  writable: false,
});
Object.defineProperty(Error_Msg, 'REVIEW_SUCCESS', {
  value: Error_Msg.REVIEW_SUCCESS,
  writable: false,
});
Object.defineProperty(Error_Msg, 'REVIEW_ERROR', {
  value: Error_Msg.REVIEW_ERROR,
  writable: false,
});
Object.defineProperty(Error_Msg, 'PAYMENT_SUCCESS', {
  value: Error_Msg.PAYMENT_SUCCESS,
  writable: false,
});
Object.defineProperty(Error_Msg, 'PAYMENT_ERROR', {
  value: Error_Msg.PAYMENT_ERROR,
  writable: false,
});
Object.defineProperty(Error_Msg, 'ORDER_CREATE_SUCCESS', {
  value: Error_Msg.ORDER_CREATE_SUCCESS,
  writable: false,
});
Object.defineProperty(Error_Msg, 'ORDER_CREATE_ERROR', {
  value: Error_Msg.ORDER_CREATE_ERROR,
  writable: false,
});
Object.defineProperty(Error_Msg, 'ORDER_CANCEL_SUCCESS', {
  value: Error_Msg.ORDER_CANCEL_SUCCESS,
  writable: false,
});
Object.defineProperty(Error_Msg, 'ORDER_CANCEL_ERROR', {
  value: Error_Msg.ORDER_CANCEL_ERROR,
  writable: false,
});
Object.defineProperty(Error_Msg, 'ORDER_NOT_EXIST', {
  value: Error_Msg.ORDER_NOT_EXIST,
  writable: false,
});
Object.defineProperty(Error_Msg, 'ORDER_NOT_TAKEN', {
  value: Error_Msg.ORDER_NOT_TAKEN,
  writable: false,
});
Object.defineProperty(Error_Msg, 'ORDER_TAKE_ERROR', {
  value: Error_Msg.ORDER_TAKE_ERROR,
  writable: false,
});
Object.defineProperty(Error_Msg, 'NO_ACCEPTABLE_ORDER', {
  value: Error_Msg.NO_ACCEPTABLE_ORDER,
  writable: false,
});
Object.defineProperty(Error_Msg, 'ORDER_TAKE_SUCCESS', {
  value: Error_Msg.ORDER_TAKE_SUCCESS,
  writable: false,
});
Object.defineProperty(Error_Msg, 'ORDER_NOT_SOLVED', {
  value: Error_Msg.ORDER_NOT_SOLVED,
  writable: false,
});
Object.defineProperty(Error_Msg, 'MODIFY_ADDRESS_SUCCESS', {
  value: Error_Msg.MODIFY_ADDRESS_SUCCESS,
  writable: false,
});
Object.defineProperty(Error_Msg, 'GET_ADDRESS_ERROR', {
  value: Error_Msg.GET_ADDRESS_ERROR,
  writable: false,
});
Object.defineProperty(Error_Msg, 'REQUEST_PAYMENT_SUCCESS', {
  value: Error_Msg.REQUEST_PAYMENT_SUCCESS,
  writable: false,
});
Object.defineProperty(Error_Msg, 'SERVE_ERROR', {
  value: Error_Msg.SERVE_ERROR,
  writable: false,
});

