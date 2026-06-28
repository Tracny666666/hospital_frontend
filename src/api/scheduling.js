import request from './request'

export const schedulingApi = {
  list(params) { return request.get('/scheduling', { params }).then(r => r.data) },
  all() { return request.get('/scheduling', { params: { pageSize: 999 } }).then(r => r.data?.records || r.data) },
  create(data) { return request.post('/scheduling', data).then(r => r.data) },
  update(data) { return request.put('/scheduling', data).then(r => r.data) },
  getById(id) { return request.get(`/scheduling/${id}`).then(r => r.data) },
  delete(id) { return request.delete(`/scheduling/${id}`).then(r => r.data) },
}
