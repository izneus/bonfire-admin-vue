<template>
  <div class="app-container" style="height: calc(100vh - 80px)">
    <fc-designer ref="formDesigner" />
  </div>
</template>

<script>
export default {
  name: 'FormDesigner'
}
</script>

<style lang="scss" scoped>
::v-deep ._fc-designer {
  aside.el-aside {
    padding: 0 0;
    margin-bottom: 0;
    background-color: white;
  }
  ._fc-m {
    ._fc-m-tools {
      background-color: white;
    }
    main.el-main {
      padding: 10px 10px 0 10px!important;
      background-color: #f0f2f5!important;
    }

  }
}
</style>
