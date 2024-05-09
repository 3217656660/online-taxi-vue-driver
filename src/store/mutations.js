export default {
  //同步修改方法

  /**
   * 修改token
   * @param {*} state 仓库
   * @param {*} token 新的token
   */
  setXToken(state, token) {
    state.XToken = token;
    localStorage.setItem('X-Token', token);
  },


  /**
   * 更新后端传来的不为空的用户信息
   * @param {*} state 仓库
   * @param {*} user 后端传来的不为空的用户信息
   */
  setUser(state, user) {
    const keys = Object.keys(state.User)
    for (const key of keys) {
      if (user[key] !== '' && user[key] !== -1 && user[key] !== undefined)
        state.User[key] = user[key];
    }
    //将更新的用户信息保存到本地永久仓库
    localStorage.setItem('User', JSON.stringify(state.User));
  },


  /**
   * 更新传来的不为空的司机信息
   * @param {*} state 仓库
   * @param {*} driver 传来的不为空的用户信息
   */
  setDriver(state, driver) {
    const keys = Object.keys(state.Driver)
    for (const key of keys) {
      if (driver[key] !== '' && driver[key] !== -1 && driver[key] !== undefined)
        state.Driver[key] = driver[key];
    }
  },


  /**
   * 更新用户的登录状态 yes表示已登录,no表示未登录
   * @param {*} state 仓库
   * @param {*} isLogin 传来的值, 表示是否登录
   */
  setIsLogin(state, isLogin) {
    state.IsLogin = isLogin;
    localStorage.setItem('IsLogin', isLogin);
  },


  /**
   * 修改city
   * @param {*} state 仓库
   * @param {*} city 新的city
   */
  setCity(state, city) {
    state.City = city;
  },


  /**
   * 修改起点city
   * @param {*} state 仓库
   * @param {*} city 新的city
   */
  setStartCity(state, city) {
    state.StartCity = city;
  },


  /**
  * 修改终点city
  * @param {*} state 仓库
  * @param {*} city 新的city
  */
  setEndCity(state, city) {
    state.EndCity = city;
  },


  /**
   * 修改位置信息
   * @param {*} state 
   * @param {*} position 
   */
  setHomePosition(state, position) {
    state.HomePosition = position
  },


  /**
   * 修改开始位置
   * @param {*} state 
   * @param {*} position 
   */
  setStartPosition(state, position) {
    state.StartPosition = position
  },


  /**
   * 修改结束位置
   * @param {*} state 
   * @param {*} position 
   */
  setEndPosition(state, position) {
    state.EndPosition = position
  },


  /**
   * 修改司机位置
   * @param {*} state 
   * @param {*} position 
   */
  setAcceptPosition(state, position) {
    state.AcceptPosition = position
  },


  /**
   * 修改用户提交信息
   * @param {*} state 
   * @param {*} userCreateOrderVo 
   */
  setUserCreateOrderVo(state, userCreateOrderVo) {
    const keys = Object.keys(state.UserCreateOrderVo)
    for (const key of keys) {
      if (userCreateOrderVo[key] !== '' && userCreateOrderVo[key] !== -1 && userCreateOrderVo[key] !== undefined)
        state.UserCreateOrderVo[key] = userCreateOrderVo[key];
    }
  },


  /**
   * 修改司机提交信息
   * @param {*} state 
   * @param {*} driverActionTakeOrderVo 
   */
  setDriverActionTakeOrderVo(state, driverActionTakeOrderVo) {
    const keys = Object.keys(state.DriverActionTakeOrderVo)
    for (const key of keys) {
      if (driverActionTakeOrderVo[key] !== '' && driverActionTakeOrderVo[key] !== -1 && driverActionTakeOrderVo[key] !== undefined)
        state.DriverActionTakeOrderVo[key] = driverActionTakeOrderVo[key];
    }
  },


  /**
   * 更新订单信息
   * @param {*} state 
   * @param {*} order 
   */
  setOrder(state, order) {
    const keys = Object.keys(state.Order)
    for (const key of keys) {
      if (order[key] !== '' && order[key] !== -1 && order[key] !== undefined)
        state.Order[key] = order[key];
    }
  },




}