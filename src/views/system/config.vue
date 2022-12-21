<!--suppress JSUnusedGlobalSymbols -->
<!--该页面是标准查询表格模板页面，新建类似页面的时候可以直接复制粘贴-->
<template>
  <div class="app-container" :class="{'has-bulk':selectedRows.length > 0}">
    <div class="filter-wrapper">
      <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="搜索项:" prop="cfgKey">
              <el-input v-model="query.cfgKey" placeholder="输入设置项Key" @keyup.enter.native="handleQuery" />
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
            <div class="tool-title">系统设置项</div>
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
              @click="show.create = true"
            >
              新增
            </el-button>
          </el-col>
        </el-row>
      </div>
      <!--suppress HtmlUnknownAttribute -->
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
        <el-table-column prop="cfgKey" label="键" show-overflow-tooltip />
        <el-table-column prop="cfgValue" label="值" show-overflow-tooltip />
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editCfg(scope.row)">编辑</el-button>
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
          :loading="loading.batchDelete"
          @click="confirmDeleteRows(selectedRows.map(i => i.id))"
        >
          批量删除
        </el-button>
      </div>
    </div>
    <div class="dialog-wrapper">
      <el-dialog
        title="新建设置"
        width="600px"
        :close-on-click-modal="false"
        :visible.sync="show.create"
        @close="resetForm('cfgForm')"
      >
        <el-form
          ref="cfgForm"
          label-width="auto"
          size="medium"
          label-position="top"
          :model="cfg"
          :rules="cfgRules"
        >
          <el-row :gutter="30">
            <el-col v-show="false" :span="24">
              <el-form-item label="id" prop="id">
                <el-input v-model="cfg.id" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设置项key" prop="cfgKey">
                <el-input v-model="cfg.cfgKey" placeholder="输入key" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设置项值" prop="cfgValue">
                <el-input v-model="cfg.cfgValue" placeholder="输入设置项值" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="cfg.remark" type="textarea" :rows="5" placeholder="输入备注" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-checkbox
            v-model="createNext"
            style="float: left;height: 36px;line-height: 36px;"
          >继续新建下一条</el-checkbox>
          <el-button size="medium" plain @click="show.create = false">取消</el-button>
          <el-button
            size="medium"
            type="primary"
            :loading="loading.create"
            @click="handleCreateCfg"
          >创建设置项</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="dialog-wrapper">
      <el-dialog
        title="编辑设置"
        width="600px"
        :close-on-click-modal="false"
        :visible.sync="show.update"
        @close="resetForm('cfgUpdateForm')"
      >
        <el-form
          ref="cfgUpdateForm"
          label-width="auto"
          size="medium"
          label-position="top"
          :model="cfg"
          :rules="cfgRules"
        >
          <el-row :gutter="30">
            <el-col v-show="false" :span="24">
              <el-form-item label="id" prop="id">
                <el-input v-model="cfg.id" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设置项key" prop="cfgKey">
                <el-input v-model="cfg.cfgKey" placeholder="输入key" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设置项值" prop="cfgValue">
                <el-input v-model="cfg.cfgValue" placeholder="输入设置项值" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="cfg.remark" type="textarea" :rows="5" placeholder="输入备注" />
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
            @click="handleUpdateCfg"
          >编辑</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { batchDeleteConfig, createConfig, listConfigs, updateConfig } from '@/api/config'

export default {
  name: 'Config',
  // 字典选项
  dicts: [],
  data() {
    return {
      // 查询表单的数据
      query: {
        pageNum: 1,
        pageSize: 10,
        cfgKey: null
      },
      // 主表格数据
      tableData: null,
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
      createNext: false,
      cfg: {
        id: null,
        cfgKey: null,
        cfgValue: null,
        remark: null
      },
      cfgRules: {
        cfgKey: [
          { required: true, message: '请输入设置项key', trigger: 'blur' }
        ],
        cfgValue: [
          { required: true, message: '请输入设置项val', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.handleQuery()
  },
  methods: {
    // 主表格查询
    handleQuery() {
      this.loading.table = true
      listConfigs(this.query).then(res => {
        this.tableData = res.data.rows
        this.totalSize = res.data.totalSize
      }).finally(() => {
        this.loading.table = false
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
    handleCreateCfg() {
      this.$refs.cfgForm.validate(valid => {
        if (valid) {
          // 新建按钮loading
          this.loading.create = true
          // 请求api
          createConfig(this.cfg).then(res => {
            // 成功请求弹出提示
            this.$message({
              showClose: true,
              message: '创建成功',
              type: 'success'
            })
            // 判断是否需要继续新建下一条
            if (this.createNext) {
              // 是，重置form
              this.$refs.cfgForm.resetFields()
            } else {
              // 否，关闭对话框
              this.show.create = false
              // 刷新表格数据
              this.handleQuery()
            }
          }).finally(() => {
            // 关闭loading效果
            this.loading.create = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleUpdateCfg() {
      this.$refs.cfgUpdateForm.validate(valid => {
        if (valid) {
          this.loading.update = true
          updateConfig(this.cfg).then(res => {
            this.$message({
              showClose: true,
              message: '更新成功',
              type: 'success'
            })
            this.show.update = false
            this.handleQuery()
          }).finally(() => {
            this.loading.update = false
          })
        }
      })
    },
    editCfg(row) {
      // console.log(row)
      this.show.update = true
      this.$nextTick(() => {
        this.cfg.id = row.id
        this.cfg.cfgKey = row.cfgKey
        this.cfg.cfgValue = row.cfgValue
        this.cfg.createTime = row.createTime
        this.cfg.remark = row.remark
      })
    },
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
    handleDeleteRows(ids) {
      // 开启按钮loading
      this.loading.batchDelete = true
      // 获得表格的选中行
      // const ids = this.selectedUser.map(user => user.id)
      batchDeleteConfig({ ids }).then(() => {
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
        this.loading.batchDelete = false
      })
    }
  }
}
</script>

<style scoped>

</style>
