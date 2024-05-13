//配置路由相关信息
//1.导入Vue和VueRouter
import Vue from "vue";
import VueRouter from "vue-router";

const AcceptComponent = () => import("../views/accept/AcceptComponent")
const ProfileComponent = () => import("../views/profile/ProfileComponent")
const LoginComponent = () => import("../components/login/LoginComponent")
const RegisterComponent = () => import("../components/register/RegisterComponent")
const FindPasswordComponent = () => import("../components/findPassword/FindPasswordComponent")
const AgreementComponent = () => import("../views/agreement/AgreementComponent")
const UserProfileComponent = () => import("../views/profile/UserProfileComponent")
const UserAllOrderComponent = () => import("../views/profile/UserAllOrderComponent")
const UserNoPaymentComponent = () => import("../views/profile/UserNoPaymentComponent")
const UserTakingOrderComponent = () => import("../views/profile/UserTakingOrderComponent")
const MainMessageComponent = () => import("../views/message/MainMessageComponent")
const SettingComponent = () => import("../views/profile/SettingComponent")
const OrderItemComponent = () => import("@/views/profile/OrderItemComponent")
const UpdatePasswordComponent = () => import('@/components/findPassword/UpdatePasswordComponent')


//2.通过Vue.use(插件)，安装插件
Vue.use(VueRouter)

//配置路径和组件之间的路径关系
const routes = [
  {//默认路由，自己重定向到主页
    path: '',
    redirect: '/login'
  },
  {
    path: '/profile',
    component: ProfileComponent,
    redirect: '/profile/userProfile/allOrder',
    children: [
      {
        path: '/profile/userProfile/allOrder',
        component: UserProfileComponent,
        children: [
          {
            path: '/profile/userProfile/allOrder',
            component: UserAllOrderComponent,
          },
          {
            path: '/profile/userProfile/noPayment',
            component: UserNoPaymentComponent,
          },
          {
            path: '/profile/userProfile/taking',
            component: UserTakingOrderComponent,
          },
          {
            path: '/profile/userProfile/setting',
            component: SettingComponent,
          },
        ]
      },
    ]
  },
  {
    path: '/login',
    component: LoginComponent
  },
  {
    path: '/register',
    component: RegisterComponent
  },
  {
    path: '/findPassword',
    component: FindPasswordComponent
  },
  {
    path: '/updatePassword',
    component: UpdatePasswordComponent
  },
  {
    path: '/agreement',
    component: AgreementComponent
  },
  {
    path: '/message',
    component: MainMessageComponent
  },
  {
    path: '/orderItem',
    component: OrderItemComponent
  },
  {
    path: '/accept',
    component: AcceptComponent
  }

]

//3.创建VueRouter对象
const router = new VueRouter({
  routes,//名字一定要是routes
  mode: 'history'//去掉默认hash模式中的#
})

//4.将router对象传入Vue中（挂载）
export default router