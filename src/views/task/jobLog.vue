<template>
  <div class="app-container" :class="{'has-bulk':selectedJobLog.length > 0}">
    <div class="filter-wrapper">
      <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="创建时间:" prop="createTime">
              <el-date-picker
                v-model="query.createTime"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%"
                :default-time="['00:00:00', '23:59:59']"
              />
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
            <div class="tool-title">任务日志列表</div>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-tooltip class="item" effect="dark" content="刷新数据" placement="top" popper-class="mini-tip">
              <el-button
                icon="el-icon-refresh-right"
                class="tool-button"
                size="small"
                plain
                @click="handleQuery()"
              />
            </el-tooltip>
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
        @selection-change="handleJobLogChange"
      >
        <el-empty slot="empty" />
        <el-table-column type="selection" width="55" />
        <el-table-column prop="jobClass" label="任务类" show-overflow-tooltip />
        <el-table-column prop="jobMethod" label="任务方法" show-overflow-tooltip />
        <el-table-column prop="param" label="参数" show-overflow-tooltip />
        <el-table-column prop="createTime" label="运行时间" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === '0'" size="small">
              {{ dict.label.job_log_status[scope.row.status] }}
            </el-tag>
            <el-tag v-else size="small" type="danger">{{ dict.label.job_log_status[scope.row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="durationMillis" label="耗时(毫秒)" show-overflow-tooltip />
        <el-table-column prop="message" label="信息" show-overflow-tooltip />

        <!--        <el-table-column prop="createUser" label="创建者" show-overflow-tooltip />-->
<!--        <el-table-column prop="updateTime" label="更新时间" show-overflow-tooltip />-->
<!--        <el-table-column prop="updateUser" label="更新者" show-overflow-tooltip />-->
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
    <div v-show="selectedJobLog.length > 0" class="bulk-wrapper">
      <div class="bulk-col-left">
        <div class="bulk-desc">
          已选择&nbsp;<a>{{ selectedJobLog.length }}</a>&nbsp;项
        </div>
      </div>
      <div class="bulk-col-right">
        <el-button
          size="small"
          plain
          icon="el-icon-delete"
          class="line-button-danger"
          :loading="deleteBatchLoading"
          :disabled="selectedJobLog.length < 1"
          @click="confirmDeleteJobLogs"
        >
          批量删除
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { deleteJobLogs, getJobLog, listJobLogs } from '@/api/jobLog'
export default {
  name: 'JobLog',
  dicts: ['job_log_status'],
  data() {
    return {
      // 查询表单的数据
      query: {
        pageNum: 1,
        pageSize: 10,
        createTime: ['', '']
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
      // 主表格数据
      tableData: null,
      totalSize: 0,
      // 选中日志表的行
      selectedJobLog: [],
      // 一些涉及是否的状态
      createVisible: false,
      createNext: false,
      createLoading: false,
      tableLoading: false,
      deleteBatchLoading: false,
      resetPassBatchLoading: false,
      foldSearch: false,
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
      listJobLogs(this.query).then(res => {
        this.tableData = res.data.rows
        this.totalSize = res.data.totalSize
      }).finally(() => {
        this.tableLoading = false
      })
    },
    editJobLog(jobLogId) {
      // 显示编辑对话框
      this.editVisible = true
      getJobLog({ id: jobLogId }).then(res => {
        this.joblog = res.data
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
    // 确认删除任务日志
    confirmDeleteJobLogs() {
      this.$confirm('此操作将永久删除选中项, 是否继续?', '确认删除', {
        confirmButtonText: '确认删除',
        confirmButtonClass: 'msg-danger',
        cancelButtonText: '取消',
        cancelButtonClass: 'msg-cancel',
        type: 'warning'
      }).then(() => {
        this.handleDeleteJobLogs()
      })
    },
    // 处理删除任务日志
    handleDeleteJobLogs() {
      // 开启按钮loading
      this.deleteBatchLoading = true
      // 获得表格的选中行
      const ids = this.selectedLog.map(jobLog => jobLog.id)
      deleteJobLogs({ ids }).then(res => {
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
    handleJobLogChange(val) {
      this.selectedJobLog = val
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
