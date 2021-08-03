import request from '@/utils/request'

export function listDictDetails(dictType) {
  const params = {
    dictType
  }
  return request({
    url: '/v1/dictDetails',
    method: 'get',
    params
  })
}
