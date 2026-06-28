<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { registerApi } from '../../api/register'
import { checkRequestApi } from '../../api/checkRequest'
import { inspectionRequestApi } from '../../api/inspectionRequest'
import { disposalRequestApi } from '../../api/disposalRequest'
import { prescriptionApi } from '../../api/prescription'
import { useToast } from '../../composables/useToast'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const patient = ref(null)
const activeTab = ref('check')
const subRecords = ref([])
const subLoading = ref(false)

const tabs = [
  { key: 'check', label: '检查申请', api: checkRequestApi },
  { key: 'inspection', label: '检验申请', api: inspectionRequestApi },
  { key: 'disposal', label: '处置申请', api: disposalRequestApi },
  { key: 'prescription', label: '处方记录', api: prescriptionApi },
]

async function loadDetail() {
  try {
    patient.value = await registerApi.getById(route.params.id)
    document.title = `${patient.value.realName} - 挂号详情`
  } catch (e) {
    toast.error('加载失败')
    router.push('/register')
  }
}

async function loadSubRecords() {
  subLoading.value = true
  try {
    const tab = tabs.find(t => t.key === activeTab.value)
    if (tab) {
      const data = await tab.api.listByRegister(route.params.id)
      subRecords.value = data || []
    }
  } catch { subRecords.value = [] }
  finally { subLoading.value = false }
}

function switchTab(key) { activeTab.value = key; loadSubRecords() }

onMounted(() => { loadDetail(); loadSubRecords() })
</script>

<template>
  <div class="page" v-if="patient">
    <button class="btn btn-ghost" style="margin-bottom:1rem" @click="router.push('/register')">&larr; 返回列表</button>

    <!-- 患者信息 -->
    <div class="detail-card">
      <h3 style="margin-bottom:1rem">{{ patient.realName }} <span style="font-size:0.8rem;color:var(--color-text-secondary)">{{ patient.gender }} · {{ patient.age }}{{ patient.ageType }}</span></h3>
      <div class="detail-grid">
        <div><span class="dl">病历号</span><span class="dv">{{ patient.caseNumber }}</span></div>
        <div><span class="dl">身份证号</span><span class="dv">{{ patient.cardNumber }}</span></div>
        <div><span class="dl">住址</span><span class="dv">{{ patient.homeAddress }}</span></div>
        <div><span class="dl">科室</span><span class="dv">{{ patient.deptName }}</span></div>
        <div><span class="dl">医生</span><span class="dv">{{ patient.employeeName }}</span></div>
        <div><span class="dl">挂号级别</span><span class="dv">{{ patient.registLevelName }}</span></div>
        <div><span class="dl">结算类别</span><span class="dv">{{ patient.settleCategoryName }}</span></div>
        <div><span class="dl">挂号费</span><span class="dv">¥{{ patient.registMoney }}</span></div>
        <div><span class="dl">状态</span><span class="dv">{{ {1:'已挂号',2:'接诊中',3:'已结束',4:'已退号'}[patient.visitState] }}</span></div>
      </div>
    </div>

    <!-- 子列表 Tabs -->
    <div class="tabs">
      <button v-for="t in tabs" :key="t.key" class="tab-btn" :class="{ active: activeTab === t.key }" @click="switchTab(t.key)">{{ t.label }}</button>
    </div>

    <div v-if="subLoading" class="table-placeholder">加载中...</div>
    <table v-else class="table">
      <thead v-if="activeTab === 'check'"><tr><th>ID</th><th>项目</th><th>部位</th><th>检查医生</th><th>时间</th><th>结果</th><th>状态</th></tr></thead>
      <thead v-if="activeTab === 'inspection'"><tr><th>ID</th><th>项目</th><th>部位</th><th>检验医生</th><th>时间</th><th>结果</th><th>状态</th></tr></thead>
      <thead v-if="activeTab === 'disposal'"><tr><th>ID</th><th>项目</th><th>部位</th><th>处置医生</th><th>时间</th><th>结果</th><th>状态</th></tr></thead>
      <thead v-if="activeTab === 'prescription'"><tr><th>ID</th><th>药品</th><th>规格</th><th>用法</th><th>数量</th><th>状态</th></tr></thead>
      <tbody>
        <tr v-for="r in subRecords" :key="r.id">
          <template v-if="activeTab === 'check'">
            <td>{{ r.id }}</td><td>{{ r.techName }}</td><td>{{ r.checkPosition }}</td><td>{{ r.checkEmployeeId }}</td><td>{{ r.checkTime }}</td><td>{{ r.checkResult?.substring(0,30) || '-' }}</td><td>{{ r.checkState }}</td>
          </template>
          <template v-if="activeTab === 'inspection'">
            <td>{{ r.id }}</td><td>{{ r.techName }}</td><td>{{ r.inspectionPosition }}</td><td>{{ r.inspectionEmployeeId }}</td><td>{{ r.inspectionTime }}</td><td>{{ r.inspectionResult?.substring(0,30) || '-' }}</td><td>{{ r.inspectionState }}</td>
          </template>
          <template v-if="activeTab === 'disposal'">
            <td>{{ r.id }}</td><td>{{ r.techName }}</td><td>{{ r.disposalPosition }}</td><td>{{ r.disposalEmployeeId }}</td><td>{{ r.disposalTime }}</td><td>{{ r.disposalResult?.substring(0,30) || '-' }}</td><td>{{ r.disposalState }}</td>
          </template>
          <template v-if="activeTab === 'prescription'">
            <td>{{ r.id }}</td><td>{{ r.drugName }}</td><td>{{ r.drugFormat }}</td><td>{{ r.drugUsage }}</td><td>{{ r.drugNumber }}</td><td>{{ r.drugState }}</td>
          </template>
        </tr>
        <tr v-if="subRecords.length === 0"><td :colspan="activeTab==='prescription'?6:7" class="empty">暂无记录</td></tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.detail-card { background: #fff; border-radius: var(--radius); box-shadow: var(--shadow); padding: 1.5rem; margin-bottom: 1.5rem; }
.detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem 1.5rem; }
.dl { font-size: 0.8rem; color: var(--color-text-secondary); display: block; }
.dv { font-weight: 500; }
.tabs { display: flex; gap: 4px; margin-bottom: 1rem; }
.tab-btn { padding: 0.5rem 1.25rem; border: none; background: #e2e8f0; border-radius: 6px 6px 0 0; cursor: pointer; font-size: 0.875rem; }
.tab-btn.active { background: #fff; font-weight: 600; color: var(--color-primary); }
</style>
