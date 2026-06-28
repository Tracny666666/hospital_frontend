import axios from 'axios'

const request = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// 请求拦截器：携带 JWT token
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器：统一处理
request.interceptors.response.use(
  response => {
    const body = response.data
    // 后端统一响应格式 { code, message, data }
    if (body.code !== 200) {
      const msg = body.message || '请求失败'
      if (body.code === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        window.location.href = '/login'
      }
      return Promise.reject(new Error(msg))
    }
    return body
  },
  error => {
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        window.location.href = '/login'
        return Promise.reject(new Error('登录已过期，请重新登录'))
      }
    }
    return Promise.reject(new Error('网络异常，请稍后重试'))
  }
)

export default request
