import request from './request'

export const employeeApi = {
  list(params) { return request.get('/employee', { params }).then(r => r.data) },
  create(data) { return request.post('/employee', data).then(r => r.data) },
  update(data) { return request.put('/employee', data).then(r => r.data) },
  getById(id) { return request.get(`/employee/${id}`).then(r => r.data) },
  delete(id) { return request.delete(`/employee/${id}`).then(r => r.data) },
  listByDept(deptId) { return request.get(`/employee/dept/${deptId}`).then(r => r.data) },
}
