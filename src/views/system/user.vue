<!--suppress JSUnresolvedVariable -->
<template>
  <div class="app-container" :class="{'has-bulk':selectedUser.length > 0}">
    <div class="filter-wrapper">
      <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="用户名称:" prop="username">
              <el-input v-model="query.username" placeholder="输入用户名称" />
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
          <el-col :span="12">
            <el-button size="small" type="primary" @click="handleQuery">查 询</el-button>
            <el-button size="small" @click="resetForm('queryForm')">重 置</el-button>
            <el-button size="small" type="text" style="padding-left: 0;" @click="handleFoldSearch">
              展开查询
              <i v-show="!foldSearch" class="el-icon-arrow-down" />
              <i v-show="foldSearch" class="el-icon-arrow-up" />
            </el-button>
          </el-col>
        </el-row>
        <el-row v-show="foldSearch" :gutter="24">
          <el-col :span="6">
            <el-form-item label="测试选项:">
              <el-input placeholder="输入测试选项" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="测试选项:">
              <el-input placeholder="输入测试选项" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="测试选项:">
              <el-input placeholder="输入测试选项" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table-wrapper">
      <div class="toolbar-wrapper">
        <el-row :gutter="24" type="flex" justify="end">
          <el-col :span="12">
            <div class="tool-title">用户列表</div>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-tooltip class="item" effect="dark" content="导入模板下载" placement="top" popper-class="mini-tip">
              <el-button
                icon="el-icon-document"
                class="tool-button"
                size="small"
                plain
              />
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="导入" placement="top" popper-class="mini-tip">
              <el-upload
                ref="upload"
                style="display: inline-block"
                :action="uploadUrl"
                :headers="authHeader"
                :show-file-list="false"
                :on-success="handleUploadSuccess"
                :on-error="handleUploadError"
              >
                <el-button
                  class="tool-button"
                  size="small"
                  icon="el-icon-upload2"
                  plain
                />
              </el-upload>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="导出" placement="top" popper-class="mini-tip">
              <el-button
                icon="el-icon-download"
                class="tool-button"
                size="small"
                plain
                :loading="exportLoading"
                @click="handleExportUsers"
              />
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="刷新数据" placement="top" popper-class="mini-tip">
              <el-button
                icon="el-icon-refresh-right"
                class="tool-button"
                size="small"
                plain
                @click="handleQuery()"
              />
            </el-tooltip>

            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              style="margin-left: 10px"
              @click="createUser"
            >
              新增用户
            </el-button>
          </el-col>
        </el-row>
      </div>
      <!--suppress HtmlUnknownAttribute -->
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        style="width: 100%"
        show-overflow-tooltip="true"
        header-row-class-name="result-table-header"
        header-cell-class-name="result-table-header-cell"
        cell-class-name="result-table-cell"
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
        <el-table-column prop="status" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === '0'" size="small">
              {{ dict.label.user_status[scope.row.status] }}
            </el-tag>
            <el-tag v-else size="small" type="danger">{{ dict.label.user_status[scope.row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editUser(scope.row.id)">编辑</el-button>
            <el-button type="text" @click="confirmDeleteUsers([scope.row.id])">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagi-wrapper">
        <el-pagination
          background
          :current-page="query.pageNum"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalSize"
          @size-change="handleChangePageSize"
          @current-change="handleChangePageNum"
        />
      </div>
    </div>
    <div v-show="selectedUser.length > 0" class="bulk-wrapper">
      <div class="bulk-col-left">
        <div class="bulk-desc">
          已选择&nbsp;<a>{{ selectedUser.length }}</a>&nbsp;项
        </div>
      </div>
      <div class="bulk-col-right">
        <el-button
          type="danger"
          plain
          size="small"
          icon="el-icon-delete"
          :loading="deleteBatchLoading"
          @click="confirmDeleteUsers(selectedUser.map(user => user.id))"
        >
          批量删除
        </el-button>

        <el-button
          type="primary"
          size="small"
          plain
          :loading="resetPassBatchLoading"
          @click="confirmResetPassBatch"
        >
          批量重置密码
        </el-button>
      </div>
    </div>
    <div class="dialog-wrapper">
      <el-dialog
        title="新建用户"
        width="50%"
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
            <el-col v-show="false" :span="24">
              <el-form-item label="用户id" prop="id">
                <el-input v-model="user.id" readonly />
              </el-form-item>
            </el-col>
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
            <el-col :span="24">
              <el-form-item label="角色" prop="roleIds">
                <el-select
                  v-model="user.roleIds"
                  multiple
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="role in roles"
                    :key="role.id"
                    :label="role.roleName"
                    :value="role.id"
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
                <el-input
                  v-model="user.remark"
                  type="textarea"
                  :rows="5"
                  maxlength="200"
                  show-word-limit
                  placeholder="输入备注"
                />
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
            @click="handleCreateUser"
          >创建用户</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="dialog-wrapper">
      <el-dialog
        title="编辑用户"
        width="50%"
        :close-on-click-modal="false"
        :visible.sync="editVisible"
        @close="resetForm('editUserForm')"
      >
        <el-form
          ref="editUserForm"
          label-width="auto"
          size="medium"
          label-position="top"
          :model="user"
          :rules="userRules"
        >
          <el-row :gutter="30">
            <el-col v-show="false" :span="24">
              <el-form-item label="用户id" prop="id">
                <el-input v-model="user.id" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户名" prop="username">
                <el-input
                  v-model="user.username"
                  placeholder="输入用户名"
                  suffix-icon="el-icon-user"
                />
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
            <el-col :span="24">
              <el-form-item label="角色" prop="roleIds">
                <el-select
                  v-model="user.roleIds"
                  multiple
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="role in roles"
                    :key="role.id"
                    :label="role.roleName"
                    :value="role.id"
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
          <el-button size="medium" plain @click="editVisible = false">取消</el-button>
          <el-button
            size="medium"
            type="primary"
            :loading="createLoading"
            @click="handleUpdateUser"
          >编辑用户</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { createUser, deleteUsers, exportUsers, getUser, listUsers, resetPasswordBatch, updateUser } from '@/api/user'
import { listRoles } from '@/api/role'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
import { REG_MOBILE, REG_USERNAME } from '@/constant/reg-exp'

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
        id: null,
        username: null,
        nickname: null,
        fullname: null,
        email: null,
        mobile: null,
        remark: null,
        status: null,
        roleIds: null
      },
      // 新建用户校验规则
      userRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: REG_USERNAME, message: '用户名必须为5-20位字母或者数字', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择用户状态', trigger: 'blur' }
        ],
        mobile: [{ pattern: REG_MOBILE, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的电子邮件地址', trigger: 'blur' }
        ],
        roleIds: [
          { type: 'array', required: true, message: '请至少选择一个角色', trigger: 'blur' }
        ]
      },
      // 主表格数据
      tableData: null,
      totalSize: 0,
      // 复选框数据
      checkList: [],
      // 选中用户表的行
      selectedUser: [],
      // 所有角色，下拉框用
      roles: [],
      // 一些涉及是否的状态
      createVisible: false,
      createNext: false,
      createLoading: false,
      tableLoading: false,
      deleteBatchLoading: false,
      resetPassBatchLoading: false,
      foldSearch: false,
      editVisible: false,
      setVisible: false,
      getLoading: false,
      exportLoading: false,
      // 对话框类型，复用新增和编辑
      // dialogType: 'add'
      // upload组件用的几个参数
      authHeader: {
        Authorization: 'Bearer ' + getToken()
      },
      uploadUrl: process.env.VUE_APP_BASE_API + '/v1/file/upload'
    }
  },
  created() {
    // 进入页面第一次查询，为了演示无数据状态暂时注释，
    // 实际业务页面为了用户体验，进页面都要请求一次数据
    // this.handleQuery()
    // 得到完整数据
    // console.log(this.dict)
    // 打印简化后的label数据
    // console.log(this.dict.label.user_status)
    // 初始化所有角色
    listRoles({ pageNum: 1, pageSize: 100 }).then(res => {
      this.roles = res.data.rows
    })
  },
  methods: {
    // 主表格查询
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
    createUser() {
      // 显示创建用户对话框
      this.createVisible = true
    },
    editUser(userId) {
      // 显示编辑对话框
      this.editVisible = true
      getUser({ id: userId }).then(res => {
        this.user = res.data
        this.user.roleIds = res.data.roleIds == null ? [] : res.data.roleIds
      })
    },
    /* getDetail(row) {
      getUser({ id: row.id }).then(res => {
      })
    },*/
    // 清空表单内容
    resetForm(formName) {
      // noinspection JSUnresolvedFunction
      this.$refs[formName].resetFields()
    },
    // 处理创建用户
    handleCreateUser() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          // 新建按钮loading
          this.createLoading = true
          // 请求api
          createUser(this.user).then(() => {
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
    // 处理更新用户
    handleUpdateUser() {
      this.$refs.editUserForm.validate(valid => {
        if (valid) {
          this.createLoading = true
          updateUser(this.user).then(() => {
            this.$message({
              showClose: true,
              message: '更新成功',
              type: 'success'
            })
            this.editVisible = false
            this.handleQuery()
          }).finally(() => {
            this.createLoading = false
          })
        }
      })
    },
    // 处理导出用户
    handleExportUsers() {
      // 暂时禁用导出按钮
      this.exportLoading = true
      exportUsers(this.query).then(res => {
        window.open(process.env.VUE_APP_BASE_API + '/v1/file/download?token=' + res.data.token)
      }).finally(() => {
        this.exportLoading = false
      })
    },
    // 确认删除用户
    confirmDeleteUsers(ids) {
      this.$confirm('此操作将永久删除选中项, 是否继续?', '确认删除', {
        confirmButtonText: '确认删除',
        confirmButtonClass: 'msg-danger',
        cancelButtonText: '取消',
        cancelButtonClass: 'msg-cancel',
        type: 'warning'
      }).then(() => {
        this.handleDeleteUsers(ids)
      })
    },
    // 处理删除用户
    handleDeleteUsers(ids) {
      // 开启按钮loading
      this.deleteBatchLoading = true
      // 获得表格的选中行
      // const ids = this.selectedUser.map(user => user.id)
      deleteUsers({ ids }).then(() => {
        // 成功请求弹出提示
        this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
        // 刷新表格数据
        this.handleQuery()
      }).finally(() => {
        // 关闭按钮loading
        this.deleteBatchLoading = false
      })
    },
    // 确认批量重置密码
    confirmResetPassBatch() {
      this.$confirm('此操作将重置密码为默认密码, 是否继续?', '确认重置', {
        confirmButtonText: '确认重置',
        confirmButtonClass: 'msg-danger',
        cancelButtonText: '取消',
        cancelButtonClass: 'msg-cancel',
        type: 'warning'
      }).then(() => {
        this.handleResetPassBatch()
      })
    },
    // 处理重置密码
    handleResetPassBatch() {
      // 开启按钮loading
      this.resetPassBatchLoading = true
      // 获得表格的选中行
      const ids = this.selectedUser.map(user => user.id)
      resetPasswordBatch({ ids }).then(() => {
        // 成功请求弹出提示
        this.$message({
          showClose: true,
          message: '批量重置密码成功',
          type: 'success'
        })
      }).finally(() => {
        // 关闭按钮loading
        this.resetPassBatchLoading = false
      })
    },
    // 处理用户选中变化
    handleUserChange(val) {
      this.selectedUser = val
    },
    handleChangePageNum(val) {
      this.query.pageNum = val
      this.handleQuery()
    },
    handleChangePageSize(val) {
      this.query.pageSize = val
      this.handleQuery()
    },
    handleFoldSearch() {
      this.foldSearch = !this.foldSearch
    },
    handleUploadError(err, file) {
      const e = JSON.parse(err.message)
      Message({
        message: '文件「' + file.name + '」上传失败，错误原因：' + e.message,
        type: 'error',
        duration: 5 * 1000
      })
    },
    handleUploadSuccess() {
      Message({
        message: '文件上传成功',
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>

<style scoped>
</style>
