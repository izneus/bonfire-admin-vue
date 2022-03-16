<!--suppress JSUnresolvedVariable -->
<template>
  <div class="app-container">
    <div class="filter-wrapper">
      <!--      <p>-->
      <!--        <el-button @click="setLoading">点我重新加载</el-button>-->
      <!--      </p>-->
      <el-skeleton :loading="loading" animated>
        <template slot="template">
          <el-skeleton-item
            variant="h3"
            style="width: 80px"
          />
          <div style="padding: 15px 4px 0;">
            <el-skeleton-item variant="h3" style="width: 20%;" />
            <el-skeleton-item variant="h3" style="width: 20%;margin-left: 192px" />
            <el-skeleton-item variant="h3" style="width: 20%;margin-left: 192px" />
          </div>
          <div style="padding: 15px 4px 0;">
            <el-skeleton-item variant="h3" style="width: 20%;" />
            <el-skeleton-item variant="h3" style="width: 20%;margin-left: 192px" />
          </div>
          <el-divider />
          <el-skeleton-item
            variant="h3"
            style="width: 80px"
          />
          <div style="padding: 15px 4px 0;">
            <el-skeleton-item variant="h3" style="width: 20%;" />
            <el-skeleton-item variant="h3" style="width: 20%;margin-left: 192px" />
            <el-skeleton-item variant="h3" style="width: 20%;margin-left: 192px" />
          </div>
          <div style="padding: 15px 4px 0;">
            <el-skeleton-item variant="h3" style="width: 20%;" />
            <el-skeleton-item variant="h3" style="width: 20%;margin-left: 192px" />
            <el-skeleton-item variant="h3" style="width: 20%;margin-left: 192px" />
          </div>
          <div style="padding: 15px 4px 0;">
            <el-skeleton-item variant="h3" style="width: 20%;" />
          </div>
          <el-divider />
          <el-skeleton-item
            variant="h3"
            style="width: 80px"
          />
          <div style="padding: 15px 4px 0;">
            <el-skeleton-item variant="h3" style="width: 20%;" />
            <el-skeleton-item variant="h3" style="width: 20%;margin-left: 192px" />
            <el-skeleton-item variant="h3" style="width: 20%;margin-left: 192px" />
          </div>
          <div style="padding: 15px 4px 0;">
            <el-skeleton-item variant="h3" style="width: 20%;" />
            <el-skeleton-item variant="h3" style="width: 20%;margin-left: 192px" />
            <el-skeleton-item variant="h3" style="width: 20%;margin-left: 192px" />
          </div>
          <div style="padding: 15px 4px 33px;">
            <el-skeleton-item variant="h3" style="width: 20%;" />
            <el-skeleton-item variant="h3" style="width: 20%;margin-left: 192px" />
            <el-skeleton-item variant="h3" style="width: 20%;margin-left: 192px" />
          </div>
        </template>
        <template>
          <el-descriptions title="主机信息">
            <el-descriptions-item label="主机名">{{ monitorData.hostName }}</el-descriptions-item>
            <el-descriptions-item label="主机地址">{{ monitorData.hostAddress }}</el-descriptions-item>
            <el-descriptions-item label="系统架构">{{ monitorData.osArch }}</el-descriptions-item>
            <el-descriptions-item label="系统名称">{{ monitorData.osName }}</el-descriptions-item>
            <el-descriptions-item label="系统版本">{{ monitorData.osVersion }}</el-descriptions-item>
          </el-descriptions>
          <el-divider />

          <el-descriptions title="CPU信息">
            <el-descriptions-item label="CPU当前空闲率">{{ monitorData.cpuFree }}</el-descriptions-item>
            <el-descriptions-item label="CPU型号">{{ monitorData.cpuModel }}</el-descriptions-item>
            <el-descriptions-item label="CPU数量">{{ monitorData.cpuNum }}</el-descriptions-item>
            <el-descriptions-item label="CPU系统使用率">{{ monitorData.cpuSys }}</el-descriptions-item>
            <el-descriptions-item label="CPU总使用率">{{ monitorData.cpuTotal }}</el-descriptions-item>
            <el-descriptions-item label="CPU当前等待率">{{ monitorData.cpuWait }}</el-descriptions-item>
            <el-descriptions-item label="CPU用户使用率">{{ monitorData.cpuUsed }}</el-descriptions-item>
          </el-descriptions>
          <el-divider />

          <el-descriptions title="Jvm信息" class="bottom">
            <el-descriptions-item label="jre名称">{{ monitorData.jreName }}</el-descriptions-item>
            <el-descriptions-item label="jre版本">{{ monitorData.jreVersion }}</el-descriptions-item>
            <el-descriptions-item label="总物理内存">{{ monitorData.totalMemory }}</el-descriptions-item>
            <el-descriptions-item label="空闲内存">{{ monitorData.freeMemory }}</el-descriptions-item>
            <el-descriptions-item label="使用内存">{{ monitorData.usedMemory }}</el-descriptions-item>
            <el-descriptions-item label="jvm名称">{{ monitorData.jvmName }}</el-descriptions-item>
            <el-descriptions-item label="jvm版本">{{ monitorData.jvmVersion }}</el-descriptions-item>
            <el-descriptions-item label="jvm总内存">{{ monitorData.jvmTotalMemory }}</el-descriptions-item>
            <el-descriptions-item label="jvm空闲内存">{{ monitorData.jvmFreeMemory }}</el-descriptions-item>
          </el-descriptions>
        </template>

      </el-skeleton>
    </div>
  </div>
</template>

<script>
import { listMonitors } from '@/api/monitor'
export default {
  name: 'Server',
  data() {
    return {
      monitorData: {},
      loading: true
    }
  },
  created() {
    this.handleQuery()
  },
  methods: {
    handleQuery() {
      listMonitors().then(res => {
        this.monitorData = res.data
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.bottom{
  padding-bottom: 30px;
}
</style>
