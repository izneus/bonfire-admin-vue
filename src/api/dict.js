import request from '@/utils/request'

export function listDictsByDictType(dictType) {
  const data = {
    dictType
  }
  return request({
    url: '/v1/dict/listByDictType',
    method: 'post',
    data
  })
}

export function listDicts(data) {
  return request({
    url: '/v1/dict/list',
    method: 'post',
    data
  })
}

export function createDict(data) {
  return request({
    url: '/v1/dict/create',
    method: 'post',
    data
  })
}

export function getDict(data) {
  return request({
    url: '/v1/dict/get',
    method: 'post',
    data
  })
}

export function updateDict(data) {
  return request({
    url: '/v1/dict/update',
    method: 'post',
    data
  })
}

export function deleteDicts(data) {
  return request({
    url: '/v1/dict/batchDelete',
    method: 'post',
    data
  })
}
