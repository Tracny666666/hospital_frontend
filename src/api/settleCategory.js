import request from './request'

export const settleCategoryApi = {
  list(params) { return request.get('/settle-category', { params }).then(r => r.data) },
  create(data) { return request.post('/settle-category', data).then(r => r.data) },
  update(data) { return request.put('/settle-category', data).then(r => r.data) },
  getById(id) { return request.get(`/settle-category/${id}`).then(r => r.data) },
  delete(id) { return request.delete(`/settle-category/${id}`).then(r => r.data) },
  all() { return request.get('/settle-category/all').then(r => r.data) },
}
