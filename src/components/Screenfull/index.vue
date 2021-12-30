<template>
  <div>
    <el-tooltip class="item" effect="dark" content="退出全屏" placement="top" popper-class="mini-tip">
      <i v-show="isFullscreen" class="ri-fullscreen-exit-line" @click="click" />
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="全屏显示" placement="top" popper-class="mini-tip">
      <i v-show="!isFullscreen" class="ri-fullscreen-line" @click="click" />
    </el-tooltip>
    <!--    <i class="ri-fullscreen-line" @click="click"></i>-->
    <!--    <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="click" />-->
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'Screenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off('change', this.change)
      }
    }
  }
}
</script>

<style scoped>
/*.screenfull-svg {*/
/*  display: inline-block;*/
/*  cursor: pointer;*/
/*  fill: #5a5e66;;*/
/*  width: 20px;*/
/*  height: 20px;*/
/*  vertical-align: 10px;*/
/*}*/
</style>
