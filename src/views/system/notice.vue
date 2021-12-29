<template>
  <div class="app-container">
    <div class="content-main">
      <div class="search-bar">
        <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="通知标题:" prop="title">
                <el-input v-model="query.title" placeholder="输入通知标题" />
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
                :disabled="selectedNotice.length < 1"
                @click="confirmDeleteNotices"
              >
                批量删除
              </el-button>
            </el-button-group>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              @click="createNotice"
            >
              新增通知
            </el-button>
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
          @selection-change="handleNoticeChange"
        >
          <el-empty slot="empty" />
          <el-table-column type="selection" width="55" />
          <el-table-column prop="title" label="标题" show-overflow-tooltip />
          <el-table-column prop="notice" label="通知内容" show-overflow-tooltip />
          <el-table-column prop="noticeType" label="通知类型" show-overflow-tooltip />
          <el-table-column prop="remark" label="备注" show-overflow-tooltip />
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
          title="新建通知"
          width="800px"
          :close-on-click-modal="false"
          :visible.sync="createVisible"
          @close="resetForm('noticeForm')"
        >
          <el-form
            ref="noticeForm"
            label-width="auto"
            size="medium"
            label-position="top"
            :model="notice"
            :rules="noticeRules"
          >
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="标题" prop="title">
                  <el-input v-model="notice.title" placeholder="输入标题" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="通知内容" prop="notice">
                  <el-input v-model="notice.notice" placeholder="输入通知内容" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="通知类型">
                  <el-select v-model="notice.noticeType" placeholder="请选择通知类型" @change="tzlxChange">
                    <el-option label="全局通知" value="0" />
                    <el-option label="局部通知" value="1" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="isJbtz" :span="24" prop="toIds">
                <el-select
                  v-model="notice.toIds"
                  multiple
                  filterable
                  remote
                  placeholder="请输入用户名称关键词"
                  :remote-method="remoteMethod"
                  :loading="loading"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.username"
                    :label="item.username"
                    :value="item.id"
                    :name="toIds"
                  />
                </el-select>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="notice.remark" type="textarea" :rows="5" placeholder="输入备注" />
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
              @click="handleCreateNotice"
            >创建通知</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { createNotice, deleteNotices, listNotices } from '@/api/notice'
import { listUsers } from '@/api/user'
import { getToken } from '@/utils/auth'
export default {
  name: 'Notice',
  data() {
    return {
      // 查询表单的数据
      query: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        notice: null,
        noticeType: null,
        remark: null
      },
      // 新建通知的数据
      notice: {
        id: null,
        title: null,
        notice: null,
        noticeType: null,
        remark: null,
        toIds: []
      },
      // 新建通知校验规则
      noticeRules: {
        title: [
          { required: true, message: '请输入通知标题', trigger: 'blur' }
        ],
        notice: [
          { required: true, message: '请输入通知内容', trigger: 'blur' }
        ]
      },
      loading: false,
      // 所有用户列表
      userList: [],
      // 搜索到的下拉框中的用户选项
      options: [],
      // 主表格数据
      tableData: null,
      totalSize: 0,
      // 选中任务表的行
      selectedNotice: [],
      // 通知接受者的id
      toIds: [],
      // 是否为局部通知
      isJbtz: false,
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
      listNotices(this.query).then(res => {
        this.tableData = res.data.rows
        this.totalSize = res.data.totalSize
      }).finally(() => {
        this.tableLoading = false
      })
    },
    createNotice() {
      // 显示创建通知对话框
      this.createVisible = true
      listUsers({ ...this.query, pageSize: 50 }).then(res => {
        this.userList = res.data.rows
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.userList.filter(item => {
            return item.username.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    /* getDetail(row) {
      getUser({ id: row.id }).then(res => {
      })
    },*/
    // 清空表单内容
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 处理创建通知
    handleCreateNotice() {
      this.$refs.noticeForm.validate(valid => {
        if (valid) {
          // 新建按钮loading
          this.createLoading = true
          // 请求api
          createNotice(this.notice).then(res => {
            // 成功请求弹出提示
            this.$message({
              showClose: true,
              message: '创建成功',
              type: 'success'
            })
            // 判断是否需要继续新建下一条
            if (this.createNext) {
              // 是，重置form
              this.$refs.noticeForm.resetFields()
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
    // 判断是否选中的是局部通知
    tzlxChange(selectValue) {
      if (selectValue === '1') {
        this.isJbtz = true
      } else {
        this.isJbtz = false
      }
    },
    // 确认删除通知
    confirmDeleteNotices() {
      this.$confirm('此操作将永久删除选中项, 是否继续?', '确认删除', {
        confirmButtonText: '确认删除',
        confirmButtonClass: 'msg-danger',
        cancelButtonText: '取消',
        cancelButtonClass: 'msg-cancel',
        type: 'warning'
      }).then(() => {
        this.handleDeleteNotices()
      })
    },
    // 处理删除通知
    handleDeleteNotices() {
      // 开启按钮loading
      this.deleteBatchLoading = true
      // 获得表格的选中行
      const ids = this.selectedNotice.map(notice => notice.id)
      deleteNotices({ ids }).then(res => {
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
    // 处理通知选中变化
    handleNoticeChange(val) {
      this.selectedNotice = val
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
    }
  }
}
</script>

<style scoped>

</style>
