<!--suppress JSUnusedGlobalSymbols -->
<!--该页面是标准查询表格模板页面，新建类似页面的时候可以直接复制粘贴-->
<template>
  <div class="app-container" :class="{'has-bulk':selectedRows.length > 0}">
    <div class="filter-wrapper">
      <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="用户名称:" prop="username">
              <el-input v-model="query.username" placeholder="输入用户名称" @keyup.enter.native="handleQuery" />
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
            <div class="tool-title">表格标题</div>
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
        @selection-change="handleRowChange"
      >
        <el-empty slot="empty" />
        <el-table-column type="selection" width="55" />
        <el-table-column prop="username" label="用户名" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作" />
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
  </div>
</template>

<script>
export default {
  name: 'SearchTableTemplate',
  // 字典选项
  dicts: [],
  data() {
    return {
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
      deleteBatchLoading: false
    }
  },
  created() {
    this.handleQuery()
  },
  methods: {
    // 主表格查询
    handleQuery() {
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
