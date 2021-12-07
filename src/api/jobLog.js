import request from '@/utils/request'

export function listJobLogs(data) {
  return request({
    url: '/v1/jobLog/list',
    method: 'post',
    data
  })
}

export function getJobLog(data) {
  return request({
    url: '/v1/jobLog/get',
    method: 'post',
    data
  })
}

export function deleteJobLogs(data) {
  return request({
    url: '/v1/jobLog/batchDelete',
    method: 'post',
    data
  })
}
