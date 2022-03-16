<template>
  <div class="app-container">
    <div class="filter-wrapper">
      <div class="search-bar">
        <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="方法名称:" prop="method">
                <el-input v-model="query.method" placeholder="输入方法名称" @keyup.enter.native="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-button size="small" type="primary" @click="handleQuery">查 询</el-button>
              <el-button size="small" @click="resetForm('queryForm')">重 置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="table-wrapper">
      <div class="toolbar-wrapper">
        <el-row :gutter="24" type="flex" justify="end">
          <el-col :span="24">
            <div class="tool-title">访问日志</div>
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
      </el-table>
      <div class="pagi-wrapper" style="text-align: right;">
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

    <div v-show="selectedLog.length >0" class="bulk-wrapper">
      <div class="bulk-col-left">
        <div class="bulk-desc">
          已选择&nbsp;<a>{{ selectedLog.length }}</a>&nbsp;项
        </div>
      </div>
      <div class="bulk-col-right">
        <el-button
          type="danger"
          size="small"
          plain
          icon="el-icon-delete"
          :loading="deleteBatchLoading"
          :disabled="selectedLog.length < 1"
          @click="confirmDeleteLogs"
        >
          批量删除
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { deleteLogs, getLog, listLogs } from '@/api/log'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
export default {
  name: 'AccessLog',
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
    this.handleQuery()
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
