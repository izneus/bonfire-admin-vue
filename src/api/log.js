import request from '@/utils/request'

export function listLogs(data) {
  return request({
    url: '/v1/accessLog/list',
    method: 'post',
    data
  })
}

export function getLog(data) {
  return request({
    url: '/v1/accessLog/get',
    method: 'post',
    data
  })
}

export function deleteLogs(data) {
  return request({
    url: '/v1/accessLog/batchDelete',
    method: 'post',
    data
  })
}

