<template>
  <div class="my-process-designer">
    <div class="my-process-designer__container">
      <div ref="bpmn-canvas" class="my-process-designer__canvas" />
    </div>

    <!-- 这段xml千万不要用eslint修正 -->
    <marker id="myArrow" viewBox="0 0 20 20" refX="11" refY="10" markerWidth="10" markerHeight="10" orient="auto">
      <path d="M 1 5 L 11 10 L 1 15 Z" style="fill: #52c41a; stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1; stroke: #52c41a;"></path>
    </marker>

  </div>
</template>

<script>
import BpmnNavigatedViewer from 'bpmn-js/lib/NavigatedViewer'

export default {
  name: 'MyProcessViewer',
  componentName: 'MyProcessViewer',
  props: {
    bpmnXml: {
      type: String,
      default: null
    },
    activityIds: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      bpmnViewer: null
    }
  },
  watch: {
    bpmnXml: {
      handler: function(newValue) { // 在 xmlString 发生变化时，重新创建，从而绘制流程图
        this.createNewDiagram(newValue)
      }
    }
  },
  created() {
  },
  mounted() {
    this.initBpmnModeler()
    this.createNewDiagram(this.bpmnXml)
    // this.$once('hook:beforeDestroy', () => {
    //   if (this.bpmnModeler) this.bpmnModeler.destroy()
    //   this.$emit('destroy', this.bpmnModeler)
    //   this.bpmnModeler = null
    // })
  },
  methods: {
    initBpmnModeler() {
      if (this.bpmnViewer) return
      this.bpmnViewer = new BpmnNavigatedViewer({
        container: this.$refs['bpmn-canvas']
      })
    },
    /* 创建新的流程图 */
    async createNewDiagram(xml) {
      // 将字符串转换成图显示出来
      // const newId = this.processId || `Process_${new Date().getTime()}`
      // const newName = this.processName || `业务流程_${new Date().getTime()}`
      // const xmlString = xml || DefaultEmptyXML(newId, newName, 'flowable')
      try {
        const { warnings } = await this.bpmnViewer.importXML(xml)
        if (warnings && warnings.length) {
          warnings.forEach(warn => console.warn(warn))
        }

        const canvas = this.bpmnViewer.get('canvas')
        canvas.zoom('fit-viewport', 'auto')

        for (let i = 0; i < this.activityIds.length; i++) {
          canvas.addMarker(this.activityIds[i], 'bpm-highlight')
        }

        // 高亮线条箭头
        const arrow = document.querySelector('[id^="sequenceflow-end-white-black-"]')
        const newArrow = document.querySelector('#myArrow')
        arrow.parentElement.insertBefore(newArrow, arrow)
        const paths = document.querySelectorAll('.djs-connection.bpm-highlight .djs-visual > path')
        for (let j = 0; j < paths.length; j++) {
          paths[j].setAttribute('style', 'fill: none; stroke-width: 2px; stroke: black; stroke-linejoin: round; marker-end: url("#myArrow");')
        }
      } catch (e) {
        console.error(`[Process Viewer Warn]: ${e?.message || e}`)
      }
    }
  }

}
</script>

<style lang="scss" scoped>
::v-deep .bpm-highlight {
  .djs-visual {
    > :nth-child(1), > path {
      fill: #52c41a !important;
      fill-opacity: 0.25 !important;
      stroke: #52c41a !important;
    }

    .djs-label {
      fill: #52c41a !important;
      font-weight: bold !important;
    }

  }
}
</style>
