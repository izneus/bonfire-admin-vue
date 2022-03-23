<template>
  <div class="app-container">
    <div class="filter-wrapper">
      <div class="search-bar">
        <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="接口名称:" prop="query">
                <el-input v-model="query.query" placeholder="输入接口名称" @keyup.enter.native="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="创建时间:" prop="createTime">
                <el-date-picker
                  v-model="query.createTime"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
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
        cell-class-name="result-table-cell"
        @selection-change="handleLogChange"
      >
        <el-empty slot="empty" />
        <el-table-column type="selection" width="55" />
        <el-table-column prop="description" label="接口" show-overflow-tooltip />
        <el-table-column prop="username" label="调用者" show-overflow-tooltip />
        <el-table-column prop="createTime" label="调用时间" show-overflow-tooltip />
        <el-table-column prop="clientIp" label="客户端ip" show-overflow-tooltip />
        <el-table-column prop="browser" label="浏览器" show-overflow-tooltip />
        <el-table-column prop="elapsedTime" label="耗时（毫秒）" show-overflow-tooltip align="right" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="showLog(scope.row)">详情</el-button>
            <el-button type="text" @click="confirmDeleteLogs([scope.row.id])">删除</el-button>
          </template>
        </el-table-column>
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
          @click="confirmDeleteLogs(selectedLog.map(log => log.id))"
        >
          批量删除
        </el-button>
      </div>
    </div>
    <div class="dialog-wrapper">
      <el-dialog
        title="访问日志详情"
        width="61.8%"
        :close-on-click-modal="false"
        :visible.sync="logVisible"
      >

        <el-descriptions title="接口信息" column="3">
          <el-descriptions-item label="接口名称">{{ log.description }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions column="1">
          <el-descriptions-item label="方法">{{ log.method }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="调用信息" style="margin-top: 10px">
          <el-descriptions-item label="调用者">{{ log.username }}</el-descriptions-item>
          <el-descriptions-item label="调用时间">{{ log.createTime }}</el-descriptions-item>
          <el-descriptions-item label="耗时">{{ log.elapsedTime }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions column="1">
          <el-descriptions-item label="调用参数">{{ log.param }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="用户信息" style="margin-top: 10px">
          <el-descriptions-item label="客户端IP">{{ log.clientIp }}</el-descriptions-item>
          <el-descriptions-item label="浏览器">{{ log.browser }}</el-descriptions-item>
          <el-descriptions-item label="用户系统">{{ log.os }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions column="1">
          <el-descriptions-item label="用户代理">{{ log.userAgent }}</el-descriptions-item>
        </el-descriptions>
        <span slot="footer" class="dialog-footer">
          <el-button
            size="medium"
            type="primary"
            @click="logVisible = false"
          >关 闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { deleteLogs, listLogs } from '@/api/log'
export default {
  name: 'AccessLog',
  data() {
    return {
      // 查询表单的数据
      query: {
        pageNum: 1,
        pageSize: 10,
        query: null,
        createTime: null
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
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
      logVisible: false,
      createNext: false,
      createLoading: false,
      tableLoading: false,
      deleteBatchLoading: false,
      editVisible: false,
      getLoading: false
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
    showLog(data) {
      // 显示编辑对话框
      this.logVisible = true
      this.log = data
    },
    // 清空表单内容
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 确认删除日志
    confirmDeleteLogs(ids) {
      this.$confirm('此操作将永久删除选中项, 是否继续?', '确认删除', {
        confirmButtonText: '确认删除',
        confirmButtonClass: 'msg-danger',
        cancelButtonText: '取消',
        cancelButtonClass: 'msg-cancel',
        type: 'warning'
      }).then(() => {
        this.handleDeleteLogs(ids)
      })
    },
    // 处理删除日志
    handleDeleteLogs(ids) {
      // 开启按钮loading
      this.deleteBatchLoading = true
      // 获得表格的选中行
      deleteLogs({ ids }).then(res => {
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
    }
  }
}
</script>

<style scoped>

</style>
