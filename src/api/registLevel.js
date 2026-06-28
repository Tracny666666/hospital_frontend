import request from './request'

export const registLevelApi = {
  list(params) { return request.get('/regist-level', { params }).then(r => r.data) },
  create(data) { return request.post('/regist-level', data).then(r => r.data) },
  update(data) { return request.put('/regist-level', data).then(r => r.data) },
  getById(id) { return request.get(`/regist-level/${id}`).then(r => r.data) },
  delete(id) { return request.delete(`/regist-level/${id}`).then(r => r.data) },
  all() { return request.get('/regist-level/all').then(r => r.data) },
}
