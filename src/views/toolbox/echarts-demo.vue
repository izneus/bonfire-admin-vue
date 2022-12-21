<template>
  <div style="width: 600px; height: 400px;">
    <v-chart :option="chartOptions" :autoresize="true" />
  </div>
</template>

<script>
export default {
  name: 'EchartsDemo',
  data() {
    return {
      chartOptions: {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line'
          }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>
