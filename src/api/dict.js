import request from '@/utils/request'

export function listDictDetails(dictType) {
  const data = {
    dictType
  }
  return request({
    url: '/v1/dict/listByDictType',
    method: 'post',
    data
  })
}
