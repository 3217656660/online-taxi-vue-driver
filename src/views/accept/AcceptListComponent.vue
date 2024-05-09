<template>
  <div id="acceptList">

    <div class="title">
      <h3>可接单列表</h3>
    </div>
    
    <div class="acceptAbleList">
      <el-table :data="tableData">
        <el-table-column prop="startAddress" label="起点" width="100">
        </el-table-column>
        <el-table-column prop="endAddress" label="终点" width="100">
        </el-table-column>
        <el-table-column prop="distance" label="距离">
          
        </el-table-column>
        <el-table-column prop="price" label="估价">
          
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">接单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <map-component style="display: none;" ref="childMap" @child-loaded="getPosition"/>
  </div>
</template>

<script>
import { Error_Msg } from '@/common/string';
import MapComponent from '@/components/home/MapComponent.vue';
import { requestGateway } from '@/network/request';
import store from '@/store';

export default {
  name: "AcceptListComponent",
  mounted(){
    //获取司机地理位置信息
    this.getPosition();
    //获取可接单列表
    this.getList();
    
  },
  components: {
    MapComponent
  },
  data(){
    return {
      tableData: [
        { 
          id: 1,
          userId: 1,
          startAddress: '八五三农场',
          endAddress: '八五二农场',
          distance: 30.34 + 'km',
          price: 50.12 + '元',
        },
        { 
          id: 2,
          userId: 1,
          startAddress: '八五三农场',
          endAddress: '八五二农场',
          distance: 30.34 + 'km',
          price: 50.12 + '元',
        }
      ],
      AMap: null,
    }
  },
  methods: {
      handleClick(row) {
        //提交到服务端

        console.log(row);
      },


      getPosition(){
        //获取位置信息,并存入仓库中
        store.commit('setDriverActionTakeOrderVo', {
          nowAddressLongitude: 116.40,
          nowAddressLatitude: 39.40
        });
        
      },

      
      /**
       * 获取接单列表
       */
      getList(){
        const vm = this;
        const driverActionTakeOrderVo = {
          "nowAddressLongitude": 127.16,
          "nowAddressLatitude": 44.93
        }
        requestGateway({
          url: '/api/main/getAbleOrderList',
          method: 'get',
          params: driverActionTakeOrderVo
        }).then(res => {
          console.log('res.data :>> ', res.data);
          if(res.data !== undefined && res.data === Error_Msg.NO_ACCEPTABLE_ORDER){
            vm.$message({showClose: true, message: Error_Msg.NO_ACCEPTABLE_ORDER, type: 'info', offset: '60'})
            return;
          }
          vm.tableData = res.data;
        }).catch(err => {
          console.log('err :>> ', err);
        })
      },
    },
    computed: {
      distance(){
        return 1;
      },


      price(){
        return 1;
      }
    }

}
</script>

<style scoped>
  @import url('@/assets/css/accept.css');

.acceptAbleList {
  position: relative;
  margin-top: 12px;
}
</style>