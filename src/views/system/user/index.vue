<template>
  <div class="app-container">
    <div class="content-main">
      <div class="search-bar">
        <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="用 户 名:" prop="username">
                <el-input v-model="query.username" placeholder="输入用户名" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用户状态:" prop="status">
                <el-select
                  v-model="query.status"
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
            <el-col :span="6">
              <el-button size="small" type="primary" @click="handleQuery">查 询</el-button>
              <el-button size="small" @click="resetForm('queryForm')">重 置</el-button>
            </el-col>
            <el-col :span="6" />
          </el-row>
        </el-form>
      </div>
      <div class="tool-bar">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              @click="createVisible = true"
            >
              新增用户
            </el-button>
          </el-col>
          <el-col :span="12">
            <el-button-group style="vertical-align: top; margin-left: 20px;float: right;">
              <el-button
                size="small"
                plain
                icon="el-icon-delete"
                class="line-button-danger"
                :disabled="selectedUser.length < 1"
                @click="confirmDeleteUsers"
              >
                批量删除
              </el-button>
              <el-button
                size="small"
                plain
              >
                <svg-icon icon-class="import" />
                导入
              </el-button>
              <el-button
                size="small"
                plain
              >
                <svg-icon icon-class="export" />
                导出
              </el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </div>
      <div class="result-table">
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          style="width: 100%"
          show-overflow-tooltip="true"
          @selection-change="handleUserChange"
        >
          <el-empty slot="empty" />
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
      <div class="foot-bar" style="text-align: right;">
        <el-pagination
          background
          :current-page="query.pageNum"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalSize"
          @size-change="changePageSize"
          @current-change="changePageNum"
        />
      </div>
      <div class="dialog-wrapper">
        <el-dialog
          title="新建用户"
          width="800px"
          :close-on-click-modal="false"
          :visible.sync="createVisible"
          @close="resetForm('userForm')"
        >
          <el-form
            ref="userForm"
            label-width="auto"
            size="medium"
            label-position="top"
            :model="user"
            :rules="userRules"
          >
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="user.username" placeholder="输入用户名" suffix-icon="el-icon-user" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户状态" prop="status">
                  <el-select
                    v-model="user.status"
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
                <el-form-item label="手机号码" prop="mobile">
                  <el-input v-model="user.mobile" placeholder="输入手机号码" suffix-icon="el-icon-phone-outline" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="电子邮件" prop="email">
                  <el-input v-model="user.email" placeholder="输入电子邮件地址" suffix-icon="el-icon-message" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="user.remark" type="textarea" :rows="5" placeholder="输入备注" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-checkbox
              v-model="createNext"
              style="float: left;height: 36px;line-height: 36px;"
            >继续新建下一条</el-checkbox>
            <el-button size="medium" plain @click="createVisible = false">取消</el-button>
            <el-button
              size="medium"
              type="primary"
              :loading="createLoading"
              @click="createUser"
            >创建用户</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { createUser, deleteUsers, listUsers } from '@/api/user'

export default {
  name: 'User',
  // 字典选项
  dicts: ['user_status'],
  data() {
    return {
      // 查询表单的数据
      query: {
        pageNum: 1,
        pageSize: 10,
        username: null,
        status: null
      },
      // 新建用户的数据
      user: {
        username: null,
        nickname: null,
        fullname: null,
        email: null,
        mobile: null,
        remark: null,
        status: null
      },
      // 新建用户校验规则
      userRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{5,20}$/, message: '用户名必须为5-20位字母或者数字', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择用户状态', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的电子邮件地址', trigger: 'blur' }
        ]
      },
      tableData: null,
      totalSize: 0,
      selectedUser: [],
      createVisible: false,
      createNext: false,
      createLoading: false,
      tableLoading: false,
      deleteBatchLoading: false
    }
  },
  created() {
    // 进入页面第一次查询，为了演示无数据状态暂时注释，
    // 实际业务页面为了用户体验，进页面都要请求一次数据
    // this.handleQuery()
  },
  methods: {
    handleQuery() {
      // 开启loading
      this.tableLoading = true
      listUsers(this.query).then(res => {
        this.tableData = res.data.rows
        this.totalSize = res.data.totalSize
      }).finally(() => {
        this.tableLoading = false
      })
    },
    getDetail(row) {
      console.log(row)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    createUser() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          // 新建按钮loading
          this.createLoading = true
          // 请求api
          createUser(this.user).then(res => {
            // 成功请求弹出提示
            this.$message({
              showClose: true,
              message: '创建成功',
              type: 'success'
            })
            // 判断是否需要继续新建下一条
            if (this.createNext) {
              // 是，重置form
              this.$refs.userForm.resetFields()
            } else {
              // 否，关闭对话框
              this.createVisible = false
              // 刷新表格数据
              this.handleQuery()
            }
          }).finally(() => {
            // 关闭loading效果
            this.createLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    confirmDeleteUsers() {
      this.$confirm('此操作将永久删除选中项, 是否继续?', '确认删除', {
        confirmButtonText: '确认删除',
        confirmButtonClass: 'msg-danger',
        cancelButtonText: '取消',
        cancelButtonClass: 'msg-cancel',
        type: 'warning'
      }).then(() => {
        this.deleteUsers()
      })
    },
    deleteUsers() {
      // 开启按钮loading
      this.deleteBatchLoading = true
      // 获得表格的选中行
      const ids = this.selectedUser.map(user => user.id)
      deleteUsers({ ids }).then(res => {
        // 成功请求弹出提示
        this.$message({
          showClose: true,
          message: '批量删除成功',
          type: 'success'
        })
        // 刷新表格数据
        this.handleQuery()
      }).finally(() => {
        // 关闭按钮loading
        this.deleteBatchLoading = false
      })
    },
    handleUserChange(val) {
      this.selectedUser = val
    },
    changePageNum(val) {
      this.query.pageNum = val
      this.handleQuery()
    },
    changePageSize(val) {
      this.query.pageSize = val
      this.handleQuery()
    }
  }
}
</script>

<style scoped>
</style>
