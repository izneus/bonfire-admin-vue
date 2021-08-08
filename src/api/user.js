import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/v1/login',
    method: 'post',
    data
  })
}

export function getCaptcha() {
  return request({
    url: '/v1/captcha',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/v1/logout',
    method: 'post'
  })
}

export function getInfo() {
  return request({
    url: '/v1/me/info',
    method: 'get'
  })
}

export function listUsers(params){
  return request({
    url: '/v1/users',
    params
  })
}
