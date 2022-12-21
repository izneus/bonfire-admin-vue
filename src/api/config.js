import request from '@/utils/request'

export function listConfigs(data) {
  return request({
    url: '/v1/config/list',
    method: 'post',
    data
  })
}

export function createConfig(data) {
  return request({
    url: '/v1/config/create',
    method: 'post',
    data
  })
}

export function updateConfig(data) {
  return request({
    url: '/v1/config/update',
    method: 'post',
    data
  })
}

export function batchDeleteConfig(data) {
  return request({
    url: '/v1/config/batchDelete',
    method: 'post',
    data
  })
}
