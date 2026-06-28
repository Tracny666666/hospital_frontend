<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { authStore } from '../stores/auth.js'

defineProps({ collapsed: Boolean })
const route = useRoute()

const allMenuGroups = [
  {
    title: '',
    items: [
      { path: '/dashboard', label: '首页概览', icon: '🏠', roles: ['admin', 'doctor', 'patient'] },
    ]
  },
  {
    title: '业务管理',
    items: [
      { path: '/register', label: '挂号管理', icon: '📋', roles: ['admin', 'doctor'] },
    ]
  },
  {
    title: '字典管理',
    items: [
      { path: '/employee', label: '员工管理', icon: '👨‍⚕️', roles: ['admin'] },
      { path: '/department', label: '科室管理', icon: '🏥', roles: ['admin'] },
      { path: '/scheduling', label: '排班管理', icon: '📅', roles: ['admin'] },
      { path: '/regist-level', label: '挂号级别', icon: '💰', roles: ['admin'] },
      { path: '/settle-category', label: '结算类别', icon: '💳', roles: ['admin'] },
      { path: '/medical-technology', label: '医技项目', icon: '🔬', roles: ['admin', 'doctor'] },
      { path: '/drug-info', label: '药品信息', icon: '💊', roles: ['admin', 'doctor'] },
      { path: '/disease', label: '疾病管理', icon: '🦠', roles: ['admin', 'doctor'] },
    ]
  },
  {
    title: '医技管理',
    items: [
      { path: '/check-request', label: '检查申请', icon: '📝', roles: ['admin', 'doctor'] },
      { path: '/inspection-request', label: '检验申请', icon: '🔬', roles: ['admin', 'doctor'] },
      { path: '/disposal-request', label: '处置申请', icon: '💉', roles: ['admin', 'doctor'] },
      { path: '/prescription', label: '处方管理', icon: '📋', roles: ['admin', 'doctor'] },
    ]
  }
]

const menuGroups = computed(() => {
  return allMenuGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item => item.roles.includes(authStore.role))
    }))
    .filter(group => group.items.length > 0)
})
</script>

<template>
  <aside class="sidebar" :class="{ collapsed }">
    <div class="sidebar-brand">
      <svg viewBox="0 0 32 32" fill="none" class="sidebar-logo">
        <rect width="32" height="32" rx="8" fill="#2563eb"/>
        <path d="M24 12c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm-1 15v-4h-4l5-7v4h4l-5 7z" fill="white"/>
      </svg>
      <span class="sidebar-title">云脑诊疗平台</span>
    </div>
    <nav class="sidebar-nav">
      <div v-for="group in menuGroups" :key="group.title" class="nav-group">
        <div class="nav-group-title" v-if="group.title">{{ group.title }}</div>
        <router-link
          v-for="item in group.items"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: route.path === item.path }"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  min-height: 100vh;
  background: #1e293b;
  color: #e2e8f0;
  flex-shrink: 0;
  overflow-y: auto;
  transition: transform 0.25s ease, width 0.25s ease;
}
.sidebar-brand { display: flex; align-items: center; gap: 8px; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.08); white-space: nowrap; }
.sidebar-logo { width: 28px; height: 28px; flex-shrink: 0; }
.sidebar-title { font-size: 0.95rem; font-weight: 700; white-space: nowrap; }
.sidebar-nav { padding: 0.75rem 0; }
.nav-group { margin-bottom: 0.5rem; }
.nav-group-title { padding: 0.5rem 1.25rem 0.25rem; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; white-space: nowrap; }
.nav-item { display: flex; align-items: center; gap: 8px; padding: 0.6rem 1.25rem; font-size: 0.875rem; color: #cbd5e1; text-decoration: none; transition: all 0.15s; border-left: 3px solid transparent; white-space: nowrap; }
.nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
.nav-item.active { background: rgba(37, 99, 235, 0.2); color: #fff; border-left-color: #3b82f6; }
.nav-icon { width: 18px; text-align: center; flex-shrink: 0; }
.nav-label { overflow: hidden; }

@media (max-width: 768px) {
  .sidebar { position: fixed; left: 0; top: 0; z-index: 100; height: 100vh; }
  .sidebar.collapsed { transform: translateX(-100%); }
}
</style>
