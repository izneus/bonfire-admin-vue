<template>
  <div class="app-container">
    <div class="content-main">
      <div class="search-bar">
        <el-form label-width="auto" label-position="left" size="small">
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="用户名:">
                <el-input v-model="query.username" placeholder="输入用户名" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户状态:">
                <el-select
                  v-model="query.userStatus"
                  clearable
                  placeholder="选择用户状态"
                  style="width: 100%"
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
              <el-button
                size="small"
                type="primary"
                style="margin-top: 12px"
                icon="el-icon-plus"
                @click="createVisible = true"
              >
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
          <el-table-column type="selection" width="55" />
          <el-table-column prop="username" label="用户名" show-overflow-tooltip />
          <el-table-column prop="nickname" label="昵称" show-overflow-tooltip />
          <el-table-column prop="fullname" label="全名" show-overflow-tooltip />
          <el-table-column prop="email" label="邮件" show-overflow-tooltip />
          <el-table-column prop="mobile" label="手机" show-overflow-tooltip />
          <el-table-column prop="remark" label="备注" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" show-overflow-tooltip />
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="getDetail(scope.row)">查看</el-button>
              <el-button type="text">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog
        title="新建用户"
        width="800px"
        :visible.sync="createVisible"
        :model="user"
      >
        <el-form ref="userForm" label-width="auto" size="medium" label-position="top" :model="user">
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="user.username" placeholder="输入用户名" suffix-icon="el-icon-date" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="昵称" prop="nickname">
                <el-input v-model="user.nickname" placeholder="输入昵称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="姓名" prop="fullname">
                <el-input v-model="user.fullname" placeholder="输入姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电子邮件" prop="email">
                <el-input v-model="user.email" placeholder="输入电子邮件地址" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号码" prop="mobile">
                <el-input v-model="user.mobile" placeholder="输入手机号码" suffix-icon="el-icon-phone-outline" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户状态" prop="status">
                <el-input v-model="user.status" placeholder="选择用户状态" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="user.remark" type="textarea" :rows="3" placeholder="输入备注" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-checkbox v-model="createNext" style="float: left;height: 36px;line-height: 36px;">继续新建下一条</el-checkbox>
          <el-button size="medium" @click="createVisible = false">取消</el-button>
          <el-button size="medium" type="primary" style="width: 100px" @click="createVisible = false">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
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
      },
      user: {
        username: null,
        nickname: null,
        fullname: null,
        email: null,
        mobile: null,
        remark: null,
        status: 0
      },
      tableData: null,
      createVisible: false,
      createNext: false
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
      listUsers(this.query).then(res => {
        console.log('user/listUsers: %o', res.data)
        this.tableData = res.data.rows
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
