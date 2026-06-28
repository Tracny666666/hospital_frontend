<script setup>
import { ref, onMounted } from 'vue'
import { registerApi } from '../api/register'
import { authStore } from '../stores/auth'

const todayCount = ref(0)
const pendingCount = ref(0)
const totalCount = ref(0)

onMounted(async () => {
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
})
</script>

<template>
  <div class="page">
    <h2 style="margin-bottom:1.5rem">欢迎，{{ authStore.userInfo?.realname || '医生' }}</h2>
    <div class="stat-grid">
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
  </div>
</template>

<style scoped>
.stat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
.stat-card { background: #fff; border-radius: var(--radius); box-shadow: var(--shadow); padding: 1.5rem; display: flex; flex-direction: column; align-items: center; text-align: center; }
.stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 0.75rem; }
.stat-num { font-size: 2rem; font-weight: 700; color: var(--color-text); }
.stat-label { font-size: 0.85rem; color: var(--color-text-secondary); }
</style>
