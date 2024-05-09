
/**
 * 正则表达式
 */
export const regex = {
  /**
   * 1.手机号匹配
   */
  phoneRegex : /^\d{11}$/,

  /**
   * 2.密码匹配
   */
  passwordRegex : /^[a-zA-Z0-9]{6,10}$/,

  /**
   * 3.用户名匹配
   */
  userNameRegex : /^[a-zA-Z0-9]{6,10}$/,

  /**
   * 4.司机姓名匹配
   */
  driverNameRegex : /^[\u4e00-\u9fa5]{1,10}$/,

  /**
   * 5.司机车辆类型匹配
   */
  driverCarTypeRegex : /^[\u4e00-\u9fa5]{3,10}$/,

  /**
   * 6.司机车牌号匹配
   */
  driverCarNumberRegex : /^[\u4e00-\u9fa5][A-Z]{1}\d{3}[A-Z]{2}$/,

  /**
   * 7.qq邮箱匹配
   */
  emailRegex : /^\d{5,12}@qq\.com$/,

  /**
   * 8.验证码匹配
   */
  codeRegex: /^\d{6}$/,

};


/**
 * 设置为只读
 */
Object.defineProperty(regex, 'userNameRegex', {
  value: regex.userNameRegex,
  writable: false,
});
Object.defineProperty(regex, 'phoneRegex', {
  value: regex.phoneRegex,
  writable: false,
});
Object.defineProperty(regex, 'passwordRegex', {
  value: regex.passwordRegex,
  writable: false,
});