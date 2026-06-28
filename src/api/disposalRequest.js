import request from './request'

export const disposalRequestApi = {
  list(params) { return request.get('/disposal-request', { params }).then(r => r.data) },
  create(data) { return request.post('/disposal-request', data).then(r => r.data) },
  update(data) { return request.put('/disposal-request', data).then(r => r.data) },
  getById(id) { return request.get(`/disposal-request/${id}`).then(r => r.data) },
  listByRegister(registerId) { return request.get(`/disposal-request/register/${registerId}`).then(r => r.data) },
}
