<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../stores/auth.js'

const router = useRouter()

const form = reactive({
  id: '',
  password: ''
})

const loading = ref(false)
const errorMsg = ref('')
const errors = reactive({
  id: '',
  password: ''
})

function validateLogin() {
  errors.id = ''
  errors.password = ''

  if (!form.id) {
    errors.id = '请输入员工工号'
    return false
  }
  if (!/^\d+$/.test(form.id)) {
    errors.id = '工号必须为数字'
    return false
  }
  if (!form.password) {
    errors.password = '请输入密码'
    return false
  }
  return true
}

async function handleLogin() {
  errorMsg.value = ''
  if (!validateLogin()) return
  loading.value = true
  try {
    await authStore.login(Number(form.id), form.password)
    await router.push('/')
  } catch (err) {
    errorMsg.value = err.message || '登录失败，请检查工号和密码'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <!-- Logo & 标题 -->
      <div class="login-header">
        <div class="login-logo">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="12" fill="#2563eb"/>
            <path d="M24 12C18.48 12 14 16.48 14 22s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm-1 15v-4h-4l5-7v4h4l-5 7z" fill="white"/>
          </svg>
        </div>
        <h1 class="login-title">东软智慧云脑诊疗平台</h1>
        <p class="login-subtitle">医院员工登录</p>
      </div>

      <!-- 错误提示 -->
      <div v-if="errorMsg" class="alert alert-error">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="vertical-align: -3px; margin-right: 6px;">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {{ errorMsg }}
      </div>

      <!-- =========== 登录表单 =========== -->
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label" for="login-id">员工工号</label>
          <input
            id="login-id"
            v-model="form.id"
            class="form-input"
            type="text"
            placeholder="请输入员工工号"
            autocomplete="username"
            :disabled="loading"
          />
          <p v-if="errors.id" class="form-error">{{ errors.id }}</p>
        </div>

        <div class="form-group">
          <label class="form-label" for="login-pwd">密码</label>
          <input
            id="login-pwd"
            v-model="form.password"
            class="form-input"
            type="password"
            placeholder="请输入密码"
            autocomplete="current-password"
            :disabled="loading"
          />
          <p v-if="errors.password" class="form-error">{{ errors.password }}</p>
        </div>

        <button
          type="submit"
          class="btn btn-primary login-btn"
          :disabled="loading"
        >
          <svg v-if="loading" class="spinner" width="18" height="18" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" stroke-width="3" fill="none"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
          </svg>
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <p class="login-footer">东软教育 · 东北大学 · 项目实训</p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1.5rem;
  background: linear-gradient(135deg, #e8f0fe 0%, #d4e4fc 30%, #c3d9f7 60%, #e0e7ff 100%);
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: var(--color-bg-card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 2.5rem 2rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-logo {
  display: inline-flex;
  margin-bottom: 1rem;
}

.login-logo svg {
  width: 48px;
  height: 48px;
}

.login-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.login-subtitle {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.login-form {
  margin-bottom: 1.5rem;
}

.login-btn {
  width: 100%;
  padding: 0.85rem;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.spinner {
  animation: spin 0.8s linear infinite;
  margin-right: 6px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login-footer {
  text-align: center;
  font-size: 0.8rem;
  color: #94a3b8;
}
</style>
