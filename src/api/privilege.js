import request from '@/utils/request'

export function getPrivilegeTree() {
  return request({
    url: '/v1/privilege/getPrivilegeTree',
    method: 'post'
  })
}
export function getPrivilegeList(data) {
  return request({
    url: '/v1/privilege/getPrivilegeList',
    method: 'post',
    data
  })
}
export function createPriv(data) {
  return request({
    url: '/v1/privilege/create',
    method: 'post',
    data
  })
}
export function getPrivilegeById(data) {
  return request({
    url: '/v1/privilege/get',
    method: 'post',
    data
  })
}
export function updatePrivilegeById(data) {
  return request({
    url: '/v1/privilege/update',
    method: 'post',
    data
  })
}
export function deletePrivilegeById(data) {
  return request({
    url: '/v1/privilege/deletePrivilegeById',
    method: 'post',
    data
  })
}
export function batchDelete(data) {
  return request({
    url: '/v1/privilege/batchDelete',
    method: 'post',
    data
  })
}

