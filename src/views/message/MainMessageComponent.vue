<template>
  <div id="message-container">
    <div class="head">
      <NavBarComponent>
        <div slot="left">消息</div>
      </NavBarComponent>
    </div>

    <div id="content">
      <MessageComponent>
        <div v-for="message in messages" :key="message.id" class="messages-box">
          <MessageItemComponent>
              <div slot="left" v-show=" message.sender === '司机' ">{{ message.sender }}:</div>
              <div slot="left-center"
               v-show=" message.sender === '司机' " 
               :style="message.sender === '司机' ? 'background-color: white;':'' "
               style="border-radius: 5px;"
               >{{ message.message }}</div>

              <div slot="right" v-show=" message.sender === '乘客' ">:{{ message.sender }}</div>
              <div slot="right-center" 
              v-show=" message.sender === '乘客' " 
              :style="message.sender === '乘客' ? 'background-color: rgb(2, 243, 2);':'' "
              style="border-radius: 5px;"
              >{{ message.message }}</div>
          </MessageItemComponent>
        </div>
      </MessageComponent>
    </div>
    
    <div class="foot">
      <div class="input-content">
        <el-input type="text" v-model="input" placeholder="请输入" id="input"></el-input>
      </div>
      <div class="input-btn-content">
        <el-button type="primary" :disabled="noConnent" size="medium" @click="sendMessage" style="width: 98%;">发送</el-button>
      </div>
    </div>
  
  </div>
</template>
<!-- {
  "sender": "司机",
  "message": "11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"
},
{
  "sender": "乘客",
  "message": "222222222222222222222222222222222222222222222222222222222222"
},
{
  "sender": "司机",
  "message": "333333333333333333333333333"
},
{
  "sender": "乘客",
  "message": "4444444444"
},
{
  "sender": "乘客",
  "message": "4444444444"
},
{
  "sender": "乘客",
  "message": "4444444444"
},
{
  "sender": "乘客",
  "message": "你好4444444444"
},
{
  "sender": "乘客",
  "message": "你好4444444444"
},
{
  "sender": "乘客",
  "message": "你好4444444444"
},
{
  "sender": "乘客",
  "message": "你好4444444444"
},
{
  "sender": "乘客",
  "message": "你好4444444444"
},
{
  "sender": "乘客",
  "message": "你好4444444444"
},
{
  "sender": "乘客",
  "message": "你好4444444444"
},
{
  "sender": "乘客",
  "message": "你好4444444444"
},
{
  "sender": "乘客",
  "message": "你好4444444444"
},
{
  "sender": "乘客",
  "message": "你好4444444444"
}, -->
<script>
import { makeElButtonBlurMixin } from '@/common/mixin';
import NavBarComponent from '@/components/navbar/NavBarComponent.vue';
import { requestGateway } from '@/network/request';
import store from '@/store';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import MessageComponent from './MessageComponent.vue';
import MessageItemComponent from './MessageItemComponent.vue';

export default {
  name: "MainMessageComponent",
  data(){
    return {
      input: '',
      messages: [],
      stompClient: null,
      noConnent: true
    }
  },
  components: {
    NavBarComponent,
    MessageComponent,
    MessageItemComponent
  },
  mixins:[makeElButtonBlurMixin],
  methods: {
    //发送消息给司机
    sendMessage(event){
      //解决按钮不失焦的问题
      const vm = this;
      const order = store.state.Order
      this.makeElButtonBlur(event)
      if (this.input === '') {
        this.$message({showClose: false, message: "您还没输入呢", type: 'error', offset: '60', duration: 1000})
        return;
      }
      const message = {
        sender:"乘客", message:this.input,
        userId: order.userId, driverId: order.userId,
        orderId: order.id
      }
      this.messages.push(message)
      vm.stompClient.send('/app/sendMessage', JSON.stringify(message), {'content-type': 'application/json'});
      this.input = ''
      this.setToBottom()
    },


    //设置滚动条到最底部
    setToBottom(){
      this.$nextTick(function(){
        const box = document.getElementById("item-container")
        box.scrollTop = box.scrollHeight
      })
    },


    //接收司机信息
    receiveMessage(){
      const vm = this
      //接收司机发送的消息
      const userId = store.state.User.id;
        vm.stompClient.subscribe(`/user/${userId}/queue/messageToUser/notifications`, notification => {
          console.log('司机发来一条消息内容是' + JSON.parse(notification.body));
          vm.messages.push( JSON.parse(notification.body) )
        });
      
      //模拟接收用户的消息测试
      // const driverId = store.state.Order.driverId;
      //   vm.stompClient.subscribe(`/user/${driverId}/queue/messageToDriver/notifications`, notification => {
      //     console.log('乘客发来一条消息内容是' + JSON.parse(notification.body));
      //     vm.messages.push( JSON.parse(notification.body) )
      //   });
    },


    /**
     * 关闭连接
     */
     disconnect() {
      if (this.stompClient !== null) {
        this.stompClient.disconnect();
      }
      console.log("Disconnected");
     },


    /**
     * 建立连接
     */
     connect() {
      const vm = this
      const socket = new SockJS('/websocket/ws');
      vm.stompClient = Stomp.over(socket);
      vm.stompClient.connect({ 
      }, frame => {
        console.log('Connected: ' + frame);
        vm.getHistoryMsg()
      }, error => {
        console.error('Error connecting to WebSocket:', error);
      });
     },


     /**
      * 获取两人的历史消息
      */
     getHistoryMsg(){
        const vm = this
        const id = 6
        requestGateway({
          url: "/api/order/message/getHistory",
          params:{
            id: id,
          }
        }).then(res => {
          if(res.data.status === 600){
            vm.$message({showClose: true, message: res.data.message, type: 'info', offset: '60'})
            return;
          }
          vm.messages = res.data.data
          vm.receiveMessage();
          vm.setToBottom()
        }).catch(err => {
          console.log('err :>> ', err);
        })
     },


     /**
      * 查询正在进行中的订单
      */
    takingOrder(){
      let localUser = JSON.parse( localStorage.getItem('User') )
      const userId = localUser.id
      const vm = this
      //查询个人信息
      requestGateway({
        url: "/api/order/checkOrder",
        method: 'get',
        params:{
          userId: userId,
        }
      }).then(res => {
        if(res.data.status == 600){
          vm.noConnent = true
          vm.$message({showClose: true,message: res.data.message, type: 'error',offset: '60'})
          return;
        }
        if(res.data.data === null){
          vm.noConnent = true
          vm.$message({showClose: true,message: '您当前没有正在进行的订单', type: 'info',offset: '60', duration: 0})
          return
        }
        vm.noConnent = false
        store.commit('setOrder', res.data.data);
        this.connect();
      }).catch(err => {
        console.log('err :>> ', err);
      })
    }
  },
  mounted(){
    this.takingOrder();
  },
  beforeDestroy() {
    this.disconnect();
  }

}
</script>

<style scoped>

@import url('@/assets/css/message.css');

</style>