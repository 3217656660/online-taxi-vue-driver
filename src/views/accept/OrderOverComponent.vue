<template>
  <div>
    <el-result icon="success" title="行程结束" subTitle="请根据提示进行操作">
      <template slot="extra">
        <el-button type="primary" size="medium" @click="goToAccept">返回</el-button>
      </template>
    </el-result>
  </div>
</template>

<script>
export default {
  name: "OrderOverComponent",
  methods:{
    goToAccept(){
      this.$router.replace('/accept')
    },


  }
}
</script>

<style lang="scss" scoped></style>