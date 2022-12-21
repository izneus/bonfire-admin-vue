<!--suppress JSUnusedGlobalSymbols -->
<!--该页面是标准查询表格模板页面，新建类似页面的时候可以直接复制粘贴，其他类似业务可参考@views/system/user.vue，即用户页面-->
<template>
  <div class="app-container" :class="{'has-bulk':selectedRows.length > 0}">
    <div class="filter-wrapper">
      <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="查询字段:" prop="query">
              <el-input v-model="query.query" placeholder="输入查询关键词" @keyup.enter.native="handleQueryClick" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button size="small" type="primary" @click="handleQueryClick">查 询</el-button>
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
                @click="handleQueryClick"
              />
            </el-tooltip>
            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              style="margin-left: 10px"
              @click="handleShowCreateClick"
            >
              新增
            </el-button>
          </el-col>
        </el-row>
      </div>
      <el-table
        v-loading="loading.table"
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
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEditRowClick(scope.row.id)">编辑</el-button>
            <el-button type="text" @click="handleShowDeleteClick([scope.row.id])">删除</el-button>
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
          @size-change="handlePageSizeChange"
          @current-change="handlePageNumChange"
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
          :loading="loading.batchDelete"
          @click="handleShowDeleteClick(selectedRows.map(row => row.id))"
        >
          批量删除
        </el-button>
      </div>
    </div>
    <div class="dialog-wrapper">
      <el-dialog
        title="新建"
        width="50%"
        :close-on-click-modal="false"
        :visible.sync="show.create"
        @close="resetForm('createForm')"
      >
        <el-form
          ref="createForm"
          label-width="auto"
          size="medium"
          label-position="top"
          :model="entity"
          :rules="entityRules"
        >
          <el-row :gutter="30">
            <el-col v-show="false" :span="24">
              <el-form-item label="用户id" prop="id">
                <el-input v-model="entity.id" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="entity.username" placeholder="输入用户名" suffix-icon="el-icon-user" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input
                  v-model="entity.remark"
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
            v-model="check.createNext"
            style="float: left;height: 36px;line-height: 36px;"
          >继续新建下一条</el-checkbox>
          <el-button size="medium" plain @click="show.create = false">取消</el-button>
          <el-button
            size="medium"
            type="primary"
            :loading="loading.create"
            @click="handleCreateClick"
          >新增</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="dialog-wrapper">
      <el-dialog
        title="编辑"
        width="50%"
        :close-on-click-modal="false"
        :visible.sync="show.update"
        @close="resetForm('updateForm')"
      >
        <el-form
          ref="updateForm"
          label-width="auto"
          size="medium"
          label-position="top"
          :model="entity"
          :rules="entityRules"
        >
          <el-row :gutter="30">
            <el-col v-show="false" :span="24">
              <el-form-item label="用户id" prop="id">
                <el-input v-model="entity.id" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="entity.username" placeholder="输入用户名" suffix-icon="el-icon-user" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input
                  v-model="entity.remark"
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
          <el-button size="medium" plain @click="show.update = false">取消</el-button>
          <el-button
            size="medium"
            type="primary"
            :loading="loading.update"
            @click="handleUpdateClick"
          >编辑</el-button>
        </span>
      </el-dialog>
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
        query: null
      },
      // 页面实体数据
      entity: {
        username: null,
        remark: null
      },
      // 页面实体数据校验规则
      entityRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      },
      // 主表格数据
      tableData: [{ username: 'xxx' }],
      totalSize: 0,
      // 主表格选中的行
      selectedRows: [],
      // 是否显示loading
      loading: {
        table: false,
        batchDelete: false,
        create: false,
        update: false
      },
      // 是否显示元素
      show: {
        create: false,
        update: false
      },
      // 其他一些选择类杂项
      check: {
        createNext: false
      }
    }
  },
  created() {
    this.handleQueryClick()
  },
  methods: {
    // 清空表单内容
    resetForm(formName) {
      // noinspection JSUnresolvedFunction
      this.$refs[formName].resetFields()
    },
    // 主表格查询
    handleQueryClick() {
      // 开启loading
      // this.loading.table = true
      // listXXX(this.query).then(res => {
      //   this.tableData = res.data.rows
      //   this.totalSize = res.data.totalSize
      // }).finally(() => {
      //   this.tableLoading = false
      // })
    },
    // 处理表格选中行变化
    handleRowChange(val) {
      this.selectedRows = val
    },
    // 处理分页页码变化
    handlePageNumChange(val) {
      this.query.pageNum = val
      this.handleQueryClick()
    },
    // 处理每个分页大小变化
    handlePageSizeChange(val) {
      this.query.pageSize = val
      this.handleQueryClick()
    },
    // 表格头部工具栏点击新增按钮
    handleShowCreateClick() {
      this.show.create = true
    },
    handleEditRowClick(rowId) {
      this.show.update = true
      // rowId获取行数据详情
      // getXXX({ id: rowId }).then(res => {
      //   this.entity = res.data
      // })
    },
    handleShowDeleteClick(rowIds) {
      // 危险操作弹窗提示
      this.$confirm('此操作将永久删除选中项, 是否继续?', '确认删除', {
        confirmButtonText: '确认删除',
        confirmButtonClass: 'msg-danger',
        cancelButtonText: '取消',
        cancelButtonClass: 'msg-cancel',
        type: 'warning'
      }).then(() => {
        this.handleBatchDeleteClick(rowIds)
      }).catch(() => {
        // 取消删除
      })
    },
    // 确定批量删除
    handleBatchDeleteClick(ids) {
      this.loading.batchDelete = true
      // 批量删除ids
      // 获得表格的选中行
      // batchDeleteXXX({ ids }).then(() => {
      //   // 成功请求弹出提示
      //   this.$message({
      //     showClose: true,
      //     message: '删除成功',
      //     type: 'success'
      //   })
      //   // 刷新表格数据
      //   this.handleQueryClick()
      // }).finally(() => {
      //   // 关闭按钮loading
      //   this.loading.batchDelete = false
      // })
    },
    handleCreateClick() {
      // this.$refs.createForm.validate(valid => {
      //   if (valid) {
      //     // 新建按钮loading
      //     this.loading.create = true
      //     // 请求api
      //     createXXX(this.entity).then(() => {
      //       // 成功请求弹出提示
      //       this.$message({
      //         showClose: true,
      //         message: '创建成功',
      //         type: 'success'
      //       })
      //       // 判断是否需要继续新建下一条
      //       if (this.check.createNext) {
      //         // 是，重置form
      //         this.$refs.createForm.resetFields()
      //       } else {
      //         // 否，关闭对话框
      //         this.show.create = false
      //       }
      //     }).finally(() => {
      //       // 关闭loading效果
      //       this.loading.create = false
      //       // 刷新表格数据
      //       this.handleQueryClick()
      //     })
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    },
    handleUpdateClick() {
      // this.$refs.updateForm.validate(valid => {
      //   if (valid) {
      //     this.loading.update = true
      //     updateXXX(this.entity).then(() => {
      //       this.$message({
      //         showClose: true,
      //         message: '更新成功',
      //         type: 'success'
      //       })
      //       this.show.update = false
      //       this.handleQueryClick()
      //     }).finally(() => {
      //       this.loading.update = false
      //     })
      //   }
      // })
    }
  }
}
</script>

<style scoped>

</style>
