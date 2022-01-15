<template>
  <div class="app-container" :class="{'has-bulk':selectedDict.length > 0}">
    <div class="filter-wrapper">
      <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="字典类型:" prop="dictType">
              <el-input v-model="query.dictType" placeholder="输入字典类型" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button size="small" type="primary" @click="handleQuery">查 询</el-button>
            <el-button size="small" @click="resetForm('queryForm')">重 置</el-button>
          </el-col>
        </el-row>
        <el-row v-show="foldSearch" :gutter="24">
          <el-col :span="6">
            <el-form-item label="测试选项:">
              <el-input placeholder="输入测试选项" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="测试选项:">
              <el-input placeholder="输入测试选项" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="测试选项:">
              <el-input placeholder="输入测试选项" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table-wrapper">
      <div class="toolbar-wrapper">
        <el-row :gutter="24" type="flex" justify="end">
          <el-col :span="12">
            <div class="tool-title">字典列表</div>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              @click="createVisible = true"
            >
              新增字典
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
        @selection-change="handleDictChange"
      >
        <el-empty slot="empty" />
        <el-table-column type="selection" width="55" />
        <el-table-column prop="dictType" label="字典类型" show-overflow-tooltip />
        <el-table-column prop="dictValue" label="字典值" show-overflow-tooltip />
        <el-table-column prop="dictLabel" label="字典标签" show-overflow-tooltip />
        <el-table-column prop="status" label="字典状态" show-overflow-tooltip />
        <el-table-column prop="dictSort" label="排序号" show-overflow-tooltip />
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editDict(scope.row.id)">编辑</el-button>
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
    <div v-show="selectedDict.length > 0" class="bulk-wrapper">
      <div class="bulk-col-left">
        <div class="bulk-desc">
          已选择&nbsp;<a>{{ selectedDict.length }}</a>&nbsp;项
        </div>
      </div>
      <div class="bulk-col-right">
        <el-button
          size="small"
          plain
          icon="el-icon-delete"
          class="line-button-danger"
          :loading="deleteBatchLoading"
          :disabled="selectedDict.length < 1"
          @click="confirmDeleteDicts"
        >
          批量删除
        </el-button>
      </div>
    </div>
    <div class="dialog-wrapper">
      <el-dialog
        title="新建字典"
        width="800px"
        :close-on-click-modal="false"
        :visible.sync="createVisible"
        @close="resetForm('dictForm')"
      >
        <el-form
          ref="dictForm"
          label-width="auto"
          size="medium"
          label-position="top"
          :model="dict"
          :rules="dictRules"
        >
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="字典类型" prop="dictType">
                <el-input v-model="dict.dictType" placeholder="输入字典类型" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="字典值" prop="dictValue">
                <el-input v-model="dict.dictValue" placeholder="输入字典值" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="字典标签" prop="dictLabel">
                <el-input v-model="dict.dictLabel" placeholder="输入字典标签" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="字典状态" prop="status">
                <el-input v-model="dict.status" placeholder="输入字典状态" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序号" prop="dictSort">
                <el-input v-model="dict.dictSort" placeholder="输入排序号" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="dict.remark" type="textarea" :rows="5" placeholder="输入备注" />
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
            @click="handleCreateDict"
          >创建字典</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="dialog-wrapper">
      <el-dialog
        title="编辑字典"
        width="800px"
        :close-on-click-modal="false"
        :visible.sync="editVisible"
        @close="resetForm('editDictForm')"
      >
        <el-form
          ref="editDictForm"
          label-width="auto"
          size="medium"
          label-position="top"
          :model="dict"
          :rules="dictRules"
        >
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="字典类型" prop="dictType">
                <el-input v-model="dict.dictType" placeholder="输入字典类型" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="字典值" prop="dictValue">
                <el-input v-model="dict.dictValue" placeholder="输入字典值" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="字典标签" prop="dictLabel">
                <el-input v-model="dict.dictLabel" placeholder="输入字典标签" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="字典状态" prop="status">
                <el-input v-model="dict.status" placeholder="输入字典状态" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序号" prop="dictSort">
                <el-input v-model="dict.dictSort" placeholder="输入排序号" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="dict.remark" type="textarea" :rows="5" placeholder="输入备注" />
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
            @click="handleUpdateDict"
          >编辑字典</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { createDict, deleteDicts, getDict, listDicts, updateDict } from '@/api/dict'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
export default {
  name: 'Dict',
  data() {
    return {
      // 查询表单的数据
      query: {
        pageNum: 1,
        pageSize: 10,
        dictType: null,
        dictValue: null,
        dictLabel: null,
        status: null,
        dictSort: null,
        remark: null
      },
      // 新建字典的数据
      dict: {
        dictType: null,
        dictValue: null,
        dictLabel: null,
        status: null,
        dictSort: null,
        remark: null
      },
      // 新建字典校验规则
      dictRules: {
        dictType: [
          { required: true, message: '请输入字典类型', trigger: 'blur' }
        ],
        dictValue: [
          { required: true, message: '请输入字典值', trigger: 'blur' }
        ],
        dictLabel: [
          { required: true, message: '请输入字典标签', trigger: 'blur' }
        ]
      },
      // 主表格数据
      tableData: null,
      totalSize: 0,
      // 选中用户表的行
      selectedDict: [],
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
      listDicts(this.query).then(res => {
        this.tableData = res.data.rows
        this.totalSize = res.data.totalSize
      }).finally(() => {
        this.tableLoading = false
      })
    },
    editDict(dictId) {
      // 显示编辑对话框
      this.editVisible = true
      getDict({ id: dictId }).then(res => {
        this.dict = res.data
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
    // 处理创建字典
    handleCreateDict() {
      this.$refs.dictForm.validate(valid => {
        if (valid) {
          // 新建按钮loading
          this.createLoading = true
          // 请求api
          createDict(this.dict).then(res => {
            // 成功请求弹出提示
            this.$message({
              showClose: true,
              message: '创建成功',
              type: 'success'
            })
            // 判断是否需要继续新建下一条
            if (this.createNext) {
              // 是，重置form
              this.$refs.dictForm.resetFields()
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
    // 处理更新字典
    handleUpdateDict() {
      this.$refs.editDictForm.validate(valid => {
        if (valid) {
          this.createLoading = true
          updateDict(this.dict).then(res => {
            this.editVisible = false
            this.handleQuery()
          }).finally(() => {
            this.createLoading = false
          })
        }
      })
    },
    // 确认删除字典
    confirmDeleteDicts() {
      this.$confirm('此操作将永久删除选中项, 是否继续?', '确认删除', {
        confirmButtonText: '确认删除',
        confirmButtonClass: 'msg-danger',
        cancelButtonText: '取消',
        cancelButtonClass: 'msg-cancel',
        type: 'warning'
      }).then(() => {
        this.handleDeleteDicts()
      })
    },
    // 处理删除字典
    handleDeleteDicts() {
      // 开启按钮loading
      this.deleteBatchLoading = true
      // 获得表格的选中行
      const ids = this.selectedDict.map(dict => dict.id)
      deleteDicts({ ids }).then(res => {
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
    handleDictChange(val) {
      this.selectedDict = val
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
