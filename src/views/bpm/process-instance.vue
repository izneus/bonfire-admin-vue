<template>
  <div class="app-container" :class="{'has-bulk':selectedRows.length > 0}">
    <div class="filter-wrapper">
      <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="发起人:" prop="startUser">
              <el-input v-model="query.startUser" placeholder="输入发起人username" @keyup.enter.native="handleQuery" />
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
            <div class="tool-title">实例列表</div>
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
        <el-table-column prop="name" label="流程名称" show-overflow-tooltip />
        <el-table-column prop="startUser" label="发起人" show-overflow-tooltip />
        <el-table-column prop="startTime" label="发起时间" width="180" show-overflow-tooltip />
        <el-table-column prop="isEnded" label="流程状态" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.isEnded === true">
              <span class="badge-status-dot badge-status-success" />
              <span style="margin-left: 8px">已结束</span>
            </span>
            <span v-else>
              <span class="badge-status-dot badge-status-processing" />
              <span style="margin-left: 8px">进行中</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="text" @click="handleShowBpmn(scope.row.id)">流程图</el-button>
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
        title="流程图"
        width="61.8%"
        :close-on-click-modal="false"
        :visible.sync="showBpmn"
      >
        <div style="height: 400px">
          <my-process-viewer
            key="viewer"
            :bpmn-xml="bpmnXml"
            :activity-ids="activityIds"
          />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" type="primary" @click="showBpmn = false">关闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getProcessInstance, listProcessInstances } from '@/api/bpm'

export default {
  name: 'ProcessInstance',
  // 字典选项
  dicts: [],
  data() {
    return {
      bpmnXml: null,
      activityIds: null,
      // 查询表单的数据
      query: {
        pageNum: 1,
        pageSize: 10,
        startUser: null
      },
      // 主表格数据
      tableData: null,
      totalSize: 0,
      // 主表格选中的行
      selectedRows: [],
      // 一些涉及是否的状态
      tableLoading: false,
      deleteBatchLoading: false,
      showBpmn: false
    }
  },
  created() {
    this.handleQuery()
  },
  methods: {
    // 主表格查询
    handleQuery() {
      listProcessInstances(this.query).then(res => {
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
    },
    handleShowBpmn(rowId) {
      // 获取xmlString
      getProcessInstance({ id: rowId }).then(res => {
        this.bpmnXml = res.data.bpmnXml
        this.activityIds = res.data.activityIds
        this.showBpmn = true
      })
      // 获取历史流程
    }
  }
}
</script>

<style scoped>
>>> .el-dialog__body {
  padding: 0 0!important;
}
</style>

