import request from '@/utils/request'

export function listAuthorities(params) {
  return request({
    url: '/v1/authorities',
    method: 'get',
    params
  })
}
export function createAuthority(data) {
  return request({
    url: '/v1/authorities',
    method: 'post',
    data
  })
}

export function getAuthority(params) {
  return request({
    url: '/v1/authorities/' + params.toString(),
    method: 'get',
    params
  })
}

export function updateAuthority(data) {
  return request({
    url: '/v1/authorities/' + data.toString(),
    method: 'post',
    data
  })
}

export function deleteAuthorities(params) {
  return request({
    url: '/v1/authorities/' + params.toString(),
    method: 'get',
    params
  })
}

export function exportAuthorities(data) {
  return request({
    url: '/v1/authorities/' + data.toString(),
    method: 'post',
    data
  })
}

