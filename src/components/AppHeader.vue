<script setup>
import { ref, reactive } from 'vue'
import { authStore } from '../stores/auth.js'
import { changePassword, logout as logoutApi } from '../api/auth.js'
import { useToast } from '../composables/useToast.js'
import { useRole } from '../composables/useRole.js'
import { useRouter } from 'vue-router'

defineEmits(['toggleSidebar'])
const router = useRouter()
const toast = useToast()
const { roleLabel } = useRole()

const showMenu = ref(false)
const showPwdModal = ref(false)
const pwdForm = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })
const pwdSubmitting = ref(false)

async function handleLogout() {
  try { await logoutApi() } catch { /* ignore */ }
  authStore.logout()
  router.push('/login')
}

function toggleMenu() { showMenu.value = !showMenu.value }

async function handleChangePwd() {
  if (!pwdForm.oldPassword || !pwdForm.newPassword) return
  if (pwdForm.newPassword.length < 6) { toast.error('新密码至少6位'); return }
  if (pwdForm.newPassword !== pwdForm.confirmPassword) { toast.error('两次密码不一致'); return }
  pwdSubmitting.value = true
  try {
    await changePassword(pwdForm.oldPassword, pwdForm.newPassword)
    toast.success('密码修改成功')
    showPwdModal.value = false
    pwdForm.oldPassword = ''; pwdForm.newPassword = ''; pwdForm.confirmPassword = ''
  } catch (e) {
    toast.error(e.message || '修改失败')
  } finally {
    pwdSubmitting.value = false
  }
}
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <button class="hamburger" @click="$emit('toggleSidebar')">
        <span></span><span></span><span></span>
      </button>
      <svg class="header-logo" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#fff"/>
        <path d="M24 12c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm-1 15v-4h-4l5-7v4h4l-5 7z" fill="#2563eb"/>
      </svg>
      <span class="header-title">东软智慧云脑诊疗平台</span>
    </div>
    <div class="header-right">
      <div class="user-menu" @click="toggleMenu" v-click-outside="() => showMenu = false">
        <span class="header-user" v-if="authStore.userInfo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          {{ authStore.userInfo.realname }}
          <span class="role-tag">{{ roleLabel }}</span>
          <span class="header-dept" v-if="authStore.userInfo.deptName"> · {{ authStore.userInfo.deptName }}</span>
        </span>
        <div class="dropdown" v-if="showMenu">
          <a href="#" @click.prevent="showPwdModal = true; showMenu = false">修改密码</a>
          <a href="#" @click.prevent="handleLogout">退出登录</a>
        </div>
      </div>
    </div>
  </header>

  <!-- 修改密码弹窗 -->
  <div class="modal-overlay" v-if="showPwdModal" @click.self="showPwdModal = false">
    <div class="modal" style="max-width:400px">
      <div class="modal-header"><h4>修改密码</h4><button class="modal-close" @click="showPwdModal = false">&times;</button></div>
      <form class="modal-body" @submit.prevent="handleChangePwd">
        <div class="form-group"><label class="form-label">原密码</label><input v-model="pwdForm.oldPassword" class="form-input" type="password" required /></div>
        <div class="form-group"><label class="form-label">新密码（至少6位）</label><input v-model="pwdForm.newPassword" class="form-input" type="password" required /></div>
        <div class="form-group"><label class="form-label">确认新密码</label><input v-model="pwdForm.confirmPassword" class="form-input" type="password" required /></div>
        <button type="submit" class="btn btn-primary" :disabled="pwdSubmitting" style="width:100%">{{ pwdSubmitting ? '提交中...' : '确认修改' }}</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 56px;
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
  position: relative;
  z-index: 100;
}
.header-left { display: flex; align-items: center; gap: 0.5rem; }
.header-logo { width: 32px; height: 32px; }
.header-title { font-size: 1rem; font-weight: 600; }
.header-right { display: flex; align-items: center; gap: 1rem; }
.header-user { display: flex; align-items: center; font-size: 0.875rem; cursor: pointer; }
.header-dept { opacity: 0.8; }
.role-tag {
  display: inline-block;
  padding: 0 6px;
  font-size: 0.65rem;
  background: rgba(255,255,255,0.25);
  border-radius: 4px;
}
.user-menu { position: relative; }
.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  min-width: 130px;
  overflow: hidden;
  z-index: 200;
}
.dropdown a {
  display: block;
  padding: 0.6rem 1rem;
  font-size: 0.85rem;
  color: var(--color-text);
  text-decoration: none;
}
.dropdown a:hover { background: #f1f5f9; }
.hamburger { display: none; flex-direction: column; gap: 4px; background: none; border: none; cursor: pointer; padding: 4px; margin-right: 8px; }
.hamburger span { display: block; width: 20px; height: 2px; background: #fff; border-radius: 2px; }
@media (max-width: 768px) { .hamburger { display: flex; } }
</style>
