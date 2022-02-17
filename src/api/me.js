import request from '@/utils/request'

export function changePassword(data) {
  return request({
    url: '/v1/me/changePassword',
    method: 'post',
    data
  })
}

