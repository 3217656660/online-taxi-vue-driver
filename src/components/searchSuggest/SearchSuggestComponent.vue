<template>
  <div id="search-suggest">
    <label for="searchinput">
      <el-autocomplete
        :disabled="isDisabled"
        class="inline-input"
        v-model="searchSuggestInput"
        :fetch-suggestions="querySearch"
        placeholder="请输入省、市、区等具体位置"
        :trigger-on-focus="false"
        @select="handleSelect"
        ></el-autocomplete>
      </label>
  </div>
</template>

<script>
import { requestMapIpToCity, requestMapSearchSuggest } from '@/network/request';
import store from '@/store';

export default {
  name: "SearchSuggestComponent",
  props: ['isDisabled'],
  data() {
    return {
      suggestList: [],
      searchSuggestInput: ''
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
        requestMapSearchSuggest(queryString)
          .then(list => {
            // 将name键值转换为value
            this.suggestList = list.map(({ name, ...rest }) => ({ value: name, ...rest }));
            let suggestList = this.suggestList;
            let results = queryString ? suggestList.filter(this.createFilter(queryString)) : suggestList;
            // 调用 callback 返回建议列表的数据
            cb(results);
          })
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
      const position = item.location + ''
      store.commit('setHomePosition', position.split(','))
    }

  },
  mounted() {
    requestMapIpToCity()
    .then(city => {
      //设置城市信息到vuex中,三个设置为IP定位的位置
      store.commit('setCity',city)
      store.commit('setStartCity',city)
      store.commit('setEndCity',city)
    });
    
  },


}
</script>

<style scoped>
.inline-input{
  width: 100%;
}
</style>