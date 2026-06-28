import request from './request'

export const checkRequestApi = {
  list(params) { return request.get('/check-request', { params }).then(r => r.data) },
  create(data) { return request.post('/check-request', data).then(r => r.data) },
  update(data) { return request.put('/check-request', data).then(r => r.data) },
  getById(id) { return request.get(`/check-request/${id}`).then(r => r.data) },
  listByRegister(registerId) { return request.get(`/check-request/register/${registerId}`).then(r => r.data) },
}
