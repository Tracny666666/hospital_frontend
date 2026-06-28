import { createRouter, createWebHistory } from 'vue-router'
import { authStore } from '../stores/auth.js'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'doctor', 'patient'] },
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'Dashboard', component: () => import('../views/DashboardView.vue'), meta: { roles: ['admin', 'doctor', 'patient'] } },
      // 业务管理
      { path: 'register/:id', name: 'RegisterDetail', component: () => import('../views/register/RegisterDetail.vue'), meta: { roles: ['admin', 'doctor', 'patient'] } },
      { path: 'register', name: 'Register', component: () => import('../views/register/RegisterList.vue'), meta: { roles: ['admin', 'doctor'] } },
      // 字典管理
      { path: 'employee', name: 'Employee', component: () => import('../views/employee/EmpList.vue'), meta: { roles: ['admin'] } },
      { path: 'department', name: 'Department', component: () => import('../views/department/DeptList.vue'), meta: { roles: ['admin'] } },
      { path: 'scheduling', name: 'Scheduling', component: () => import('../views/scheduling/SchedulingList.vue'), meta: { roles: ['admin'] } },
      { path: 'regist-level', name: 'RegistLevel', component: () => import('../views/registLevel/LevelList.vue'), meta: { roles: ['admin'] } },
      { path: 'settle-category', name: 'SettleCategory', component: () => import('../views/settleCategory/CategoryList.vue'), meta: { roles: ['admin'] } },
      { path: 'medical-technology', name: 'MedicalTechnology', component: () => import('../views/medicalTechnology/MedTechList.vue'), meta: { roles: ['admin', 'doctor'] } },
      { path: 'drug-info', name: 'DrugInfo', component: () => import('../views/drugInfo/DrugList.vue'), meta: { roles: ['admin', 'doctor'] } },
      { path: 'disease', name: 'Disease', component: () => import('../views/disease/DiseaseList.vue'), meta: { roles: ['admin', 'doctor'] } },
      // 医技管理
      { path: 'check-request', name: 'CheckRequest', component: () => import('../views/checkRequest/CheckRequestList.vue'), meta: { roles: ['admin', 'doctor'] } },
      { path: 'inspection-request', name: 'InspectionRequest', component: () => import('../views/inspectionRequest/InspectionList.vue'), meta: { roles: ['admin', 'doctor'] } },
      { path: 'disposal-request', name: 'DisposalRequest', component: () => import('../views/disposalRequest/DisposalList.vue'), meta: { roles: ['admin', 'doctor'] } },
      { path: 'prescription', name: 'Prescription', component: () => import('../views/prescription/PrescriptionList.vue'), meta: { roles: ['admin', 'doctor'] } },
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // 认证检查
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
    return
  }
  if (to.path === '/login' && authStore.isLoggedIn) {
    next('/')
    return
  }

  // 角色检查
  if (to.meta.roles && !to.meta.roles.includes(authStore.role)) {
    next('/dashboard')
    return
  }

  next()
})

export default router
