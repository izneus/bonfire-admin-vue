<template>
  <div class="app-container" :class="{'has-bulk':selectedRole.length > 0}">
    <div class="filter-wrapper">
      <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="角色名称:" prop="roleName">
              <el-input v-model="query.roleName" placeholder="输入角色名称" />
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
            <div class="tool-title">角色列表</div>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              @click="createRole"
            >
              新增角色
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
        @selection-change="handleRoleChange"
      >
        <el-empty slot="empty" />
        <el-table-column type="selection" width="55" />
        <el-table-column prop="roleName" label="角色名称" show-overflow-tooltip />
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editRole(scope.row.id)">编辑</el-button>
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
    <div v-show="selectedRole.length > 0" class="bulk-wrapper">
      <div class="bulk-col-left">
        <div class="bulk-desc">
          已选择&nbsp;<a>{{ selectedRole.length }}</a>&nbsp;项
        </div>
      </div>
      <div class="bulk-col-right">
        <el-button
          size="small"
          plain
          icon="el-icon-delete"
          class="line-button-danger"
          :loading="deleteBatchLoading"
          :disabled="selectedRole.length < 1"
          @click="confirmDeleteRoles"
        >
          批量删除
        </el-button>
      </div>
    </div>
    <div class="dialog-wrapper">
      <el-dialog
        title="新建角色"
        width="600px"
        :close-on-click-modal="false"
        :visible.sync="createVisible"
        @close="resetForm('roleForm')"
      >
        <el-form
          ref="roleForm"
          label-width="auto"
          size="medium"
          label-position="top"
          :model="role"
          :rules="roleRules"
        >
          <el-row :gutter="30">
            <el-col :span="24">
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="role.roleName" placeholder="输入角色名称" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input
                  v-model="role.remark"
                  type="textarea"
                  :rows="5"
                  maxlength="200"
                  show-word-limit
                  placeholder="输入备注"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="权限名称" prop="authorityIds">
                <el-tree
                  ref="privilegeTree"
                  :data="privilegeTreeData"
                  show-checkbox
                  :props="defaultProps"
                  node-key="id"
                  :default-expanded-keys="['0']"
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
            @click="handleCreateRole"
          >创建角色</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="dialog-wrapper">
      <el-dialog
        title="编辑角色"
        width="600px"
        :close-on-click-modal="false"
        :visible.sync="editVisible"
        @close="resetForm('editRoleForm')"
      >
        <el-form
          ref="editRoleForm"
          label-width="auto"
          size="medium"
          label-position="top"
          :model="role"
          :rules="roleRules"
        >
          <el-row :gutter="30">
            <el-col :span="24">
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="role.roleName" placeholder="输入角色名称" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input
                  v-model="role.remark"
                  type="textarea"
                  :rows="5"
                  maxlength="200"
                  show-word-limit
                  placeholder="输入备注"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="权限名称" prop="authorityIds">
                <el-tree
                  ref="privilegeTreeEdit"
                  :data="privilegeTreeData"
                  show-checkbox
                  :props="defaultProps"
                  node-key="id"
                  :default-checked-keys="role.privilegeIds"
                  :default-expanded-keys="['0']"
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
            @click="handleUpdateRole"
          >编辑角色</el-button>
        </span>
      </el-dialog>
    </div>
<!--    <div class="dialog-wrapper">
      <el-dialog
        title="设置权限"
        width="600px"
        :close-on-click-modal="false"
        :visible.sync="setVisible"
        @close="resetForm('setAuthForm')"
      >
        <el-form
          ref="setAuthForm"
          label-width="auto"
          size="medium"
          label-position="top"
          :model="roleAuth"
          :rules="roleAuthRules"
        >
          <el-col :span="24">
            <el-form-item label="权限名称" prop="authorityIds">
              &lt;!&ndash;绑定用户已有权限&ndash;&gt;
              &lt;!&ndash; checkbox &ndash;&gt;
              &lt;!&ndash;                            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
              <el-checkbox-group v-model="roleAuth.authorityIds">
                <el-checkbox v-for="data in checkList" :key="data.id" :label="data.privName" name="authorityIds" style="display:block">
                  <p>{{ data.privName }}</p>
                  <el-checkbox-group v-model="roleAuth.authorityIds" style="float: left">
                    <el-checkbox v-for="data in data.children" :key="data.id" :label="data.privName" name="authorityIds" style="display:block;">
                      <p>{{ data.privName }}</p>
                      <el-checkbox-group v-model="roleAuth.authorityIds" style="float:left;">
                        <el-checkbox v-for="data in data.children" :key="data.id" :label="data.privName" name="authorityIds">
                          {{ data.privName }}
                        </el-checkbox>
                      </el-checkbox-group>
                    </el-checkbox>
                  </el-checkbox-group>
                </el-checkbox>
              </el-checkbox-group>&ndash;&gt;
              &lt;!&ndash;树形&ndash;&gt;
              <el-tree
                ref="organizationData"
                :data="privilegeTreeData"
                show-checkbox
                :props="defaultProps"
                node-key="id"
                :default-checked-keys="roleAuth.privilegeIds"
              />
            </el-form-item></el-col>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" plain @click="setVisible = false">取消</el-button>
          <el-button
            size="medium"
            type="primary"
            :loading="createLoading"
            @click="handleSetRoleAuth"
          >设置权限</el-button>
        </span>
      </el-dialog>
    </div>-->
  </div>
</template>

<script>
import { createRole, deleteRoles, getRole, listRoles, updateRole } from '@/api/role'
import { getPrivilegeTree } from '@/api/privilege'

export default {
  name: 'Role',
  data() {
    return {
      // 查询表单的数据
      query: {
        pageNum: 1,
        pageSize: 10,
        roleName: null,
        remark: null
      },
      // 新建角色的数据
      role: {
        id: null,
        roleName: null,
        remark: null,
        authorityIds: []
      },
      // 设置角色的数据
      roleAuth: {
        id: null,
        roleName: null,
        remark: null,
        privilegeIds: []
      },
      // 新建角色校验规则
      roleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        privilegeIds: [
          { type: 'array', required: true, message: '请至少选择一个权限', trigger: 'change' }
        ]
      },
      // 设置角色权限校验规则
      roleAuthRules: {
        privilegeIds: [
          { type: 'array', required: true, message: '请至少选择一个权限', trigger: 'change' }
        ]
      },
      // 主表格数据
      tableData: null,
      totalSize: 0,
      // 复选框数据
      checkList: [],
      // 选中角色表的行
      selectedRole: [],
      // 一些涉及是否的状态
      createVisible: false,
      createNext: false,
      createLoading: false,
      tableLoading: false,
      deleteBatchLoading: false,
      editVisible: false,
      setVisible: false,
      // 全选
      checkAll: false,
      checkedCities: [],
      isIndeterminate: false,
      // 树形
      checkAll2: false,
      // 树形权限数据
      privilegeTreeData: [],
      // children和label与接口字段保持一致
      defaultProps: {
        children: 'children',
        label: 'privName'
      }
    }
  },
  created() {
    // 加载所有角色权限
    getPrivilegeTree().then(res => {
      this.checkList = res.data.privilegeTree
      // 给树添加一个所有权限的root节点，方便/反选全选所有权限
      this.privilegeTreeData = [{
        id: '0',
        privName: '所有权限',
        children: res.data.privilegeTree
      }]
    })
  },
  methods: {
    // 主表格查询
    handleQuery() {
      // 开启loading
      this.tableLoading = true
      listRoles(this.query).then(res => {
        this.tableData = res.data.rows
        this.totalSize = res.data.totalSize
      }).finally(() => {
        this.tableLoading = false
      })
    },
    createRole() {
      // 显示创建角色对话框
      this.createVisible = true
    },
    editRole(roleId) {
      // 显示编辑对话框
      this.editVisible = true
      getRole({ id: roleId }).then(res => {
        this.role = res.data
        // 暂时注释
        /* this.role.id = res.data.id
        this.role.remark = res.data.remark
        this.role.roleName = res.data.roleName
        this.role.privilegeIds = res.data.privilegeIds == null ? [] : res.data.privilegeIds*/
      })
    },
    // 清空表单内容
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 处理创建角色
    handleCreateRole() {
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          // 新建按钮loading
          this.createLoading = true
          // 请求api
          const checkedKeys = this.$refs.privilegeTree.getCheckedKeys()
          this.role.privilegeIds = checkedKeys
          createRole(this.role).then(res => {
            // 成功请求弹出提示
            this.$message({
              showClose: true,
              message: '创建成功',
              type: 'success'
            })
            // 判断是否需要继续新建下一条
            if (this.createNext) {
              // 是，重置form
              this.$refs.roleForm.resetFields()
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
    // 处理更新角色
    handleUpdateRole() {
      this.$refs.editRoleForm.validate(valid => {
        if (valid) {
          this.createLoading = true
          const checkedKeys = this.$refs.privilegeTreeEdit.getCheckedKeys()
          this.role.privilegeIds = checkedKeys
          updateRole(this.role).then(res => {
            this.editVisible = false
            this.handleQuery()
          }).finally(() => {
            this.createLoading = false
          })
        }
      })
    },
    // 处理设置角色权限
    handleSetRoleAuth() {
      this.$refs.setAuthForm.validate(valid => {
        if (valid) {
          this.createLoading = true
          const checkedKeys = this.$refs.organizationData.getCheckedKeys()
          this.roleAuth.privilegeIds = checkedKeys
          // console.log(checkedKeys)
          updateRole(this.roleAuth).then(res => {
            this.setVisible = false
            this.handleQuery()
          }).finally(() => {
            this.createLoading = false
          })
        }
      })
    },
    // 确认删除角色
    confirmDeleteRoles() {
      this.$confirm('此操作将永久删除选中项, 是否继续?', '确认删除', {
        confirmButtonText: '确认删除',
        confirmButtonClass: 'msg-danger',
        cancelButtonText: '取消',
        cancelButtonClass: 'msg-cancel',
        type: 'warning'
      }).then(() => {
        this.handleDeleteRoles()
      })
    },
    // 处理删除角色
    handleDeleteRoles() {
      // 开启按钮loading
      this.deleteBatchLoading = true
      // 获得表格的选中行
      const ids = this.selectedRole.map(role => role.id)
      deleteRoles({ ids }).then(res => {
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
    // 处理角色选中变化
    handleRoleChange(val) {
      this.selectedRole = val
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
