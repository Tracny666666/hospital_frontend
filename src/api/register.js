import request from './request'

export const registerApi = {
  list(params) { return request.get('/register', { params }).then(r => r.data) },
  create(data) { return request.post('/register', data).then(r => r.data) },
  update(data) { return request.put('/register', data).then(r => r.data) },
  getById(id) { return request.get(`/register/${id}`).then(r => r.data) },
  getByCaseNumber(caseNumber) { return request.get(`/register/case/${caseNumber}`).then(r => r.data) },
  updateState(id, visitState) { return request.put(`/register/${id}/state`, null, { params: { visitState } }).then(r => r.data) },
}
