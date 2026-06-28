import request from './request'

export const inspectionRequestApi = {
  list(params) { return request.get('/inspection-request', { params }).then(r => r.data) },
  create(data) { return request.post('/inspection-request', data).then(r => r.data) },
  update(data) { return request.put('/inspection-request', data).then(r => r.data) },
  getById(id) { return request.get(`/inspection-request/${id}`).then(r => r.data) },
  listByRegister(registerId) { return request.get(`/inspection-request/register/${registerId}`).then(r => r.data) },
}
