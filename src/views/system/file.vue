<template>
  <div class="app-container" :class="{'has-bulk':selectedFile.length > 0}">
    <div class="filter-wrapper">
      <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="文件名:" prop="query">
              <el-input v-model="query.query" placeholder="输入文件名称" @keyup.enter.native="handleQuery" />
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
                :default-time="['00:00:00', '23:59:59']"
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
    <div class="table-wrapper">
      <div class="toolbar-wrapper">
        <el-row :gutter="24" type="flex" justify="end">
          <el-col :span="12">
            <div class="tool-title">文件列表</div>
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
        @selection-change="handleFileChange"
      >
        <el-empty slot="empty" />
        <el-table-column type="selection" width="55" />
        <el-table-column prop="filename" label="文件名称" show-overflow-tooltip />
        <el-table-column prop="suffix" label="后缀" show-overflow-tooltip />
        <el-table-column prop="fileSize" label="文件大小" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip />
        <el-table-column prop="createUser" label="创建人id" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="confirmDeleteFiles([scope.row.id])">删除</el-button>
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
    <div v-show="selectedFile.length > 0" class="bulk-wrapper">
      <div class="bulk-col-left">
        <div class="bulk-desc">
          已选择&nbsp;<a>{{ selectedFile.length }}</a>&nbsp;项
        </div>
      </div>
      <div class="bulk-col-right">
        <el-button
          type="danger"
          plain
          size="small"
          icon="el-icon-delete"
          :loading="deleteBatchLoading"
          @click="confirmDeleteFiles(selectedFile.map(file => file.id))"
        >
          批量删除
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { createFile, deleteFiles, getFile, listFiles, updateFile } from '@/api/file'

export default {
  name: 'File',
  data() {
    return {
      // 查询表单的数据
      query: {
        pageNum: 1,
        pageSize: 10,
        query: null,
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
      // 新建文件的数据
      file: {
        filename: null,
        uniqueFilename: null,
        suffix: null,
        path: null,
        fileSize: null,
        createTime: null,
        createUser: null,
        updateTime: null,
        updateUser: null,
        remark: null
      },
      // 新建文件校验规则
      fileRules: {
        filename: [
          { required: true, message: '请输入文件名称', trigger: 'blur' }
        ]
      },
      // 主表格数据
      tableData: null,
      totalSize: 0,
      // 选中用户表的行
      selectedFile: [],
      // 一些涉及是否的状态
      createVisible: false,
      createNext: false,
      createLoading: false,
      tableLoading: false,
      deleteBatchLoading: false,
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
      listFiles(this.query).then(res => {
        this.tableData = res.data.rows
        this.totalSize = res.data.totalSize
      }).finally(() => {
        this.tableLoading = false
      })
    },
    editFile(fileId) {
      // 显示编辑对话框
      this.editVisible = true
      getFile({ id: fileId }).then(res => {
        this.file = res.data
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
    // 处理文件权限
    handleCreateFile() {
      this.$refs.fileForm.validate(valid => {
        if (valid) {
          // 新建按钮loading
          this.createLoading = true
          // 请求api
          createFile(this.file).then(res => {
            // 成功请求弹出提示
            this.$message({
              showClose: true,
              message: '创建成功',
              type: 'success'
            })
            // 判断是否需要继续新建下一条
            if (this.createNext) {
              // 是，重置form
              this.$refs.fileForm.resetFields()
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
    // 处理更新文件
    handleUpdateFile() {
      this.$refs.editFileForm.validate(valid => {
        if (valid) {
          this.createLoading = true
          updateFile(this.file).then(res => {
            this.editVisible = false
            this.handleQuery()
          }).finally(() => {
            this.createLoading = false
          })
        }
      })
    },
    // 确认删除文件
    confirmDeleteFiles(ids) {
      this.$confirm('此操作将永久删除选中项, 是否继续?', '确认删除', {
        confirmButtonText: '确认删除',
        confirmButtonClass: 'msg-danger',
        cancelButtonText: '取消',
        cancelButtonClass: 'msg-cancel',
        type: 'warning'
      }).then(() => {
        this.handleDeleteFiles(ids)
      })
    },
    // 处理删除文件
    handleDeleteFiles(ids) {
      // 开启按钮loading
      this.deleteBatchLoading = true
      deleteFiles({ ids }).then(res => {
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
    handleFileChange(val) {
      this.selectedFile = val
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
