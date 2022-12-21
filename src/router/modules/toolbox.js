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
      path: '/search-table-template',
      component: () => import('@/views/toolbox/search-table-template'),
      name: 'SearchTableTemplate',
      meta: { title: '表格查询模板页' }
    },
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
    },
    {
      path: '/fileUpload',
      component: () => import('@/views/toolbox/file-upload'),
      name: 'FileUpload',
      meta: { title: '大文件上传' }
    }
  ]
}

export default toolboxRouter
