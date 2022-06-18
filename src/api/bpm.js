import request from '@/utils/request'

// ------------ 模型相关 ------------
export function createModel(data) {
  return request({
    url: '/v1/bpm/model/create',
    method: 'post',
    data
  })
}

export function updateModel(data) {
  return request({
    url: '/v1/bpm/model/update',
    method: 'post',
    data
  })
}

export function listModels(data) {
  return request({
    url: '/v1/bpm/model/list',
    method: 'post',
    data
  })
}

export function deleteModel(data) {
  return request({
    url: '/v1/bpm/model/delete',
    method: 'post',
    data
  })
}

export function deleteModels(data) {
  return request({
    url: '/v1/bpm/model/batchDelete',
    method: 'post',
    data
  })
}

export function getModel(data) {
  return request({
    url: '/v1/bpm/model/get',
    method: 'post',
    data
  })
}

export function deployModel(data) {
  return request({
    url: '/v1/bpm/model/deploy',
    method: 'post',
    data
  })
}

// ------------ 流程实例相关 ------------
export function listProcessInstances(data) {
  return request({
    url: '/v1/bpm/processInstance/list',
    method: 'post',
    data
  })
}

export function getProcessInstance(data) {
  return request({
    url: '/v1/bpm/processInstance/get',
    method: 'post',
    data
  })
}

export function createLeave(data) {
  return request({
    url: '/v1/bpm/oa/createLeave',
    method: 'post',
    data
  })
}

// ------------ 任务待办相关 ------------
export function listTodos(data) {
  return request({
    url: '/v1/bpm/task/todo',
    method: 'post',
    data
  })
}

export function approveTodo(data) {
  return request({
    url: '/v1/bpm/task/approve',
    method: 'post',
    data
  })
}
