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
    }
  ]
}

export default toolboxRouter
