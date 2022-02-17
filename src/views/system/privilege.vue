<template>
  <div class="app-container" :class="{'has-bulk':selectedAuthority.length > 0}">
    <div class="filter-wrapper">
      <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="权限名称:" prop="authority">
              <el-input v-model="query.privName" placeholder="输入权限名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button size="small" type="primary" @click="handleQuery">查 询</el-button>
            <el-button size="small" @click="resetForm('queryForm')">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table-wrapper">
      <div class="toolbar-wrapper">
        <el-row :gutter="24" type="flex" justify="end">
          <el-col :span="12">
            <div class="tool-title">权限列表</div>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              @click="createVisible = true"
            >
              新增权限
            </el-button>
          </el-col>
        </el-row>
      </div>
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        style="width: 100%"
        show-overflow-tooltip="true"
        header-row-class-name="result-table-header"
        header-cell-class-name="result-table-header-cell"
        @selection-change="handleAuthorityChange"
      >
        <el-empty slot="empty" />
        <el-table-column type="selection" width="55" />
        <el-table-column prop="privName" label="权限名称" show-overflow-tooltip />
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editAuthority(scope.row.id)">编辑</el-button>
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
    <div v-show="selectedAuthority.length > 0" class="bulk-wrapper">
      <div class="bulk-col-left">
        <div class="bulk-desc">
          已选择&nbsp;<a>{{ selectedAuthority.length }}</a>&nbsp;项
        </div>
      </div>
      <div class="bulk-col-right">
        <el-button
          size="small"
          plain
          icon="el-icon-delete"
          class="line-button-danger"
          :loading="deleteBatchLoading"
          :disabled="selectedAuthority.length < 1"
          @click="confirmDeleteAuthorities"
        >
          批量删除
        </el-button>
      </div>
    </div>
    <div class="dialog-wrapper">
      <el-dialog
        title="新建权限"
        width="800px"
        :close-on-click-modal="false"
        :visible.sync="createVisible"
        @close="resetForm('authorityForm')"
      >
        <el-form
          ref="authorityForm"
          label-width="auto"
          size="medium"
          label-position="top"
          :model="authority"
          :rules="authorityRules"
        >

          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="权限名称" prop="privName">
                <el-input v-model="authority.privName" placeholder="输入权限名称" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="authority.remark" type="textarea" :rows="3" placeholder="输入备注" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="权限类型" prop="privType">
                <el-select v-model="authority.privType" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="父级ID" prop="parentId">
                <el-input v-model="authority.parentId" placeholder="输入父级id" />
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
            @click="handleCreateAuthority"
          >创建权限</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="dialog-wrapper">
      <el-dialog
        title="编辑权限"
        width="800px"
        :close-on-click-modal="false"
        :visible.sync="editVisible"
        @close="resetForm('editAuthorityForm')"
      >
        <el-form
          ref="editAuthorityForm"
          label-width="auto"
          size="medium"
          label-position="top"
          :model="authority"
          :rules="authorityRules"
        >
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="权限名称" prop="privName">
                <el-input v-model="authority.privName" placeholder="输入权限名称" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="authority.remark" type="textarea" :rows="3" placeholder="输入备注" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="权限类型" prop="privType">
                <el-select v-model="authority.privType" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="父级ID" prop="parentId">
                <el-input v-model="authority.parentId" placeholder="输入父级id" />
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
            @click="handleUpdateAuthority"
          >编辑权限</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPrivilegeList, createPriv, getPrivilegeById, updatePrivilegeById, batchDelete } from '@/api/privilege'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
export default {
  name: 'Privilege',
  data() {
    return {
      // 查询表单的数据
      query: {
        pageNum: 1,
        pageSize: 10,
        privName: null,
        remark: null
      },
      // 新建权限的数据
      authority: {
        id: null,
        privName: null,
        remark: null,
        privType: null,
        parentId: null
      },
      // 新建权限校验规则
      authorityRules: {
        privName: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请输入父级ID', trigger: 'blur' }
        ]
      },
      // 主表格数据
      tableData: null,
      totalSize: 0,
      // 选中用户表的行
      selectedAuthority: [],
      // 一些涉及是否的状态
      createVisible: false,
      createNext: false,
      createLoading: false,
      tableLoading: false,
      deleteBatchLoading: false,
      resetPassBatchLoading: false,
      foldSearch: false,
      editVisible: false,
      getLoading: false,
      exportLoading: false,
      // 对话框类型，复用新增和编辑
      // dialogType: 'add'
      // upload组件用的几个参数
      authHeader: {
        Authorization: 'Bearer ' + getToken()
      },
      uploadUrl: process.env.VUE_APP_BASE_API + '/v1/file/upload',
      options: [{
        value: '1',
        label: '菜单'
      }, {
        value: '2',
        label: '功能'
      }],
      value: ''
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
  },
  methods: {
    // 主表格查询
    handleQuery() {
      // 开启loading
      this.tableLoading = true
      getPrivilegeList(this.query).then(res => {
        this.tableData = res.data.rows
        this.totalSize = res.data.totalSize
      }).finally(() => {
        this.tableLoading = false
      })
    },
    editAuthority(privilegeId) {
      // 显示编辑对话框
      this.editVisible = true
      getPrivilegeById({ id: privilegeId }).then(res => {
        this.authority = res.data
      })
    },
    // 清空表单内容
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 处理创建权限
    handleCreateAuthority() {
      this.$refs.authorityForm.validate(valid => {
        if (valid) {
          // 新建按钮loading
          this.createLoading = true
          // 请求api
          createPriv(this.authority).then(res => {
            // 成功请求弹出提示
            this.$message({
              showClose: true,
              message: '创建成功',
              type: 'success'
            })
            // 判断是否需要继续新建下一条
            if (this.createNext) {
              // 是，重置form
              this.$refs.authorityForm.resetFields()
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
    // 处理更新权限
    handleUpdateAuthority() {
      this.$refs.editAuthorityForm.validate(valid => {
        if (valid) {
          this.createLoading = true
          console.log(this.authority.id)
          updatePrivilegeById(this.authority).then(res => {
            this.editVisible = false
            this.handleQuery()
          }).finally(() => {
            this.createLoading = false
          })
        }
      })
    },
    // 确认删除权限
    confirmDeleteAuthorities() {
      this.$confirm('此操作将永久删除选中项, 是否继续?', '确认删除', {
        confirmButtonText: '确认删除',
        confirmButtonClass: 'msg-danger',
        cancelButtonText: '取消',
        cancelButtonClass: 'msg-cancel',
        type: 'warning'
      }).then(() => {
        this.handleDeleteAuthorities()
      })
    },
    // 处理删除权限
    handleDeleteAuthorities() {
      // 开启按钮loading
      this.deleteBatchLoading = true
      // 获得表格的选中行
      const ids = this.selectedAuthority.map(authority => authority.id)
      batchDelete({ ids }).then(res => {
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
    // 处理用户选中变化
    handleAuthorityChange(val) {
      this.selectedAuthority = val
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
