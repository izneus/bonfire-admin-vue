<template>
  <div class="app-container" :class="{'has-bulk':selectedAuthority.length > 0}">
    <div class="table-wrapper">
      <div class="toolbar-wrapper">
        <el-row :gutter="24" type="flex" justify="end">
          <el-col :span="12">
            <div class="tool-title">权限列表</div>
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
              @click="createPrivilege(0)"
            >
              新增权限
            </el-button>
          </el-col>
        </el-row>
      </div>
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        style="width: 100%"
        row-key="id"
        show-overflow-tooltip="true"
        header-row-class-name="result-table-header"
        header-cell-class-name="result-table-header-cell"
      >
        <el-empty slot="empty" />
        <el-table-column prop="privName" label="权限名称" show-overflow-tooltip />
        <el-table-column prop="privKey" label="权限字符串" show-overflow-tooltip />
        <el-table-column prop="privType" label="权限类型" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.privType === '1'" size="small" type="success">
              {{ dict.label.privilege_type[scope.row.privType] }}
            </el-tag>
            <el-tag v-else size="small">{{ dict.label.privilege_type[scope.row.privType] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序号" show-overflow-tooltip />
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editPrivilege(scope.row)">编辑</el-button>
            <el-button type="text" @click="createPrivilege(scope.row.id)">添加子权限</el-button>
            <el-button type="text" @click="confirmDeletePrivilege(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="dialog-wrapper">
      <el-dialog
        title="新建权限"
        width="600px"
        :close-on-click-modal="false"
        :visible.sync="createVisible"
        @close="resetForm('privilegeForm')"
      >
        <el-form
          ref="privilegeForm"
          label-width="auto"
          size="medium"
          label-position="top"
          :model="privilege"
          :rules="privilegeRules"
        >
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="权限名称（中文）" prop="privName">
                <el-input v-model="privilege.privName" placeholder="输入权限名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="权限字符串（英文）" prop="privKey">
                <el-input v-model="privilege.privKey" placeholder="输入权限字符串" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="权限类型" prop="privType">
                <el-select v-model="privilege.privType" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="item in dict.privilege_type"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序号" prop="sort">
                <el-input-number
                  v-model="privilege.sort"
                  controls-position="right"
                  style="width: 100%"
                  placeholder="请输入排序号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input
                  v-model="privilege.remark"
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
            v-model="createNext"
            style="float: left;height: 36px;line-height: 36px;"
          >继续新建下一条</el-checkbox>
          <el-button size="medium" plain @click="createVisible = false">取消</el-button>
          <el-button
            size="medium"
            type="primary"
            :loading="createLoading"
            @click="handleCreateAuthority"
          >创建权限</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="dialog-wrapper">
      <el-dialog
        title="编辑权限"
        width="600px"
        :close-on-click-modal="false"
        :visible.sync="editVisible"
        @close="resetForm('editPrivilegeForm')"
      >
        <el-form
          ref="editPrivilegeForm"
          label-width="auto"
          size="medium"
          label-position="top"
          :model="privilege"
          :rules="privilegeRules"
        >
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="权限名称（中文）" prop="privName">
                <el-input v-model="privilege.privName" placeholder="输入权限名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="权限字符串（英文）" prop="privKey">
                <el-input v-model="privilege.privKey" placeholder="输入权限字符串" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="权限类型" prop="privType">
                <el-select v-model="privilege.privType" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="item in dict.privilege_type"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序号" prop="sort">
                <el-input-number
                  v-model="privilege.sort"
                  controls-position="right"
                  style="width: 100%"
                  placeholder="请输入排序号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input
                  v-model="privilege.remark"
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
          <el-button size="medium" plain @click="editVisible = false">取消</el-button>
          <el-button
            size="medium"
            type="primary"
            :loading="createLoading"
            @click="handleUpdatePrivilege"
          >编辑权限</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  createPriv,
  updatePrivilegeById,
  getPrivilegeTree, deletePrivilegeById
} from '@/api/privilege'
export default {
  name: 'Privilege',
  dicts: ['privilege_type'],
  data() {
    return {
      // 查询表单的数据
      query: {
        pageNum: 1,
        pageSize: 10,
        privName: null,
        remark: null
      },
      // 新建权限的数据
      privilege: {
        id: null,
        privName: null,
        privKey: null,
        remark: null,
        privType: null,
        parentId: null,
        sort: 0
      },
      // 新建权限校验规则
      privilegeRules: {
        privName: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        privKey: [
          { required: true, message: '请输入权限字符串', trigger: 'blur' }
        ],
        privType: [
          { required: true, message: '请输入权限类型', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请输入父级ID', trigger: 'blur' }
        ]
      },
      // 主表格数据
      tableData: null,
      totalSize: 0,
      // 选中用户表的行
      selectedAuthority: [],
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
      exportLoading: false
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
      getPrivilegeTree().then(res => {
        this.tableData = res.data.privilegeTree
      }).finally(() => {
        this.tableLoading = false
      })
    },
    editPrivilege(row) {
      // 显示编辑对话框
      this.editVisible = true
      // 预防修改默认值，造成新增等对话框form初始值不为空
      this.$nextTick(() => {
        this.privilege = { ...this.privilege, ...row }
      })
    },
    // 清空表单内容
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 处理创建权限
    handleCreateAuthority() {
      this.$refs.privilegeForm.validate(valid => {
        if (valid) {
          // 新建按钮loading
          this.createLoading = true
          // 请求api
          createPriv(this.privilege).then(() => {
            // 成功请求弹出提示
            this.$message({
              showClose: true,
              message: '创建成功',
              type: 'success'
            })
            // 判断是否需要继续新建下一条
            if (this.createNext) {
              // 是，重置form
              this.$refs.privilegeForm.resetFields()
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
    // 处理更新权限
    handleUpdatePrivilege() {
      this.$refs.editPrivilegeForm.validate(valid => {
        if (valid) {
          this.createLoading = true
          updatePrivilegeById(this.privilege).then(() => {
            this.editVisible = false
            this.handleQuery()
          }).finally(() => {
            this.createLoading = false
          })
        }
      })
    },
    createPrivilege(parentId) {
      // 显示创建用户对话框
      this.createVisible = true
      // 设置新增节点的父节点id
      this.privilege.parentId = parentId
    },
    // 确认删除权限
    confirmDeletePrivilege(id) {
      this.$confirm('此操作将永久删除选中项, 是否继续?', '确认删除', {
        confirmButtonText: '确认删除',
        confirmButtonClass: 'msg-danger',
        cancelButtonText: '取消',
        cancelButtonClass: 'msg-cancel',
        type: 'warning'
      }).then(() => {
        this.handleDeletePrivilege(id)
      })
    },
    // 处理删除权限
    handleDeletePrivilege(id) {
      // 开启按钮loading
      this.deleteBatchLoading = true
      // 获得表格的选中行
      // const ids = this.selectedAuthority.map(authority => authority.id)
      deletePrivilegeById({ id }).then(() => {
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
    }
  }
}
</script>

<style scoped>
>>> .is-controls-right .el-input__inner {
  text-align: left;
}
</style>
