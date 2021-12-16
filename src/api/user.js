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

export function listUsers(data) {
  return request({
    url: '/v1/user/list',
    method: 'post',
    data
  })
}

export function createUser(data) {
  return request({
    url: '/v1/user/create',
    method: 'post',
    data
  })
}

export function getUser(data) {
  return request({
    url: '/v1/user/get',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/v1/user/update',
    method: 'post',
    data
  })
}

export function deleteUsers(data) {
  return request({
    url: '/v1/user/batchDelete',
    method: 'post',
    data
  })
}

export function resetPasswordBatch(data) {
  return request({
    url: '/v1/user/resetPasswordBatch',
    method: 'post',
    data
  })
}

export function exportUsers(data) {
  return request({
    url: '/v1/user/export',
    method: 'post',
    data
  })
}

export function setUserRole(data) {
  return request({
    url: '/v1/user/setRole',
    method: 'post',
    data
  })
}

