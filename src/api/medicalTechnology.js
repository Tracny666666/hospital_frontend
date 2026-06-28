import request from './request'

export const medicalTechnologyApi = {
  list(params) { return request.get('/medical-technology', { params }).then(r => r.data) },
  create(data) { return request.post('/medical-technology', data).then(r => r.data) },
  update(data) { return request.put('/medical-technology', data).then(r => r.data) },
  getById(id) { return request.get(`/medical-technology/${id}`).then(r => r.data) },
  all() { return request.get('/medical-technology/all').then(r => r.data) },
}
