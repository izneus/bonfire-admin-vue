<template>
  <div class="app-container" style="height: calc(100vh - 80px)">
    <div style="display: flex;height: calc(100vh - 100px)">
      <div style="flex: 1 1 auto">
        <my-process-designer
          ref="processDesigner"
          :key="`designer-${reloadIndex}`"
          v-model="xmlString"
          :options="{
            taskResizingEnabled: true,
            eventResizingEnabled: true
          }"
          v-bind="controlForm"
          keyboard
          @element-click="elementClick"
          @element-contextmenu="elementContextmenu"
          @init-finished="initModeler"
          @saveModel="saveModel"
        />
      </div>
      <div style="height: 100%; width: 400px;flex: 0 0 400px">
        <my-properties-panel
          :key="`penal-${reloadIndex}`"
          :bpmn-modeler="modeler"
          :prefix="controlForm.prefix"
          :model="model"
          class="process-panel"
        />
      </div>

    </div>
  </div>
</template>

<script>
import translations from '@/translations'
// 自定义元素选中时的弹出菜单（修改 默认任务 为 用户任务）
import CustomContentPadProvider from '@/components/BpmnProcessDesigner/designer/plugins/content-pad'
// 自定义左侧菜单（修改 默认任务 为 用户任务）
import CustomPaletteProvider from '@/components/BpmnProcessDesigner/designer/plugins/palette'
import Log from '@/components/BpmnProcessDesigner/Log'
// import resizeTask from 'bpmn-js-task-resize/lib'
import minimapModule from 'diagram-js-minimap'
import clickoutside from 'element-ui/lib/utils/clickoutside'
import { createModel, updateModel, getModel } from '@/api/bpm'

export default {
  name: 'Designer',
  directives: {
    clickoutside: clickoutside
  },
  data() {
    return {
      xmlString: '',
      modeler: null,
      reloadIndex: 0,
      controlDrawerVisible: false,
      infoTipVisible: false,
      pageMode: false,
      translationsSelf: translations,
      controlForm: {
        processId: '',
        processName: '',
        simulation: true,
        labelEditing: false,
        labelVisible: false,
        prefix: 'flowable',
        headerButtonSize: 'mini',
        events: ['element.click', 'element.contextmenu'],
        // additionalModel: []
        additionalModel: [CustomContentPadProvider, CustomPaletteProvider, minimapModule]
        // additionalModel: [minimapModule]
      },
      addis: {
        CustomContentPadProvider,
        CustomPaletteProvider
      },
      rootElement: null,
      // 流程模型的信息
      model: {
        id: null
      }
    }
  },
  created() {
    const modelId = this.$route.query && this.$route.query.id
    if (modelId) {
      this.model.id = modelId
      getModel({ id: modelId }).then(res => {
        this.xmlString = res.data.bpmnXml
      })
    }
  },
  methods: {
    initModeler(modeler) {
      setTimeout(() => {
        this.modeler = modeler
        const canvas = modeler.get('canvas')
        this.rootElement = canvas.getRootElement()
        Log.prettyPrimary('Process Id:', this.rootElement.id)
        // Log.prettyPrimary("Process Name:", this.rootElement.businessObject.name);
      }, 10)
    },
    elementClick(element) {
      // console.log(element)
      // this.element = element
    },
    elementContextmenu(element) {
      console.log('elementContextmenu:', element)
    },
    saveModel(xml) {
      const processElement = this.modeler.get('elementRegistry').find(el => el.type === 'bpmn:Process')
      // processElement.businessObject.documentation

      let doc = null
      if (Object.prototype.hasOwnProperty.call(processElement.businessObject, 'documentation')) {
        const docArr = processElement.businessObject.documentation
        if (docArr.length > 0) {
          doc = docArr[0].text
        }
      }
      const data = {
        name: processElement.businessObject.name,
        key: processElement.businessObject.id,
        description: doc,
        // description: processElement.businessObject.$attrs.description,
        bpmnXml: xml
      }
      console.log(data.bpmnXml)
      if (this.model.id) {
        // id不为空，更新模型
        updateModel({
          id: this.model.id,
          ...data
        }).then(() => {
          this.$message({
            showClose: true,
            message: '更新模型成功',
            type: 'success'
          })
        })
      } else {
        // id为空，新建模型
        createModel(data).then(res => {
          this.$message({
            showClose: true,
            message: '新建模型成功',
            type: 'success'
          })
          this.model.id = res.data.id
        })
      }
      // Log.prettyPrimary('Process Desc:', this.rootElement.businessObject.$attrs.description)
    }
  }

}
</script>

<style scoped>

</style>
