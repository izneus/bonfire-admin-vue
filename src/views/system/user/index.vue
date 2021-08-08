<template>
  <el-form ref="searchForm" :model="query">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="query.username" />
    </el-form-item>

    <template>
      <el-select
        v-model="query.userStatus"
        clearable
        placeholder="请选择"
      >
        <el-option
          v-for="item in dict.user_status"
          :key="item.dictValue"
          :label="item.dictLabel"
          :value="item.dictValue"
        />
      </el-select>
    </template>
    <el-button type="primary" @click="handleQuery">搜索</el-button>
  </el-form>
</template>

<script>
import { listUsers } from '@/api/user'

export default {
  name: 'User',
  dicts: ['user_status'],
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10,
        username: null,
        userStatus: null
      }
    }
  },
  created() {
    // console.log(this.dict)
    // 得到完整数据
    // console.log(this.dict.user_status)
    // 打印简化后的label数据
    // console.log(this.dict.user_status.label)
  },
  methods: {
    handleQuery() {
      listUsers(this.query).then(resp => {
        console.log('user/listUsers: %o', resp.data)
      })
    }
  }
}
</script>

<style scoped>

</style>
