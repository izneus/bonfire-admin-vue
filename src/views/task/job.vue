<template>
  <div class="app-container" :class="{'has-bulk':selectedJob.length > 0}">
    <div class="filter-wrapper">
      <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="任务名称:" prop="jobName">
              <el-input v-model="query.jobName" placeholder="输入任务名称" />
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
            <div class="tool-title">任务列表</div>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              @click="createVisible = true"
            >
              新增任务
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
        cell-class-name="result-table-cell"
        @selection-change="handleJobChange"
      >
        <el-empty slot="empty" />
        <el-table-column type="selection" width="55" />
        <el-table-column prop="jobName" label="任务名称" show-overflow-tooltip />
        <el-table-column prop="cron" label="cron表达式" show-overflow-tooltip />
        <el-table-column prop="prevRunTime" label="上次运行时间" show-overflow-tooltip />
        <el-table-column prop="durationMillis" label="运行时长(毫秒)" align="right" show-overflow-tooltip />
        <el-table-column prop="nextRunTime" label="下次运行时间" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === '0'" size="small">
              {{ dict.label.job_status[scope.row.status] }}
            </el-tag>
            <el-tag v-else size="small" type="danger">{{ dict.label.job_status[scope.row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="250px">
          <template slot-scope="scope">
            <el-button type="text" @click="editJob(scope.row.id)">编辑</el-button>
            <el-button type="text" @click="runJobOnce(scope.row.id)">立即执行一次</el-button>
            <el-button type="text" @click="showLatestJobLogDialog(scope.row.id)">最新日志</el-button>
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
    <div v-show="selectedJob.length > 0" class="bulk-wrapper">
      <div class="bulk-col-left">
        <div class="bulk-desc">
          已选择&nbsp;<a>{{ selectedJob.length }}</a>&nbsp;项
        </div>
      </div>
      <div class="bulk-col-right">
        <el-button
          size="small"
          plain
          icon="el-icon-delete"
          class="line-button-danger"
          :loading="deleteBatchLoading"
          :disabled="selectedJob.length < 1"
          @click="confirmDeleteJobs"
        >
          批量删除
        </el-button>
        <el-button
          size="small"
          plain
          icon="el-icon-refresh-left"
          class="line-button-danger"
          :loading="batchResumeLoading"
          :disabled="selectedJob.length < 1"
          @click="handleResumeJobs"
        >
          批量恢复
        </el-button>
        <el-button
          size="small"
          plain
          icon="el-icon-video-pause"
          class="line-button-danger"
          :loading="batchPauseLoading"
          :disabled="selectedJob.length < 1"
          @click="handlePauseJobs"
        >
          批量暂停
        </el-button>
      </div>
    </div>
    <div class="dialog-wrapper">
      <el-dialog
        title="新建任务"
        width="800px"
        :close-on-click-modal="false"
        :visible.sync="createVisible"
        @close="resetForm('jobForm')"
      >
        <el-form
          ref="jobForm"
          label-width="auto"
          size="medium"
          label-position="top"
          :model="job"
          :rules="jobRules"
        >
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="任务名称" prop="jobName">
                <el-input v-model="job.jobName" placeholder="输入任务名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="调度分组" prop="jobGroup">
                <el-input v-model="job.jobGroup" placeholder="输入调度分组" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="调度类" prop="jobClass">
                <el-input v-model="job.jobClass" placeholder="输入调度类" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="调度方法" prop="jobMethod">
                <el-input v-model="job.jobMethod" placeholder="输入调度方法" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="cron 表达式" prop="cron">
                <el-input v-model="job.cron" placeholder="输入cron 表达式" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="方法的参数" prop="param">
                <el-input v-model="job.param" placeholder="输入方法参数" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务状态" prop="status">
                <!--                <el-input v-model="job.status" placeholder="输入任务状态" />-->
                <el-select
                  v-model="job.status"
                  clearable
                  placeholder="选择任务状态"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in dict.job_status"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input
                  v-model="job.remark"
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
            @click="handleCreateJob"
          >创建任务</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="dialog-wrapper">
      <el-dialog
        title="编辑任务"
        width="800px"
        :close-on-click-modal="false"
        :visible.sync="editVisible"
        @close="resetForm('editJobForm')"
      >
        <el-form
          ref="editJobForm"
          label-width="auto"
          size="medium"
          label-position="top"
          :model="job"
          :rules="jobRules"
        >
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="任务名称" prop="jobName">
                <el-input v-model="job.jobName" placeholder="输入任务名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="调度分组" prop="jobGroup">
                <el-input v-model="job.jobGroup" placeholder="输入调度分组" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="调度类" prop="jobClass">
                <el-input v-model="job.jobClass" placeholder="输入调度类" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="调度方法" prop="jobMethod">
                <el-input v-model="job.jobMethod" placeholder="输入调度方法" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="cron 表达式" prop="cron">
                <el-input v-model="job.cron" placeholder="输入cron 表达式" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="方法的参数" prop="param">
                <el-input v-model="job.param" placeholder="输入方法参数" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务状态" prop="status">
                <el-select
                  v-model="job.status"
                  clearable
                  placeholder="选择任务状态"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in dict.job_status"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input
                  v-model="job.remark"
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
          <el-button size="medium" plain @click="editVisible = false">取消</el-button>
          <el-button
            size="medium"
            type="primary"
            :loading="createLoading"
            @click="handleUpdateJob"
          >编辑任务</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="dialog-wrapper">
      <el-dialog
        title="最后运行日志"
        width="600px"
        :close-on-click-modal="false"
        :visible.sync="logVisible"
      >
        <el-descriptions :column="2">
          <el-descriptions-item label="执行时间">{{ jobLog.createTime }}</el-descriptions-item>
          <el-descriptions-item label="运行结果">
            <el-tag v-if="jobLog.status === '0'" size="small">
              {{ dict.label.job_log_status[jobLog.status] }}
            </el-tag>
            <el-tag v-else size="small" type="danger">{{ dict.label.job_log_status[jobLog.status] }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="调度类">{{ jobLog.jobClass }}</el-descriptions-item>
          <el-descriptions-item label="调服方法">{{ jobLog.jobMethod }}</el-descriptions-item>
          <el-descriptions-item label="参数">{{ jobLog.param }}</el-descriptions-item>

          <el-descriptions-item label="执行耗时">{{ jobLog.durationMillis }}</el-descriptions-item>
          <el-descriptions-item label="消息">{{ jobLog.message }}</el-descriptions-item>
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
import {
  createJob,
  deleteJobs,
  getJob,
  listJobs,
  updateJob,
  pauseJobs,
  resumeJobs,
  runOnce,
  getLatestJobLog
} from '@/api/job'
export default {
  name: 'Job',
  dicts: ['job_status', 'job_log_status'],
  data() {
    return {
      // 查询表单的数据
      query: {
        pageNum: 1,
        pageSize: 10,
        jobName: null,
        remark: null
      },
      // 新建任务的数据
      job: {
        id: null,
        jobName: null,
        remark: null,
        cron: null,
        jobClass: null,
        jobGroup: null,
        jobMethod: null,
        param: null,
        status: null
      },
      jobLog: {
        id: null,
        jobId: null,
        jobClass: null,
        jobMethod: null,
        param: null,
        status: null,
        message: null,
        durationMillis: null,
        createTime: null
      },
      // 新建任务校验规则
      jobRules: {
        jobName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        jobGroup: [
          { required: true, message: '请输入任务分组', trigger: 'blur' }
        ],
        jobClass: [
          { required: true, message: '请输入调度类', trigger: 'blur' }
        ],
        jobMethod: [
          { required: true, message: '请输入调度方法', trigger: 'blur' }
        ],
        cron: [
          { required: true, message: '请输入cron表达式', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择任务初始状态', trigger: 'blur' }
        ]
      },
      // 主表格数据
      tableData: null,
      totalSize: 0,
      // 选中任务表的行
      selectedJob: [],
      // 一些涉及是否的状态
      logVisible: false,
      createVisible: false,
      createNext: false,
      createLoading: false,
      tableLoading: false,
      deleteBatchLoading: false,
      batchPauseLoading: false,
      batchResumeLoading: false,
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
      listJobs(this.query).then(res => {
        this.tableData = res.data.rows
        this.totalSize = res.data.totalSize
      }).finally(() => {
        this.tableLoading = false
      })
    },
    editJob(jobId) {
      // 显示编辑对话框
      this.editVisible = true
      getJob({ id: jobId }).then(res => {
        this.job = res.data
      })
    },
    runJobOnce(jobId) {
      runOnce({ id: jobId }).then(res => {
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
    // 处理创建任务
    handleCreateJob() {
      this.$refs.jobForm.validate(valid => {
        if (valid) {
          // 新建按钮loading
          this.createLoading = true
          // 请求api
          createJob(this.job).then(res => {
            // 成功请求弹出提示
            this.$message({
              showClose: true,
              message: '创建成功',
              type: 'success'
            })
            // 判断是否需要继续新建下一条
            if (this.createNext) {
              // 是，重置form
              this.$refs.jobForm.resetFields()
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
    // 处理更新任务
    handleUpdateJob() {
      this.$refs.editJobForm.validate(valid => {
        if (valid) {
          this.createLoading = true
          updateJob(this.job).then(res => {
            this.editVisible = false
            this.handleQuery()
          }).finally(() => {
            this.createLoading = false
          })
        }
      })
    },
    // 确认删除任务
    confirmDeleteJobs() {
      this.$confirm('此操作将永久删除选中项, 是否继续?', '确认删除', {
        confirmButtonText: '确认删除',
        confirmButtonClass: 'msg-danger',
        cancelButtonText: '取消',
        cancelButtonClass: 'msg-cancel',
        type: 'warning'
      }).then(() => {
        this.handleDeleteJobs()
      })
    },
    // 处理删除任务
    handleDeleteJobs() {
      // 开启按钮loading
      this.deleteBatchLoading = true
      // 获得表格的选中行
      const ids = this.selectedJob.map(job => job.id)
      deleteJobs({ ids }).then(res => {
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
    // 处理暂停任务
    handlePauseJobs() {
      // 开启按钮loading
      this.batchPauseLoading = true
      // 获得表格的选中行
      const ids = this.selectedJob.map(job => job.id)
      pauseJobs({ ids }).then(res => {
        // 成功请求弹出提示
        this.$message({
          showClose: true,
          message: '批量暂停成功',
          type: 'success'
        })
        // 刷新表格数据
        this.handleQuery()
      }).finally(() => {
        // 关闭按钮loading
        this.batchPauseLoading = false
      })
    },
    // 处理恢复任务
    handleResumeJobs() {
      // 开启按钮loading
      this.batchResumeLoading = true
      // 获得表格的选中行
      const ids = this.selectedJob.map(job => job.id)
      resumeJobs({ ids }).then(res => {
        // 成功请求弹出提示
        this.$message({
          showClose: true,
          message: '批量恢复成功',
          type: 'success'
        })
        // 刷新表格数据
        this.handleQuery()
      }).finally(() => {
        // 关闭按钮loading
        this.batchResumeLoading = false
      })
    },
    // 处理任务选中变化
    handleJobChange(val) {
      this.selectedJob = val
    },
    handleChangePageNum(val) {
      this.query.pageNum = val
      this.handleQuery()
    },
    handleChangePageSize(val) {
      this.query.pageSize = val
      this.handleQuery()
    },
    showLatestJobLogDialog(jobId) {
      this.logVisible = true
      getLatestJobLog({ id: jobId }).then(res => {
        this.jobLog = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
