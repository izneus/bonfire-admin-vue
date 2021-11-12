<template>
  <div class="app-container">
    <div class="content-main">
      <div class="search-bar">
        <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="角色名称:" prop="role">
                <el-input v-model="query.role" placeholder="输入角色名称" />
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
                :disabled="selectedRole.length < 1"
                @click="confirmDeleteRole"
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
              @click="createVisible = true"
            >
              新增角色
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="result-table">
        <el-table
          :data="tableData"
          style="width: 100%"
          show-overflow-tooltip="true"
          header-row-class-name="result-table-header"
          header-cell-class-name="result-table-header-cell"
          @selection-change="handleRoleChange"
        >
          <el-empty slot="empty" />
          <el-table-column type="selection" width="55" />
          <el-table-column prop="username" label="角色名" show-overflow-tooltip />
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="editRole(scope.row.id)">编辑</el-button>
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'Role',
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10,
        query: null
      },
      // 主表格数据
      tableData: null,
      totalSize: 0,
      // 选中角色表的行
      selectedRole: [],
      deleteBatchLoading: false,
    }
  },
  methods: {
    // 主表格查询
    handleQuery() {
      // 开启loading
      // this.tableLoading = true
      // listUsers(this.query).then(res => {
      //   this.tableData = res.data.rows
      //   this.totalSize = res.data.totalSize
      // }).finally(() => {
      //   this.tableLoading = false
      // })
    },
    // 清空表单内容
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleRoleChange(val) {
      this.selectedRole = val
    },
    editRole(roleId) {
      // 显示编辑对话框
      // this.editVisible = true
      // getUser({ id: userId }).then(res => {
      //   this.user = res.data
      // })
    },
    handleChangePageNum(val) {
      this.query.pageNum = val
      this.handleQuery()
    },
    handleChangePageSize(val) {
      this.query.pageSize = val
      this.handleQuery()
    },
    // 确认删除用户
    confirmDeleteRole() {
      this.$confirm('此操作将永久删除选中项, 是否继续?', '确认删除', {
        confirmButtonText: '确认删除',
        confirmButtonClass: 'msg-danger',
        cancelButtonText: '取消',
        cancelButtonClass: 'msg-cancel',
        type: 'warning'
      }).then(() => {
        this.handleDeleteRole()
      })
    },
    // 处理删除用户
    handleDeleteRole() {
    },
  }
}
</script>

<style scoped>

</style>
