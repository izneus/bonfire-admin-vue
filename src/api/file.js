import request from '@/utils/request'

export function listFiles(data) {
  return request({
    url: '/v1/file/list',
    method: 'post',
    data
  })
}
export function createFile(data) {
  return request({
    url: '/v1/file/create',
    method: 'post',
    data
  })
}

export function getFile(data) {
  return request({
    url: '/v1/file/get',
    method: 'post',
    data
  })
}

export function updateFile(data) {
  return request({
    url: '/v1/file/update',
    method: 'post',
    data
  })
}

export function deleteFiles(data) {
  return request({
    url: '/v1/file/batchDelete',
    method: 'post',
    data
  })
}

export function getUploadUrl(data) {
  return request({
    url: '/v1/file/getUploadUrl',
    method: 'post',
    data
  })
}

export function mergeChunks(data) {
  return request({
    url: '/v1/file/mergeChunks',
    method: 'post',
    data
  })
}
