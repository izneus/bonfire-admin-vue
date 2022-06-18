<template>
  <div class="app-container" :class="{'has-bulk':selectedRows.length > 0}">
    <div class="filter-wrapper">
      <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="用户名称:" prop="username">
              <el-input v-model="query.username" placeholder="输入用户名称" />
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
            <div class="tool-title">待办列表</div>
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
            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              style="margin-left: 10px"
              @click="showLeaveDialog"
            >
              发起请假
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
        @selection-change="handleRowChange"
      >
        <el-empty slot="empty" />
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" show-overflow-tooltip />
        <el-table-column prop="name" label="name" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleApprove(scope.row.id)">同意</el-button>
            <el-button type="text">拒绝</el-button>
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
    <div v-show="selectedRows.length > 0" class="bulk-wrapper">
      <div class="bulk-col-left">
        <div class="bulk-desc">
          已选择&nbsp;<a>{{ selectedRows.length }}</a>&nbsp;项
        </div>
      </div>
      <div class="bulk-col-right">
        <el-button
          type="danger"
          plain
          size="small"
          icon="el-icon-delete"
          :loading="deleteBatchLoading"
        >
          批量操作
        </el-button>
      </div>
    </div>
    <div class="dialog-wrapper">
      <el-dialog
        title="创建请假审批"
        width="40%"
        :close-on-click-modal="false"
        :visible.sync="leaveVisible"
        @close="resetForm('leaveForm')"
      >
        <el-form
          ref="leaveForm"
          label-width="auto"
          size="medium"
          label-position="top"
          :model="leave"
          :rules="leaveRules"
        >
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="开始时间" prop="startTime">
                <el-date-picker
                  v-model="leave.startTime"
                  type="datetime"
                  placeholder="选择开始时间"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间" prop="endTime">
                <el-date-picker
                  v-model="leave.endTime"
                  type="datetime"
                  placeholder="选择结束时间"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="请假原因" prop="reason">
                <el-input
                  v-model="leave.reason"
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
          <el-button size="medium" plain @click="leaveVisible = false">取消</el-button>
          <el-button
            size="medium"
            type="primary"
            :loading="leaveLoading"
            @click="handleCreateLeave"
          >发起请假</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {approveTodo, createLeave, listTodos} from '@/api/bpm'

export default {
  name: 'Todo',
  // 字典选项
  dicts: [],
  data() {
    return {
      leave: {
        startTime: null,
        endTime: null,
        reason: null
      },
      leaveRules: {
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '请填写请假原因', trigger: 'blur' }
        ]
      },
      // 查询表单的数据
      query: {
        pageNum: 1,
        pageSize: 10,
        username: null
      },
      // 主表格数据
      tableData: null,
      totalSize: 0,
      // 主表格选中的行
      selectedRows: [],
      // 一些涉及是否的状态
      tableLoading: false,
      deleteBatchLoading: false,
      leaveVisible: false,
      leaveLoading: false
    }
  },
  created() {
    this.handleQuery()
  },
  methods: {
    handleApprove(rowId){
      approveTodo({id: rowId}).then( ()=> {

      })
    },
    handleCreateLeave() {
      this.$refs.leaveForm.validate(valid => {
        if (valid) {
          this.leaveLoading = true
          createLeave(this.leave).then(() => {
            // 成功请求弹出提示
            this.$message({
              showClose: true,
              message: '创建成功',
              type: 'success'
            })
            this.leaveVisible = false
            // 刷新表格数据
            this.handleQuery()
          }).finally(() => {
            this.leaveLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showLeaveDialog() {
      this.leaveVisible = true
    },
    // 主表格查询
    handleQuery() {
      listTodos(this.query).then(res => {
        this.tableData = res.data.rows
        this.totalSize = res.data.totalSize
      })
    },
    // 清空表单内容
    resetForm(formName) {
      // noinspection JSUnresolvedFunction
      this.$refs[formName].resetFields()
    },
    // 处理表格选中变化
    handleRowChange(val) {
      this.selectedRows = val
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
