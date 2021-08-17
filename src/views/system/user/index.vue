<template>
  <div class="app-container">

    <div class="content-main">

      <div class="search-bar">
        <el-form label-width="80px" label-position="left">
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="用户名:">
                <el-input v-model="query.username" size="small" placeholder="请输入用户名"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户状态:">
                <el-select
                  v-model="query.userStatus"
                  clearable
                  placeholder="请选择用户状态"
                  style="width: 100%"
                  size="small"
                >
                  <el-option
                    v-for="item in dict.user_status"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button size="small" type="primary" @click="handleQuery">查 询</el-button>
              <el-button size="small" @click="resetQuery">重 置</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-button size="small" type="primary" style="margin-top: 12px" icon="el-icon-plus">
                新增用户
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="result-table">
        <el-table
          :data="tableData"
          style="width: 100%"
          show-overflow-tooltip="true"
        >
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="username" label="用户名" show-overflow-tooltip/>
          <el-table-column prop="nickname" label="昵称" show-overflow-tooltip/>
          <el-table-column prop="fullname" label="全名" show-overflow-tooltip/>
          <el-table-column prop="email" label="邮件" show-overflow-tooltip/>
          <el-table-column prop="mobile" label="手机" show-overflow-tooltip/>
          <el-table-column prop="remark" label="备注" show-overflow-tooltip/>
          <el-table-column prop="status" label="状态" show-overflow-tooltip/>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="getDetail(scope.row)">查看</el-button>
              <el-button type="text">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {listUsers} from '@/api/user'

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
      },
      tableData: null
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
        this.tableData = resp.data.rows
      })
    },
    getDetail(row) {
      console.log(row)
    },
    resetQuery() {
      this.query.username = null
      this.query.userStatus = null
    }

  }
}
</script>

<style scoped>
</style>
