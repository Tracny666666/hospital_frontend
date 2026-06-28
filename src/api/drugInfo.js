import request from './request'

export const drugInfoApi = {
  list(params) { return request.get('/drug-info', { params }).then(r => r.data) },
  search(keyword) { return request.get('/drug-info/search', { params: { keyword } }).then(r => r.data) },
  create(data) { return request.post('/drug-info', data).then(r => r.data) },
  update(data) { return request.put('/drug-info', data).then(r => r.data) },
  getById(id) { return request.get(`/drug-info/${id}`).then(r => r.data) },
}
