import Layout from '@/layout'

const systemRouters = [
  {
    path: '/system',
    component: Layout,
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'ri-settings-6-line',
      roles: ['menu:system']
    },
    children: [
      {
        path: 'dict',
        component: () => import('@/views/system/dict'),
        name: 'Dict',
        meta: {
          title: '字典管理',
          roles: ['menu:dict']
        }
      },
      {
        path: 'log',
        component: () => import('@/views/system/access-log'),
        name: 'AccessLog',
        meta: {
          title: '访问日志管理',
          roles: ['menu:accessLog']
        }
      },
      {
        path: 'file',
        component: () => import('@/views/system/file'),
        name: 'File',
        meta: { title: '文件管理', roles: ['menu:file'] }
      }
    ]
  },
  {
    path: '/staff',
    component: Layout,
    name: 'Staff',
    meta: {
      title: '人员管理',
      icon: 'ri-user-settings-line',
      roles: ['menu:staff']
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/system/user'),
        name: 'User',
        meta: { title: '用户管理', roles: ['menu:user'] }
      },
      {
        path: 'role',
        component: () => import('@/views/system/role'),
        name: 'Role',
        meta: { title: '角色管理', roles: ['menu:role'] }
      },
      {
        path: 'privilege',
        component: () => import('@/views/system/privilege'),
        name: 'Privilege',
        meta: { title: '权限管理', roles: ['menu:privilege'] }
      }
      /* {
        path: 'department',
        component: () => import('@/views/system/empty'),
        name: 'Department',
        meta: { title: '部门管理' }
      },
      {
        path: 'menu',
        component: () => import('@/views/system/empty'),
        name: 'Menu',
        meta: { title: '菜单管理' }
      }*/
    ]
  },
  {
    path: '/task',
    component: Layout,
    name: 'Task',
    meta: {
      title: '任务调度',
      icon: 'ri-task-line',
      roles: ['menu:task']
    },
    children: [
      {
        path: 'job',
        component: () => import('@/views/task/job'),
        name: 'Job',
        meta: { title: '任务管理', roles: ['menu:job'] }
      },
      {
        path: 'joblog',
        component: () => import('@/views/task/jobLog'),
        name: 'Joblog',
        meta: { title: '任务日志', roles: ['menu:jobLog'] }
      }
    ]
  },
  {
    path: '/monitor',
    component: Layout,
    name: 'Monitor',
    meta: {
      title: '监控',
      icon: 'ri-server-line',
      roles: ['menu:monitor']
    },
    children: [
      {
        path: 'server',
        component: () => import('@/views/system/server'),
        name: 'Server',
        meta: { title: '主机监控', roles: ['menu:server'] }
      }
    ]
  },
  {
    path: '/inform',
    component: Layout,
    name: 'Inform',
    meta: {
      title: '公告',
      icon: 'ri-mail-send-line',
      roles: ['menu:inform']
    },
    children: [
      {
        path: 'notice',
        component: () => import('@/views/system/empty'),
        name: 'Notice',
        meta: { title: '通知公告', roles: ['menu:notice'] }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    name: 'Order',
    meta: {
      title: '工单管理',
      icon: 'ri-todo-line',
      roles: ['menu:order']
    },
    children: [
      {
        path: 'work',
        component: () => import('@/views/system/empty'),
        name: 'Work',
        meta: { title: '工单', roles: ['menu:work'] }
      }
    ]
  },
  {
    path: '/bpm',
    component: Layout,
    name: 'Bpm',
    meta: {
      title: '流程中心',
      icon: 'flow-chart',
      roles: ['menu:bpm']
    },
    children: [
      {
        path: 'designer',
        component: () => import('@/views/bpm/designer'),
        name: 'Designer',
        meta: {
          title: '流程设计器',
          roles: ['menu:bpm:designer']
        }
      },
      {
        path: 'model',
        component: () => import('@/views/bpm/model'),
        name: 'Model',
        meta: {
          title: '模型管理',
          roles: ['menu:bpm:model']
        }
      },
      {
        path: 'process-instance',
        component: () => import('@/views/bpm/process-instance'),
        name: 'ProcessInstance',
        meta: {
          title: '流程实例',
          roles: ['menu:bpm:processInstance']
        }
      },
      {
        path: 'todo',
        component: () => import('@/views/bpm/todo'),
        name: 'Todo',
        meta: {
          title: '我的待办',
          roles: ['menu:bpm:todo']
        }
      }
    ]
  }
]

export default systemRouters
