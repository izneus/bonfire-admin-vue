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
