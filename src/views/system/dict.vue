<template>
  <div class="app-container" :class="{'has-bulk':selectedDict.length > 0}">
    <div class="filter-wrapper">
      <el-form ref="queryForm" label-width="80px" label-position="left" size="small" :model="query">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="字典类型:" prop="dictType">
              <el-input v-model="query.dictType" placeholder="输入字典类型" @keyup.enter.native="handleQuery" />
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
            <div class="tool-title">字典列表</div>
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
        cell-class-name="result-table-cell"
        @selection-change="handleDictChange"
      >
        <el-empty slot="empty" />
        <el-table-column type="selection" width="55" />
        <el-table-column prop="dictType" label="字典类型" show-overflow-tooltip />
        <el-table-column prop="dictValue" label="字典值" show-overflow-tooltip />
        <el-table-column prop="dictLabel" label="字典标签" show-overflow-tooltip />
        <el-table-column prop="status" label="字典状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === '0'" size="small">
              {{ dict.label.dict_status[scope.row.status] }}
            </el-tag>
            <el-tag v-else size="small" type="danger">{{ dict.label.dict_status[scope.row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="dictSort" label="排序号" show-overflow-tooltip />
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editDict(scope.row.id)">编辑</el-button>
            <el-button type="text" @click="confirmDeleteDicts([scope.row.id])">删除</el-button>
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
          type="danger"
          plain
          size="small"
          icon="el-icon-delete"
          :loading="deleteBatchLoading"
          :disabled="selectedDict.length < 1"
          @click="confirmDeleteDicts(selectedDict.map(d => d.id))"
        >
          批量删除
        </el-button>
      </div>
    </div>
    <div class="dialog-wrapper">
      <el-dialog
        title="新建字典"
        width="600px"
        :close-on-click-modal="false"
        :visible.sync="createVisible"
        @close="resetForm('dictForm')"
      >
        <el-form
          ref="dictForm"
          label-width="auto"
          size="medium"
          label-position="top"
          :model="dictEntity"
          :rules="dictRules"
        >
          <el-row :gutter="30">
            <el-col v-show="false" :span="24">
              <el-form-item label="id" prop="id">
                <el-input v-model="dictEntity.id" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="字典类型" prop="dictType">
                <el-input v-model="dictEntity.dictType" placeholder="输入字典类型" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="字典值" prop="dictValue">
                <el-input v-model="dictEntity.dictValue" placeholder="输入字典值" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="字典标签" prop="dictLabel">
                <el-input v-model="dictEntity.dictLabel" placeholder="输入字典标签" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="字典状态" prop="status">
                <el-select
                  v-model="dictEntity.status"
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
            <el-col :span="12">
              <el-form-item label="排序号" prop="dictSort">
                <el-input v-model="dictEntity.dictSort" placeholder="输入排序号" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="dictEntity.remark" type="textarea" :rows="5" placeholder="输入备注" />
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
        width="600px"
        :close-on-click-modal="false"
        :visible.sync="editVisible"
        @close="resetForm('editDictForm')"
      >
        <el-form
          ref="editDictForm"
          label-width="auto"
          size="medium"
          label-position="top"
          :model="dictEntity"
          :rules="dictRules"
        >
          <el-row :gutter="30">
            <el-col v-show="false" :span="24">
              <el-form-item label="id" prop="id">
                <el-input v-model="dictEntity.id" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="字典类型" prop="dictType">
                <el-input v-model="dictEntity.dictType" placeholder="输入字典类型" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="字典值" prop="dictValue">
                <el-input v-model="dictEntity.dictValue" placeholder="输入字典值" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="字典标签" prop="dictLabel">
                <el-input v-model="dictEntity.dictLabel" placeholder="输入字典标签" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="字典状态" prop="status">
                <el-select
                  v-model="dictEntity.status"
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
            <el-col :span="12">
              <el-form-item label="排序号" prop="dictSort">
                <el-input v-model="dictEntity.dictSort" placeholder="输入排序号" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="dictEntity.remark" type="textarea" :rows="5" placeholder="输入备注" />
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
export default {
  name: 'Dict',
  dicts: ['dict_status'],
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
      dictEntity: {
        id: null,
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
        this.dictEntity = res.data
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
          console.log(this.dictEntity)
          createDict(this.dictEntity).then(res => {
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
          updateDict(this.dictEntity).then(res => {
            this.editVisible = false
            this.handleQuery()
          }).finally(() => {
            this.createLoading = false
          })
        }
      })
    },
    // 确认删除字典
    confirmDeleteDicts(ids) {
      this.$confirm('此操作将永久删除选中项, 是否继续?', '确认删除', {
        confirmButtonText: '确认删除',
        confirmButtonClass: 'msg-danger',
        cancelButtonText: '取消',
        cancelButtonClass: 'msg-cancel',
        type: 'warning'
      }).then(() => {
        this.handleDeleteDicts(ids)
      })
    },
    // 处理删除字典
    handleDeleteDicts(ids) {
      // 开启按钮loading
      this.deleteBatchLoading = true
      // 获得表格的选中行
      deleteDicts({ ids }).then(res => {
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
    // 处理选中变化
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
    }
  }
}
</script>

<style scoped>

</style>
