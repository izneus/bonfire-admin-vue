import request from '@/utils/request'

export function listRoles(data) {
  return request({
    url: '/v1/role/list',
    method: 'post',
    data
  })
}
export function createRole(data) {
  return request({
    url: '/v1/role/create',
    method: 'post',
    data
  })
}

export function getRole(data) {
  return request({
    url: '/v1/role/get',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/v1/role/update',
    method: 'post',
    data
  })
}

export function deleteRoles(data) {
  return request({
    url: '/v1/role/batchDelete',
    method: 'post',
    data
  })
}

export function setRoleAuth(data) {
  return request({
    url: '/v1/role/setAuth',
    method: 'post',
    data
  })
}

