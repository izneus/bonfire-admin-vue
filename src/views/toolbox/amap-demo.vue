<template>
  <div id="container" />
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'

export default {
  name: 'AMap',
  data() {
    return {
      map: null
    }
  },
  mounted() {
    // DOM初始化完成进行地图初始化
    this.initMap()
  },
  methods: {
    initMap() {
      AMapLoader.load({
        key: '请输入key', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0Beta', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [''] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      }).then((AMap) => {
        this.map = new AMap.Map('container', { // 设置地图容器id
          viewMode: '3D', // 是否为3D地图模式
          zoom: 13, // 初始化地图级别
          center: [119.647265, 29.079195] // 初始化地图中心点位置
        })
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>

<style scoped>
#container{
  padding:0;
  margin: 0;
  width: 400px;
  height: 400px;
}
</style>
