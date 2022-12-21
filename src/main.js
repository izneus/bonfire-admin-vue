import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

// bpmnjs相关css
import 'highlight.js/styles/atom-one-dark-reasonable.css'
import '@/components/BpmnProcessDesigner/theme/index.scss'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
// import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css"; // 右边工具栏样式

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

// 数据字典
import dict from './components/Dict'

// remix图标库
import 'remixicon/fonts/remixicon.css'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
/* if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}*/

// 加载字典
Vue.use(dict)

// 加载BPM设计器
import { vuePlugin } from '@/components/BpmnProcessDesigner/highlight'
Vue.use(vuePlugin)
import MyPD from '@/components/BpmnProcessDesigner/index.js'
Vue.use(MyPD)

// 加载ElementUI
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// 集成 https://github.com/xaboy/form-create
import formCreate from '@form-create/element-ui'
import FcDesigner from '@form-create/designer'
Vue.use(formCreate)
Vue.use(FcDesigner)

// 集成vue-simple-uploader
import uploader from 'vue-simple-uploader'
Vue.use(uploader)

import ECharts from 'vue-echarts'
// import 'echarts'
import { use } from 'echarts/core'
// 手动引入 ECharts 各模块来减小打包体积
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  LineChart,
  PieChart
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent
])

// 全局注册组件（也可以使用局部注册）
Vue.component('v-chart', ECharts)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
