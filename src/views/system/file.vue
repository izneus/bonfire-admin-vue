<template>
  <div class="app-container">
    <div class="content-main">
      <div class="search-bar">
        <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="文件名:" prop="filename">
                <el-input v-model="query.filename" placeholder="输入文件名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-button size="small" type="primary" @click="handleQuery">查 询</el-button>
              <el-button size="small" @click="resetForm('queryForm')">重 置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="tool-bar">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-button-group>
              <el-button
                size="small"
                plain
                icon="el-icon-delete"
                class="line-button-danger"
                :loading="deleteBatchLoading"
                :disabled="selectedFile.length < 1"
                @click="confirmDeleteFiles"
              >
                批量删除
              </el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </div>
      <div class="result-table">
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          style="width: 100%"
          show-overflow-tooltip="true"
          header-row-class-name="result-table-header"
          header-cell-class-name="result-table-header-cell"
          @selection-change="handleFileChange"
        >
          <el-empty slot="empty" />
          <el-table-column type="selection" width="55" />
          <el-table-column prop="filename" label="文件名称" show-overflow-tooltip />
          <el-table-column prop="uniqueFilename" label="哈希文件名称" show-overflow-tooltip />
          <el-table-column prop="suffix" label="后缀" show-overflow-tooltip />
          <el-table-column prop="path" label="文件路径" show-overflow-tooltip />
          <el-table-column prop="fileSize" label="文件大小" show-overflow-tooltip />
          <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip />
          <el-table-column prop="createUser" label="创建者" show-overflow-tooltip />
          <el-table-column prop="updateTime" label="更新时间" show-overflow-tooltip />
          <el-table-column prop="updateUser" label="更新者" show-overflow-tooltip />
          <el-table-column prop="remark" label="备注" show-overflow-tooltip />
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="editFile(scope.row.id)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="foot-bar" style="text-align: right;">
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
      <div class="dialog-wrapper">
        <el-dialog
          title="编辑文件"
          width="800px"
          :close-on-click-modal="false"
          :visible.sync="editVisible"
          @close="resetForm('editFileForm')"
        >
          <el-form
            ref="editFileForm"
            label-width="auto"
            size="medium"
            label-position="top"
            :model="file"
            :rules="fileRules"
          >
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="文件名称" prop="filename">
                  <el-input v-model="file.filename" placeholder="输入文件名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="哈希文件名称" prop="uniqueFilename">
                  <el-input v-model="file.uniqueFilename" placeholder="输入哈希文件名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="后缀" prop="suffix">
                  <el-input v-model="file.suffix" placeholder="输入后缀" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="文件路径" prop="path">
                  <el-input v-model="file.path" placeholder="输入文件路径" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="文件大小" prop="fileSize">
                  <el-input v-model="file.fileSize" placeholder="输入文件大小" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="创建时间" prop="createTime">
                  <el-input v-model="file.createTime" placeholder="输入创建时间" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="创建者" prop="createUser">
                  <el-input v-model="file.createUser" placeholder="输入创建者" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="更新时间" prop="updateTime">
                  <el-input v-model="file.updateTime" placeholder="输入更新时间" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="更新者" prop="updateUser">
                  <el-input v-model="file.updateUser" placeholder="输入更新者" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="file.remark" type="textarea" :rows="5" placeholder="输入备注" />
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
              @click="handleUpdateFile"
            >编辑文件</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { createFile, deleteFiles, getFile, listFiles, updateFile } from '@/api/file'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
export default {
  name: 'File',
  data() {
    return {
      // 查询表单的数据
      query: {
        pageNum: 1,
        pageSize: 10,
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
      resetPassBatchLoading: false,
      foldSearch: false,
      editVisible: false,
      getLoading: false,
      exportLoading: false,
      // 对话框类型，复用新增和编辑
      // dialogType: 'add'
      // upload组件用的几个参数
      authHeader: {
        Authorization: 'Bearer ' + getToken()
      },
      uploadUrl: process.env.VUE_APP_BASE_API + '/v1/file/upload'
    }
  },
  created() {
    // 进入页面第一次查询，为了演示无数据状态暂时注释，
    // 实际业务页面为了用户体验，进页面都要请求一次数据
    // this.handleQuery()
    // 得到完整数据
    // console.log(this.dict)
    // 打印简化后的label数据
    // console.log(this.dict.label.user_status)
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
    confirmDeleteFiles() {
      this.$confirm('此操作将永久删除选中项, 是否继续?', '确认删除', {
        confirmButtonText: '确认删除',
        confirmButtonClass: 'msg-danger',
        cancelButtonText: '取消',
        cancelButtonClass: 'msg-cancel',
        type: 'warning'
      }).then(() => {
        this.handleDeleteFiles()
      })
    },
    // 处理删除文件
    handleDeleteFiles() {
      // 开启按钮loading
      this.deleteBatchLoading = true
      // 获得表格的选中行
      const ids = this.selectedFile.map(file => file.id)
      deleteFiles({ ids }).then(res => {
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
    },
    handleFoldSearch() {
      this.foldSearch = !this.foldSearch
    },
    handleUploadError(err, file) {
      const e = JSON.parse(err.message)
      Message({
        message: '文件「' + file.name + '」上传失败，错误原因：' + e.message,
        type: 'error',
        duration: 5 * 1000
      })
    },
    handleUploadSuccess() {
      Message({
        message: '文件上传成功',
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>

<style scoped>

</style>
