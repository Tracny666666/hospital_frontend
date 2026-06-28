import request from './request'

export const prescriptionApi = {
  list(params) { return request.get('/prescription', { params }).then(r => r.data) },
  create(data) { return request.post('/prescription', data).then(r => r.data) },
  update(data) { return request.put('/prescription', data).then(r => r.data) },
  getById(id) { return request.get(`/prescription/${id}`).then(r => r.data) },
  listByRegister(registerId) { return request.get(`/prescription/register/${registerId}`).then(r => r.data) },
}
