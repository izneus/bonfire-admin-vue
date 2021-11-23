<template>
  <div class="app-container">
    <div class="content-main">
      <div class="search-bar">
        <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="字典类型:" prop="dictType">
                <el-input v-model="query.dictType" placeholder="输入字典类型" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="字典标签:" prop="dictLabel">
                <el-input v-model="query.dictLabel" placeholder="输入字典标签" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="字典状态:" prop="status">
                <el-select
                  v-model="query.status"
                  clearable
                  placeholder="选择字典状态"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in dict.dict_status"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
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
              新增字典
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
          <el-table-column prop="dictType" label="字典类型" show-overflow-tooltip />
          <el-table-column prop="dictValue" label="字典值" show-overflow-tooltip />
          <el-table-column prop="dictLabel" label="字典标签" show-overflow-tooltip />
          <el-table-column prop="status" label="字典状态" show-overflow-tooltip />
          <el-table-column prop="dictSort" label="字典排序" show-overflow-tooltip />
          <el-table-column prop="remark" label="备注" show-overflow-tooltip />
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
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="user.username" placeholder="输入用户名" suffix-icon="el-icon-user" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户状态" prop="status">
                  <el-select
                    v-model="user.status"
                    clearable
                    placeholder="选择用户状态"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in dict.user_status"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="昵称" prop="nickname">
                  <el-input v-model="user.nickname" placeholder="输入昵称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="姓名" prop="fullname">
                  <el-input v-model="user.fullname" placeholder="输入姓名" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号码" prop="mobile">
                  <el-input v-model="user.mobile" placeholder="输入手机号码" suffix-icon="el-icon-phone-outline" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="电子邮件" prop="email">
                  <el-input v-model="user.email" placeholder="输入电子邮件地址" suffix-icon="el-icon-message" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="user.remark" type="textarea" :rows="5" placeholder="输入备注" />
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
              @click="handleCreateUser"
            >创建用户</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { listDicts } from '@/api/dict'

export default {
  name: 'Dict',
  dicts: ['dict_status'],
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10,
        dictType: null,
        dictLabel: null,
        status: null
      },
      // 主表格数据
      tableData: null,
      totalSize: 0,
      // 选中角色表的行
      selectedRole: [],
      deleteBatchLoading: false,
      createVisible: false,
      dict: {
        id: null,
        dictType: null,
        dictValue: null,
        dictLabel: null,
        dictSort: null,
        remark: null,
        status: null
      },
      dictRules: {}
    }
  },
  created() {
    this.handleQuery()
  },
  methods: {
    // 主表格查询
    handleQuery() {
      listDicts(this.query).then(res => {
        this.tableData = res.data.rows
        this.totalSize = res.data.totalSize
      })
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
    }
  }
}
</script>

<style scoped>

</style>
