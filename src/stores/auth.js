import { reactive } from 'vue'
import { login as loginApi } from '../api/auth'

const TOKEN_KEY = 'token'
const USER_KEY = 'userInfo'
const ROLE_KEY = 'role'

function loadFromStorage() {
  const token = localStorage.getItem(TOKEN_KEY) || ''
  let userInfo = null
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (raw) userInfo = JSON.parse(raw)
  } catch {
    userInfo = null
  }
  const role = localStorage.getItem(ROLE_KEY) || ''
  return { token, userInfo, role }
}

const saved = loadFromStorage()

export const authStore = reactive({
  token: saved.token,
  userInfo: saved.userInfo,
  role: saved.role,

  get isLoggedIn() {
    return !!this.token
  },

  get isAdmin() {
    return this.role === 'admin'
  },

  get isDoctor() {
    return this.role === 'doctor'
  },

  get isPatient() {
    return this.role === 'patient'
  },

  async login(id, password, role) {
    const result = await loginApi(id, password)
    this.token = result.token
    this.userInfo = result.userInfo
    this.role = role
    localStorage.setItem(TOKEN_KEY, result.token)
    localStorage.setItem(USER_KEY, JSON.stringify(result.userInfo))
    localStorage.setItem(ROLE_KEY, role)
  },

  logout() {
    this.token = ''
    this.userInfo = null
    this.role = ''
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(ROLE_KEY)
  }
})
