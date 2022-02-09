import request from '@/utils/request'

export function getPrivilegeTree() {
  return request({
    url: '/v1/privilege/getPrivilegeTree',
    method: 'post'
  })
}
