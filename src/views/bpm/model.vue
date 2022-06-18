<template>
  <div class="app-container" :class="{'has-bulk':selectedRows.length > 0}">
    <div class="filter-wrapper">
      <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="模型名称:" prop="query">
              <el-input v-model="query.query" placeholder="输入关键字" @keyup.enter.native="handleQuery" />
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
            <div class="tool-title">模型列表</div>
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
            <!--            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              style="margin-left: 10px"
            >
              新增用户
            </el-button>-->
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
        <el-table-column prop="key" label="流程标识" show-overflow-tooltip />
        <el-table-column prop="name" label="名称" show-overflow-tooltip />
        <el-table-column prop="status" label="部署状态" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.deploymentId === null">
              <span class="badge-status-dot badge-status-error" />
              <span style="margin-left: 8px">未部署</span>
            </span>
            <span v-else>
              <span class="badge-status-dot badge-status-success" />
              <span style="margin-left: 8px">已部署</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本" width="70" show-overflow-tooltip />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作" width="140">
          <template slot-scope="scope">
            <el-button type="text" @click="editRow(scope.row.id)">设计</el-button>
            <el-button type="text" @click="handleDeployModel(scope.row.id)">部署</el-button>
            <el-button type="text" @click="confirmDeleteRows([scope.row.id])">删除</el-button>
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
          @click="confirmDeleteRows(selectedRows.map(row => row.id))"
        >
          批量操作
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { deleteModels, deployModel, listModels } from '@/api/bpm'

export default {
  name: 'Model',
  // 字典选项
  dicts: [],
  data() {
    return {
      // 查询表单的数据
      query: {
        pageNum: 1,
        pageSize: 10,
        query: null
      },
      // 主表格数据
      tableData: null,
      totalSize: 0,
      // 主表格选中的行
      selectedRows: [],
      // 一些涉及是否的状态
      tableLoading: false,
      deleteBatchLoading: false
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
      listModels(this.query).then(res => {
        this.tableData = res.data.rows
        this.totalSize = res.data.totalSize
      }).finally(() => {
        this.tableLoading = false
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
    // 确认删除
    confirmDeleteRows(ids) {
      this.$confirm('此操作将永久删除选中项, 是否继续?', '确认删除', {
        confirmButtonText: '确认删除',
        confirmButtonClass: 'msg-danger',
        cancelButtonText: '取消',
        cancelButtonClass: 'msg-cancel',
        type: 'warning'
      }).then(() => {
        this.handleDeleteRows(ids)
      })
    },
    // 处理删除
    handleDeleteRows(ids) {
      // 开启按钮loading
      this.deleteBatchLoading = true
      // 获得表格的选中行
      // const ids = this.selectedUser.map(user => user.id)
      deleteModels({ ids }).then(() => {
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
    editRow(id) {
      this.$router.push({
        name: 'Designer',
        query: {
          id: id
        }
      })
    },
    handleDeployModel(id) {
      deployModel({ id: id }).then(() => {
        // 成功请求弹出提示
        this.$message({
          showClose: true,
          message: '部署成功',
          type: 'success'
        })
        // 刷新表格数据
        this.handleQuery()
      })
    }
  }
}
</script>

<style scoped>

</style>
