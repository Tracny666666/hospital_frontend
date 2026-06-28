import { reactive } from 'vue'
import { login as loginApi } from '../api/auth'

const TOKEN_KEY = 'token'
const USER_KEY = 'userInfo'

// 从 localStorage 恢复状态
function loadFromStorage() {
  const token = localStorage.getItem(TOKEN_KEY) || ''
  let userInfo = null
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (raw) userInfo = JSON.parse(raw)
  } catch {
    userInfo = null
  }
  return { token, userInfo }
}

const saved = loadFromStorage()

export const authStore = reactive({
  token: saved.token,
  userInfo: saved.userInfo,

  get isLoggedIn() {
    return !!this.token
  },

  async login(id, password) {
    const result = await loginApi(id, password)
    this.token = result.token
    this.userInfo = result.userInfo
    localStorage.setItem(TOKEN_KEY, result.token)
    localStorage.setItem(USER_KEY, JSON.stringify(result.userInfo))
  },

  logout() {
    this.token = ''
    this.userInfo = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }
})
