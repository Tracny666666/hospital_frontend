import request from './request'

/**
 * 登录
 * @param {number} id - 员工工号
 * @param {string} password - 密码
 * @returns {Promise<{token: string, expiresAt: number, userInfo: object}>}
 */
export function login(id, password) {
  return request.post('/auth/login', { id, password }).then(res => res.data)
}

/**
 * 获取当前登录用户信息
 * @returns {Promise<object>}
 */
export function getCurrentUser() {
  return request.get('/auth/me').then(res => res.data)
}

/**
 * 修改当前登录用户密码
 * @param {string} oldPassword - 原密码
 * @param {string} newPassword - 新密码
 * @returns {Promise<void>}
 */
export function changePassword(oldPassword, newPassword) {
  return request.put('/auth/password', { oldPassword, newPassword }).then(res => res.data)
}

/**
 * 登出（服务端 token 失效）
 * @returns {Promise<void>}
 */
export function logout() {
  return request.post('/auth/logout').then(res => res.data)
}
