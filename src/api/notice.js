import request from '@/utils/request'

export function listNotices(data) {
  return request({
    url: '/v1/notices/list',
    method: 'post',
    data
  })
}
export function createNotice(data) {
  return request({
    url: '/v1/notices/create',
    method: 'post',
    data
  })
}

/* export function getNotice(data) {
  return request({
    url: '/v1/notices/get',
    method: 'post',
    data
  })
}*/

export function deleteNotices(data) {
  return request({
    url: '/v1/notices/batchDelete',
    method: 'post',
    data
  })
}

