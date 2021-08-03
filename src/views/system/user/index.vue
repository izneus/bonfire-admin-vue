<template>
<div>adfsaf</div>
</template>

<script>
export default {
  name: 'User',
  dicts: ['user_status'],
  created() {
    console.log(this.dict)
    // 得到完整数据
    // console.log(this.dict.user_status)
    // 打印简化后的label数据
    // console.log(this.dict.user_status.label)
  }
}
</script>

<style scoped>

</style>
