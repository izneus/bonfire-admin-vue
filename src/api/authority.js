import request from '@/utils/request'

export function listAuthorities(data) {
  return request({
    url: '/v1/auth/list',
    method: 'post',
    data
  })
}
export function createAuthority(data) {
  return request({
    url: '/v1/auth/create',
    method: 'post',
    data
  })
}

export function getAuthority(data) {
  return request({
    url: '/v1/auth/get',
    method: 'post',
    data
  })
}

export function updateAuthority(data) {
  return request({
    url: '/v1/auth/update',
    method: 'post',
    data
  })
}

export function deleteAuthorities(data) {
  return request({
    url: '/v1/auth/batchDelete',
    method: 'post',
    data
  })
}

