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
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'Dashboard', component: () => import('../views/DashboardView.vue') },
      // 业务管理
      { path: 'register/:id', name: 'RegisterDetail', component: () => import('../views/register/RegisterDetail.vue') },
      { path: 'register', name: 'Register', component: () => import('../views/register/RegisterList.vue') },
      // 字典管理
      { path: 'employee', name: 'Employee', component: () => import('../views/employee/EmpList.vue') },
      { path: 'department', name: 'Department', component: () => import('../views/department/DeptList.vue') },
      { path: 'scheduling', name: 'Scheduling', component: () => import('../views/scheduling/SchedulingList.vue') },
      { path: 'regist-level', name: 'RegistLevel', component: () => import('../views/registLevel/LevelList.vue') },
      { path: 'settle-category', name: 'SettleCategory', component: () => import('../views/settleCategory/CategoryList.vue') },
      { path: 'medical-technology', name: 'MedicalTechnology', component: () => import('../views/medicalTechnology/MedTechList.vue') },
      { path: 'drug-info', name: 'DrugInfo', component: () => import('../views/drugInfo/DrugList.vue') },
      { path: 'disease', name: 'Disease', component: () => import('../views/disease/DiseaseList.vue') },
      // 医技管理
      { path: 'check-request', name: 'CheckRequest', component: () => import('../views/checkRequest/CheckRequestList.vue') },
      { path: 'inspection-request', name: 'InspectionRequest', component: () => import('../views/inspectionRequest/InspectionList.vue') },
      { path: 'disposal-request', name: 'DisposalRequest', component: () => import('../views/disposalRequest/DisposalList.vue') },
      { path: 'prescription', name: 'Prescription', component: () => import('../views/prescription/PrescriptionList.vue') },
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && authStore.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
