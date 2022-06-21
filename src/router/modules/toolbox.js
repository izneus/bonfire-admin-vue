import Layout from '@/layout'

const toolboxRouter = {
  path: '/toolbox',
  component: Layout,
  name: 'Toolbox',
  meta: {
    title: '开发工具箱',
    icon: 'ri-code-s-slash-line',
    roles: ['menu:dev']
  },
  children: [
    {
      path: '/amap',
      component: () => import('@/views/toolbox/amap'),
      name: 'AMap',
      meta: { title: '高德地图' }
    },
    {
      path: '/echarts',
      component: () => import('@/views/system/empty'),
      name: 'ECharts',
      meta: { title: 'ECharts' }
    },
    {
      path: '/formDesigner',
      component: () => import('@/views/toolbox/form-designer'),
      name: 'FormDesigner',
      meta: { title: '表单设计器' }
    }
  ]
}

export default toolboxRouter
