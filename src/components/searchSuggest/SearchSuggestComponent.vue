<template>
  <div id="search-suggest">
    <label for="searchinput">
      <el-autocomplete :disabled="isDisabled" class="inline-input" v-model="searchSuggestInput"
        :fetch-suggestions="querySearch" placeholder="请输入位置" :trigger-on-focus="false" @select="handleSelect"
        :debounce="500" placement='bottom'>
        <template slot-scope="{ item }">
          <div class="main-value common">{{ item.value }}</div>
          <div class="under-item common">{{ item.cityname + item.adname + item.address }}</div>
          <div class="under-item common">
            距离您{{ item.distance >= 1000 ? item.distance / 1000 + '公里' : item.distance + '米' }}
          </div>
          <el-divider></el-divider>
        </template>
      </el-autocomplete>
    </label>
  </div>
</template>

<script>
import { sleepMixin } from '@/common/mixin';
import { requestMapSearchSuggest } from '@/network/request';
import store from '@/store';
//蜜雪冰城
export default {
  name: "SearchSuggestComponent",
  props: ['isDisabled'],
  mixins: [sleepMixin],
  data() {
    return {
      suggestList: [],
      searchSuggestInput: '马鞍山市安徽工业大学',
      pageNum: 1,
      pageSize: 25,
    }
  },
  methods: {
    /**
     * 对搜索字符的处理
     * @param {*} queryString 搜索的字符
     * @param {*} cb 回调函数
     */
    querySearch(queryString, cb) {
      if (queryString === '')
        return;

      //将当前输入的关键字模糊查询并设置到列表suggestList
      requestMapSearchSuggest({
        searchKeywords: queryString,
        pageNum: this.pageNum, //page_num的取值1-100 
        pageSize: this.pageSize, //page_size的取值1-25
      })
        .then(list => {
          //将name键值转换为value
          this.suggestList = list.map(({ name, ...rest }) => ({ value: name, ...rest }));
          //let suggestList = this.suggestList;
          //let results = queryString ? suggestList.filter(this.createFilter(queryString)) : suggestList;
          // 调用 callback 返回建议列表的数据
          //console.log('vue :查询到的结果' + suggestList)
          cb(this.suggestList);
        });
    },


    /**
     * 搜索时字符列表过滤器
     * @param {*} queryString 输入的搜索字符
     */
    createFilter(queryString) {
      return (suggestList) => {
        //匹配字符
        return (
          suggestList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },


    /**
     * 处理选择
     * @param {*} item 选择的值（对象）
     */
    handleSelect(item) {
      const position = item.location + '';
      const location = position.split(',')
      store.commit('setHomePosition', {
        longitude: location[0], 
        latitude: location[1],
        address: item.cityname + item.adname + item.address,
      });
    }

  },
  mounted() {

  },


}
</script>

<style>
.inline-input {
  width: 100%;
}

.under-item {
  margin-top: -12px;
  font-size: 11px;
  color: #b4b4b4;
}

.main-value{
  font-size: 12px;
  margin-top: -5px;
}

.el-autocomplete-suggestion.el-popper {
  left: 5% !important;
  width: 90% !important;
}

.el-divider.el-divider--horizontal{
  margin: 0 0 !important;
}
</style>