<template>
  <div style="width: 100vw; height: 100vh; background-color: #F1F2F6;">
    <div class="login-card">
      <div style="flex: 623;">
        <el-image
          :src="require('@/assets/login.png')"
          fit="fill"
          style="width: 100%;height: 567px;display: block;border-radius: 20px;"
        />
      </div>
      <div style="flex: 385">
        <div class="login-container" style="padding: 50px 50px">
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            autocomplete="on"
            label-position="left"
          >

            <div class="title-container">
              <h3 class="title">
                欢迎，请登录
              </h3>
            <!--        <lang-select class="set-language" />-->
            </div>

            <el-form-item prop="username">
              <span class="svg-container">
                <!-- <svg-icon icon-class="user" />-->
                <i class="ri-user-2-line" style="font-size: 16px;" />
              </span>
              <el-input
                ref="username"
                v-model="loginForm.username"
                :placeholder="$t('login.username')"
                name="username"
                type="text"
                tabindex="1"
                autocomplete="on"
              />
            </el-form-item>

            <el-tooltip v-model="capsTooltip" content="大写字母锁定已开启" placement="right" manual>
              <el-form-item prop="password">
                <span class="svg-container">
                  <!-- <svg-icon icon-class="password" />-->
                  <i class="ri-lock-password-line" style="font-size: 16px" />
                </span>
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  :placeholder="$t('login.password')"
                  name="password"
                  tabindex="2"
                  autocomplete="on"
                  @keyup.native="checkCapslock"
                  @blur="capsTooltip = false"
                  @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                  <!-- <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />-->
                  <i :class="passwordType === 'password' ? 'ri-eye-off-line' : 'ri-eye-line'" />
                </span>
              </el-form-item>
            </el-tooltip>

            <el-row :gutter="16">
              <el-col :span="14">
                <el-form-item prop="captcha">
                  <span class="svg-container">
                    <!-- <svg-icon icon-class="password" />-->
                    <i class="ri-shield-cross-line" style="font-size: 16px" />
                  </span>
                  <el-input
                    ref="captcha"
                    v-model="loginForm.captcha"
                    name="captcha"
                    tabindex="3"
                    auto-complete="off"
                    placeholder="验证码"
                    @keyup.enter.native="handleLogin"
                  >
                  <!--                  <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />-->
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-image
                  :loading="captchaLoading"
                  :src="captchaImage"
                  style="width: 100%; height: 42px; float: right;border-radius: 5px;"
                  @click="setCaptchaImage"
                />
              </el-col>
            </el-row>

            <el-button
              :loading="loading"
              type="primary"
              style="width:100%;margin-bottom:30px;height: 40px;background-color: #2A99E6;border-radius: 5px;"
              @click.native.prevent="handleLogin"
            >
              {{ $t('login.logIn') }}
            </el-button>

          </el-form>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validPassword, validUsername } from '@/utils/validate'
import { getCaptcha } from '@/api/user'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('用户名必须为6-20位，包含字母和数字'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error('密码必须包含小写字母、大写字母和数字，长度为8～16'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin1',
        password: 'Admin123',
        captcha: '',
        captchaId: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        captcha: [{ required: true, trigger: 'blur', message: '验证码不能为空' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      captchaImage: '',
      captchaLoading: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.setCaptchaImage()
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    setCaptchaImage() {
      this.captchaLoading = true
      getCaptcha().then(resp => {
        this.captchaImage = resp.data.captcha
        this.loginForm.captchaId = resp.data.id
      }).finally(() => {
        this.captchaLoading = false
      })
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              // this.$router.push({ path: '/' })

              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<!--<style lang="scss">-->

<!--</style>-->

<style lang="scss">
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 40px;
    width: 60%;

    input {
      background: #ffffff;
      border: none;
      //-webkit-appearance: none;
      border-radius: 5px;
      padding: 12px 5px 12px 15px;
      color: #333;
      height: 40px;
      //caret-color: $cursor;

      &:-webkit-autofill {
        //box-shadow: 0 0 0px 1000px $bg inset !important;
        //-webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #e8e8e8;
    background: #ffffff;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
//$bg: #2d3a4b;
//$dark_gray: #889aa4;
//$light_gray: #eee;

.login-card {
  //width: 100vw;
  //height: 100vh;
  width: 1008px;
  height: 567px;
  position: absolute;
  margin: 0 auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  //width: 1200px;
  //max-height: 742px;
  background-color: #ffffff;
  box-shadow: 28px 41px 65px -3px rgba(0, 79, 190, 0.33);
  border-radius: 20px;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;
}

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: #ffffff;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 100%;
    height: 100%;
    //width: 400px;
    //max-width: 100%;
    //padding: 160px 35px 0;
    //margin: auto;
    overflow: hidden;
    //left: 0;
    //right: 0;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 0 5px 0 15px;
    color: #666666;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #000000;
      margin: 0 auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 2px;
    font-size: 16px;
    color: #666666;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
