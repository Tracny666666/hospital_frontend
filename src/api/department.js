import request from './request'

export const departmentApi = {
  list(params) { return request.get('/department', { params }).then(r => r.data) },
  all() { return request.get('/department', { params: { pageSize: 999 } }).then(r => r.data?.records || r.data) },
  create(data) { return request.post('/department', data).then(r => r.data) },
  update(data) { return request.put('/department', data).then(r => r.data) },
  getById(id) { return request.get(`/department/${id}`).then(r => r.data) },
  delete(id) { return request.delete(`/department/${id}`).then(r => r.data) },
}
