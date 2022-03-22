import request from '@/utils/request'

export function listJobs(data) {
  return request({
    url: '/v1/job/list',
    method: 'post',
    data
  })
}
export function createJob(data) {
  return request({
    url: '/v1/job/create',
    method: 'post',
    data
  })
}

export function getJob(data) {
  return request({
    url: '/v1/job/get',
    method: 'post',
    data
  })
}

export function updateJob(data) {
  return request({
    url: '/v1/job/update',
    method: 'post',
    data
  })
}

export function deleteJobs(data) {
  return request({
    url: '/v1/job/batchDelete',
    method: 'post',
    data
  })
}

export function pauseJobs(data) {
  return request({
    url: '/v1/job/batchPause',
    method: 'post',
    data
  })
}

export function resumeJobs(data) {
  return request({
    url: '/v1/job/batchResume',
    method: 'post',
    data
  })
}

export function runOnce(data) {
  return request({
    url: '/v1/job/runOnce',
    method: 'post',
    data
  })
}

export function getLatestJobLog(data) {
  return request({
    url: '/v1/job/getLatestJobLog',
    method: 'post',
    data
  })
}

