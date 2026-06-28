import { computed } from 'vue'
import { authStore } from '../stores/auth.js'

const LABELS = { admin: '管理员', doctor: '医生', patient: '患者' }

export function useRole() {
  const role = computed(() => authStore.role)
  const isAdmin = computed(() => authStore.isAdmin)
  const isDoctor = computed(() => authStore.isDoctor)
  const isPatient = computed(() => authStore.isPatient)
  const roleLabel = computed(() => LABELS[authStore.role] || '未知')

  function canAccess(roles) {
    if (!roles || roles.length === 0) return true
    return roles.includes(authStore.role)
  }

  return { role, isAdmin, isDoctor, isPatient, roleLabel, canAccess }
}
