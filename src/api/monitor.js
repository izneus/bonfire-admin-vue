import request from '@/utils/request'

export function listMonitors(data) {
  return request({
    url: '/v1/monitor/list',
    method: 'post',
    data
  })
}
