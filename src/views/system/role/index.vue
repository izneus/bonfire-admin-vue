<template>
  <div class="app-container">
    <div class="content-main">
      <div class="search-bar">
        <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="用户名称:" prop="username">
                <el-input v-model="query.username" placeholder="输入用户名称" />
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
                :disabled="selectedUser.length < 1"
                @click="confirmDeleteUsers"
              >
                批量删除
              </el-button>
              <el-button
                size="small"
                icon="el-icon-download"
                plain
              >
                导入模板下载
              </el-button>
              <el-button
                size="small"
                plain
              >
                <svg-icon icon-class="import" />
                导入
              </el-button>
              <el-button
                size="small"
                plain
              >
                <svg-icon icon-class="export" />
                导出
              </el-button>
              <el-button
                size="small"
                plain
                :disabled="selectedUser.length < 1"
                :loading="resetPassBatchLoading"
                @click="confirmResetPassBatch"
              >
                批量重置密码
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
              新增用户
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
          @selection-change="handleUserChange"
        >
          <el-empty slot="empty" />
          <el-table-column type="selection" width="55" />
          <el-table-column prop="username" label="用户名" show-overflow-tooltip />
          <el-table-column prop="nickname" label="昵称" show-overflow-tooltip />
          <el-table-column prop="fullname" label="全名" show-overflow-tooltip />
          <el-table-column prop="email" label="邮件" show-overflow-tooltip />
          <el-table-column prop="mobile" label="手机" show-overflow-tooltip />
          <el-table-column prop="remark" label="备注" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag size="small">{{ dict.label.user_status[scope.row.status] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="getDetail(scope.row)">查看</el-button>
              <el-button type="text">编辑</el-button>
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
          @size-change="changePageSize"
          @current-change="changePageNum"
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
      }
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
