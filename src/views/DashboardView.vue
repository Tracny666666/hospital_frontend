<script setup>
import { ref, onMounted } from 'vue'
import { registerApi } from '../api/register'
import { employeeApi } from '../api/employee'
import { departmentApi } from '../api/department'
import { authStore } from '../stores/auth'
import { useRole } from '../composables/useRole'

const { isAdmin, isDoctor, isPatient, roleLabel } = useRole()

const todayCount = ref(0)
const pendingCount = ref(0)
const totalCount = ref(0)
const employeeCount = ref(0)
const departmentCount = ref(0)

onMounted(async () => {
  // 患者不需要统计数据
  if (isPatient.value) return

  try {
    const [all, pending, today] = await Promise.all([
      registerApi.list({ pageSize: 1 }).then(r => r.total || 0),
      registerApi.list({ pageSize: 1, visitState: 2 }).then(r => r.total || 0),
      registerApi.list({ pageSize: 1, visitDateStart: new Date().toISOString().slice(0, 10), visitDateEnd: new Date().toISOString().slice(0, 10) }).then(r => r.total || 0)
    ])
    totalCount.value = all
    pendingCount.value = pending
    todayCount.value = today
  } catch { /* ignore */ }

  // 管理员额外统计
  if (isAdmin.value) {
    try {
      const [emp, dept] = await Promise.all([
        employeeApi.list({ pageSize: 1 }).then(r => r.total || 0),
        departmentApi.all().then(r => Array.isArray(r) ? r.length : 0)
      ])
      employeeCount.value = emp
      departmentCount.value = dept
    } catch { /* ignore */ }
  }
})
</script>

<template>
  <div class="page">
    <h2 style="margin-bottom:1.5rem">
      欢迎，{{ authStore.userInfo?.realname || '用户' }}
      <span class="role-badge">{{ roleLabel }}</span>
    </h2>

    <!-- Admin & Doctor: 挂号统计 -->
    <div v-if="isAdmin || isDoctor" class="stat-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background:#dbeafe">📋</div>
        <div class="stat-num">{{ todayCount }}</div>
        <div class="stat-label">今日挂号</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:#fef3c7">⏳</div>
        <div class="stat-num">{{ pendingCount }}</div>
        <div class="stat-label">待接诊</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:#d1fae5">📊</div>
        <div class="stat-num">{{ totalCount }}</div>
        <div class="stat-label">总挂号数</div>
      </div>
    </div>

    <!-- Admin: 系统管理统计 -->
    <div v-if="isAdmin" class="stat-grid" style="margin-top:1rem">
      <div class="stat-card">
        <div class="stat-icon" style="background:#ede9fe">👨‍⚕️</div>
        <div class="stat-num">{{ employeeCount }}</div>
        <div class="stat-label">员工总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:#fce7f3">🏥</div>
        <div class="stat-num">{{ departmentCount }}</div>
        <div class="stat-label">科室数量</div>
      </div>
    </div>

    <!-- Patient: 个人面板 -->
    <div v-if="isPatient" class="patient-panel">
      <div class="patient-card">
        <div class="patient-avatar">👤</div>
        <div class="patient-info">
          <div class="patient-name">{{ authStore.userInfo?.realname || '患者' }}</div>
          <div class="patient-detail" v-if="authStore.userInfo?.deptName">
            科室：{{ authStore.userInfo.deptName }}
          </div>
          <div class="patient-detail" v-if="authStore.userInfo?.registLevelName">
            挂号级别：{{ authStore.userInfo.registLevelName }}
          </div>
        </div>
      </div>
      <p class="patient-hint">请通过挂号管理查看您的就诊记录与处方信息。</p>
    </div>
  </div>
</template>

<style scoped>
.stat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
.stat-card { background: #fff; border-radius: var(--radius); box-shadow: var(--shadow); padding: 1.5rem; display: flex; flex-direction: column; align-items: center; text-align: center; }
.stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 0.75rem; }
.stat-num { font-size: 2rem; font-weight: 700; color: var(--color-text); }
.stat-label { font-size: 0.85rem; color: var(--color-text-secondary); }

.role-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 500;
  padding: 2px 10px;
  border-radius: 12px;
  background: var(--color-primary);
  color: #fff;
  vertical-align: middle;
  margin-left: 0.5rem;
}

/* Patient */
.patient-panel {
  margin-top: 1rem;
}
.patient-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: #fff;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
}
.patient-avatar {
  font-size: 3rem;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.patient-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text);
}
.patient-detail {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
}
.patient-hint {
  margin-top: 1.25rem;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}
</style>
