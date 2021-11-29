<template>
  <div class="app-container">
    <div class="content-main">
      <div class="search-bar">
        <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="方法名称:" prop="method">
                <el-input v-model="query.method" placeholder="输入方法名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-button size="small" type="primary" @click="handleQuery">查 询</el-button>
              <el-button size="small" @click="resetForm('queryForm')">重 置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="tool-bar">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-button-group>
              <el-button
                size="small"
                plain
                icon="el-icon-delete"
                class="line-button-danger"
                :loading="deleteBatchLoading"
                :disabled="selectedLog.length < 1"
                @click="confirmDeleteLogs"
              >
                批量删除
              </el-button>
            </el-button-group>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              @click="createVisible = true"
            >
              新增日志
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="result-table">
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          style="width: 100%"
          show-overflow-tooltip="true"
          header-row-class-name="result-table-header"
          header-cell-class-name="result-table-header-cell"
          @selection-change="handleLogChange"
        >
          <el-empty slot="empty" />
          <el-table-column type="selection" width="55" />
          <el-table-column prop="method" label="方法名称" show-overflow-tooltip />
          <el-table-column prop="userAgent" label="用户代理" show-overflow-tooltip />
          <el-table-column prop="clientIp" label="客户端ip" show-overflow-tooltip />
          <el-table-column prop="description" label="注解描述" show-overflow-tooltip />
          <el-table-column prop="browser" label="浏览器" show-overflow-tooltip />
          <el-table-column prop="os" label="系统" show-overflow-tooltip />
          <el-table-column prop="remark" label="备注" show-overflow-tooltip />
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="editLog(scope.row.id)">编辑</el-button>
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
          @size-change="handleChangePageSize"
          @current-change="handleChangePageNum"
        />
      </div>
      <div class="dialog-wrapper">
        <el-dialog
          title="新建日志"
          width="800px"
          :close-on-click-modal="false"
          :visible.sync="createVisible"
          @close="resetForm('logForm')"
        >
          <el-form
            ref="logForm"
            label-width="auto"
            size="medium"
            label-position="top"
            :model="log"
            :rules="logRules"
          >
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="日志ID" prop="id">
                  <el-input v-model="log.id" placeholder="输入日志ID" suffix-icon="el-icon-log" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="方法名称" prop="method">
                  <el-input v-model="log.method" placeholder="输入方法名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户代理" prop="userAgent">
                  <el-input v-model="log.userAgent" placeholder="输入用户代理" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="客户端ip" prop="clientIp">
                  <el-input v-model="log.clientIp" placeholder="输入客户端ip" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="注解说明" prop="description">
                  <el-input v-model="log.description" placeholder="输入注解说明" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="浏览器" prop="browser">
                  <el-input v-model="log.browser" placeholder="输入浏览器名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="系统" prop="os">
                  <el-input v-model="log.os" placeholder="输入系统名称" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="log.remark" type="textarea" :rows="5" placeholder="输入备注" />
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
              @click="handleCreateLog"
            >创建权限</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="dialog-wrapper">
        <el-dialog
          title="编辑日志"
          width="800px"
          :close-on-click-modal="false"
          :visible.sync="editVisible"
          @close="resetForm('editLogForm')"
        >
          <el-form
            ref="editLogForm"
            label-width="auto"
            size="medium"
            label-position="top"
            :model="log"
            :rules="logRules"
          >
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="方法名称" prop="method">
                  <el-input v-model="log.method" placeholder="输入方法名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户代理" prop="userAgent">
                  <el-input v-model="log.userAgent" placeholder="输入用户代理" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="客户端ip" prop="clientIp">
                  <el-input v-model="log.clientIp" placeholder="输入客户端ip" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="注解描述" prop="description">
                  <el-input v-model="log.description" placeholder="输入注解描述" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="浏览器" prop="browser">
                  <el-input v-model="log.browser" placeholder="输入浏览器名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="系统" prop="os">
                  <el-input v-model="log.os" placeholder="输入系统名称" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="log.remark" type="textarea" :rows="5" placeholder="输入备注" />
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
              @click="handleUpdateLog"
            >编辑日志</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { createLog, deleteLogs, getLog, listLogs, updateLog } from '@/api/log'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
export default {
  name: 'Log',
  data() {
    return {
      // 查询表单的数据
      query: {
        pageNum: 1,
        pageSize: 10,
        method: null,
        userAgent: null,
        clientIp: null,
        description: null,
        browser: null,
        os: null,
        remark: null
      },
      // 新建日志的数据
      log: {
        id: null,
        method: null,
        userAgent: null,
        clientIp: null,
        description: null,
        browser: null,
        os: null,
        remark: null
      },
      // 新建日志校验规则
      logRules: {
        id: [
          { required: true, message: '请输入日志ID', trigger: 'blur' }
        ],
        method: [
          { required: true, message: '请输入方法名称', trigger: 'blur' }
        ]
      },
      // 主表格数据
      tableData: null,
      totalSize: 0,
      // 选中日志表的行
      selectedLog: [],
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
  },
  methods: {
    // 主表格查询
    handleQuery() {
      // 开启loading
      this.tableLoading = true
      listLogs(this.query).then(res => {
        this.tableData = res.data.rows
        this.totalSize = res.data.totalSize
      }).finally(() => {
        this.tableLoading = false
      })
    },
    editLog(logId) {
      // 显示编辑对话框
      this.editVisible = true
      getLog({ id: logId }).then(res => {
        this.log = res.data
      })
    },
    /* getDetail(row) {
      getUser({ id: row.id }).then(res => {
      })
    },*/
    // 清空表单内容
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 处理创建权限
    handleCreateLog() {
      this.$refs.logForm.validate(valid => {
        if (valid) {
          // 新建按钮loading
          this.createLoading = true
          // 请求api
          createLog(this.log).then(res => {
            // 成功请求弹出提示
            this.$message({
              showClose: true,
              message: '创建成功',
              type: 'success'
            })
            // 判断是否需要继续新建下一条
            if (this.createNext) {
              // 是，重置form
              this.$refs.logForm.resetFields()
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
    // 处理更新日志
    handleUpdateLog() {
      this.$refs.editLogForm.validate(valid => {
        if (valid) {
          this.createLoading = true
          updateLog(this.log).then(res => {
            this.editVisible = false
            this.handleQuery()
          }).finally(() => {
            this.createLoading = false
          })
        }
      })
    },
    // 确认删除日志
    confirmDeleteLogs() {
      this.$confirm('此操作将永久删除选中项, 是否继续?', '确认删除', {
        confirmButtonText: '确认删除',
        confirmButtonClass: 'msg-danger',
        cancelButtonText: '取消',
        cancelButtonClass: 'msg-cancel',
        type: 'warning'
      }).then(() => {
        this.handleDeleteLogs()
      })
    },
    // 处理删除日志
    handleDeleteLogs() {
      // 开启按钮loading
      this.deleteBatchLoading = true
      // 获得表格的选中行
      const ids = this.selectedLog.map(log => log.id)
      deleteLogs({ ids }).then(res => {
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
    handleLogChange(val) {
      this.selectedLog = val
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
