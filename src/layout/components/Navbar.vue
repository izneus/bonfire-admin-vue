<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <!--    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />-->
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!--        <search id="header-search" class="right-menu-item" />-->
        <!--        <error-log class="errLog-container right-menu-item hover-effect" />-->
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <!--        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">-->
        <!--          <size-select id="size-select" class="right-menu-item hover-effect" />-->
        <!--        </el-tooltip>-->
        <!--        <lang-select class="right-menu-item hover-effect" />-->
      </template>
      <i class="ri-notification-2-line right-menu-item hover-effect" />
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <i class="ri-user-line" />
          <span class="user-name">{{ name }}</span>
          <!--          <img src="" class="user-avatar" alt="">-->
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" style="width: 200px;">
          <!--          <router-link to="/profile/index">
            <el-dropdown-item>
              {{ $t('navbar.profile') }}
            </el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{ $t('navbar.github') }}
            </el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>-->
          <el-dropdown-item>
            <div style="display: flex">
              <i class="ri-profile-line" style="flex: 1;" />
              <span style="flex: 9;">个人中心</span>
            </div>
          </el-dropdown-item>
          <el-dropdown-item @click.native="dialogFormVisible = true">
            <div style="display: flex">
              <i class="ri-lock-2-line" style="flex: 1;" />
              <span style="flex: 9;">修改密码</span>
            </div>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <div style="display: flex">
              <i class="ri-logout-box-r-line" style="flex: 1;" />
              <span style="flex: 9;">{{ $t('navbar.logOut') }}</span>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="修改密码"
      width="400px"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      append-to-body
      @close="resetForm('pwdForm')"
    >
      <el-form
        ref="pwdForm"
        label-width="auto"
        size="medium"
        label-position="top"
        :model="pwd"
        :rules="pwdRules"
      >
        <el-row :gutter="30">
          <el-col :span="24">
            <el-form-item label="当前密码" prop="currentPassword">
              <el-input v-model="pwd.currentPassword" placeholder="输入当前密码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="pwd.newPassword" placeholder="输入新密码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input v-model="pwd.confirmPassword" placeholder="再次输入新密码" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" plain @click="dialogFormVisible = false">取消</el-button>
        <el-button
          size="medium"
          type="primary"
          :loading="changeLoading"
          @click="changePassword"
        >修改密码</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import { changePassword } from '@/api/me'
import { validPassword } from '@/utils/validate'
// import SizeSelect from '@/components/SizeSelect'
// import LangSelect from '@/components/LangSelect'
// import Search from '@/components/HeaderSearch'

export default {
  components: {
    // Breadcrumb,
    Hamburger,
    // ErrorLog,
    Screenfull
    // SizeSelect,
    // LangSelect,
    // Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'name'
    ])
  },
  data() {
    const pwd = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error('密码必须包含大小写字母和数字，长度为8～16'))
      } else {
        callback()
      }
    }
    return {
      pwd: {},
      dialogFormVisible: false,
      pwdRules: {
        currentPassword: [{ required: true, trigger: 'blur', validator: pwd }],
        newPassword: [{ required: true, trigger: 'blur', validator: pwd }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: pwd }]
      },
      changeLoading: false
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    changePassword() {
      this.$refs.pwdForm.validate(valid => {
        if (valid) {
          if (this.pwd.newPassword === this.pwd.confirmPassword) {
            this.changeLoading = true
            changePassword(this.pwd).then(res => {
              this.dialogFormVisible = false
            }).finally(() => {
              this.changeLoading = false
            })
          } else {
            this.$notify({
              title: '警告',
              message: '新密码两次不一致',
              type: 'warning'
            })
          }
        }
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 清空表单内容
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 40px;
  overflow: hidden;
  position: relative;
  background: #fff;
  //box-shadow: 0 1px 4px rgba(0,21,41,.08);
  //box-shadow: 0 10px 10px -10px #ccc;
  border-bottom: 1px solid #f0f2f5;

  .hamburger-container {
    font-size: 18px;
    line-height: 40px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 40px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        //margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }

        .user-name {
          font-size: 14px;
          float: right;
          margin-left: 2px;
          max-width: 100px;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
