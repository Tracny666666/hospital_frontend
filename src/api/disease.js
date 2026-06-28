import request from './request'

export const diseaseApi = {
  list(params) { return request.get('/disease', { params }).then(r => r.data) },
  create(data) { return request.post('/disease', data).then(r => r.data) },
  update(data) { return request.put('/disease', data).then(r => r.data) },
  getById(id) { return request.get(`/disease/${id}`).then(r => r.data) },
  search(keyword) { return request.get('/disease/search', { params: { keyword } }).then(r => r.data) },
}
