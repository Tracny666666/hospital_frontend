<script setup>
import { ref, watch, onMounted } from 'vue'
import { useCrud } from '../../composables/useCrud'
import { useToast } from '../../composables/useToast'
import { useRouter } from 'vue-router'
import { registerApi } from '../../api/register'
import { departmentApi } from '../../api/department'
import { employeeApi } from '../../api/employee'
import { registLevelApi } from '../../api/registLevel'
import { settleCategoryApi } from '../../api/settleCategory'
import Pagination from '../../components/Pagination.vue'

const router = useRouter()
const toast = useToast()
const crud = useCrud(registerApi)
const { records, total, pageNum, loading, searchParams, modalVisible, submitting, handleSearch, handleReset, handlePageChange, openCreate, openEdit, handleSubmit, fetchList } = crud

const deptOptions = ref([])
const doctorOptions = ref([])
const levelOptions = ref([])
const categoryOptions = ref([])

const form = ref({})
function openCreate_() {
  form.value = { caseNumber: '', realName: '', gender: '男', cardNumber: '', birthdate: '', age: '', ageType: '年', homeAddress: '', visitDate: '', noon: '上午', deptmentId: '', employeeId: '', registLevelId: '', settleCategoryId: '', isBook: '否', registMethod: '现金', registMoney: '' }
  doctorOptions.value = []
  crud.openCreate()
}
function openEdit_(item) {
  form.value = { visitState: item.visitState }
  crud.openEdit(item)
}
async function quickAction(id, state) {
  try {
    await registerApi.updateState(id, state)
    toast.success(state === 2 ? '已接诊' : state === 3 ? '已结束' : state === 4 ? '已退号' : '操作成功')
    fetchList()
  } catch (e) { toast.error(e.message || '操作失败') }
}
function goDetail(id) { router.push(`/register/${id}`) }
async function submit() {
  const data = { ...form.value }
  data.deptmentId = data.deptmentId ? Number(data.deptmentId) : null
  data.employeeId = data.employeeId ? Number(data.employeeId) : null
  data.registLevelId = data.registLevelId ? Number(data.registLevelId) : null
  data.settleCategoryId = data.settleCategoryId ? Number(data.settleCategoryId) : null
  data.age = data.age ? Number(data.age) : null
  data.registMoney = data.registMoney ? Number(data.registMoney) : null
  await crud.handleSubmit(data)
}

watch(() => form.value.deptmentId, async (deptId) => {
  if (!deptId) { doctorOptions.value = []; return }
  const list = await employeeApi.listByDept(deptId)
  doctorOptions.value = list || []
})

onMounted(async () => {
  fetchList()
  const [depts, levels, cats] = await Promise.all([
    departmentApi.all(),
    registLevelApi.all(),
    settleCategoryApi.all()
  ])
  deptOptions.value = depts || []
  levelOptions.value = levels || []
  categoryOptions.value = cats || []
})
</script>

<template>
  <div class="page">
    <div class="page-toolbar">
      <input v-model="searchParams.caseNumber" class="form-input" style="width:150px" placeholder="病历号" @keyup.enter="handleSearch()" />
      <input v-model="searchParams.realName" class="form-input" style="width:120px" placeholder="姓名" @keyup.enter="handleSearch()" />
      <select v-model="searchParams.visitState" class="form-input" style="width:130px" @change="handleSearch()">
        <option value="">全部状态</option><option value="1">已挂号</option><option value="2">医生接诊</option><option value="3">看诊结束</option><option value="4">已退号</option>
      </select>
      <select v-model="searchParams.deptmentId" class="form-input" style="width:140px" @change="handleSearch()">
        <option value="">全部科室</option>
        <option v-for="d in deptOptions" :key="d.id" :value="d.id">{{ d.deptName }}</option>
      </select>
      <button class="btn btn-primary" @click="handleSearch()">搜索</button>
      <button class="btn btn-ghost" @click="handleReset()">重置</button>
    </div>
    <div class="page-header"><h3>挂号管理</h3><button class="btn btn-primary" @click="openCreate_">+ 新增</button></div>
    <div v-if="loading" class="table-placeholder">加载中...</div>
    <table class="table" v-else>
      <thead><tr><th>ID</th><th>病历号</th><th>姓名</th><th>性别</th><th>科室</th><th>医生</th><th>挂号费</th><th>状态</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="r in records" :key="r.id" style="cursor:pointer" @click="goDetail(r.id)">
          <td>{{ r.id }}</td><td>{{ r.caseNumber }}</td><td><a href="#" @click.prevent.stop="goDetail(r.id)">{{ r.realName }}</a></td><td>{{ r.gender }}</td><td>{{ r.deptName }}</td><td>{{ r.employeeName }}</td><td>{{ r.registMoney }}</td>
          <td>{{ {1:'已挂号',2:'接诊中',3:'已结束',4:'已退号'}[r.visitState] }}</td>
          <td @click.stop>
            <template v-if="r.visitState === 1">
              <a href="#" @click.prevent="quickAction(r.id, 2)">接诊</a>
            </template>
            <template v-if="r.visitState === 2">
              <a href="#" @click.prevent="quickAction(r.id, 3)">结束</a>
            </template>
            <template v-if="r.visitState !== 4 && r.visitState !== 3">
              <a href="#" @click.prevent="quickAction(r.id, 4)" style="color:#ef4444">退号</a>
            </template>
            <a href="#" @click.prevent.stop="openEdit_(r)">更多</a>
          </td>
        </tr>
        <tr v-if="records.length === 0"><td colspan="9" class="empty">暂无数据</td></tr>
      </tbody>
    </table>
    <Pagination :total="total" :page-num="pageNum" :page-size="10" @change="handlePageChange" />

    <!-- 新增挂号 -->
    <div class="modal-overlay" v-if="modalVisible && !crud.editingItem.value" @click.self="modalVisible = false">
      <div class="modal" style="max-width:640px">
        <div class="modal-header"><h4>新增挂号</h4><button class="modal-close" @click="modalVisible = false">&times;</button></div>
        <form class="modal-body" @submit.prevent="submit">
          <div class="form-row">
            <div class="form-group" style="flex:1"><label class="form-label">病历号*</label><input v-model="form.caseNumber" class="form-input" required /></div>
            <div class="form-group" style="flex:1"><label class="form-label">姓名*</label><input v-model="form.realName" class="form-input" required /></div>
          </div>
          <div class="form-row">
            <div class="form-group" style="flex:1"><label class="form-label">性别*</label><select v-model="form.gender" class="form-input"><option>男</option><option>女</option></select></div>
            <div class="form-group" style="flex:1"><label class="form-label">身份证号</label><input v-model="form.cardNumber" class="form-input" /></div>
          </div>
          <div class="form-row">
            <div class="form-group" style="flex:1"><label class="form-label">出生日期</label><input v-model="form.birthdate" class="form-input" type="date" /></div>
            <div class="form-group" style="flex:0.5"><label class="form-label">年龄</label><input v-model="form.age" class="form-input" type="number" /></div>
            <div class="form-group" style="flex:0.5"><label class="form-label">类型</label><select v-model="form.ageType" class="form-input"><option>年</option><option>天</option></select></div>
          </div>
          <div class="form-group"><label class="form-label">家庭住址</label><input v-model="form.homeAddress" class="form-input" /></div>
          <div class="form-row">
            <div class="form-group" style="flex:1">
              <label class="form-label">科室*</label>
              <select v-model="form.deptmentId" class="form-input" required>
                <option value="">请选择</option>
                <option v-for="d in deptOptions" :key="d.id" :value="d.id">{{ d.deptName }}</option>
              </select>
            </div>
            <div class="form-group" style="flex:1">
              <label class="form-label">医生</label>
              <select v-model="form.employeeId" class="form-input">
                <option value="">请选择科室后加载</option>
                <option v-for="e in doctorOptions" :key="e.id" :value="e.id">{{ e.realname }}</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group" style="flex:1">
              <label class="form-label">挂号级别*</label>
              <select v-model="form.registLevelId" class="form-input" required>
                <option value="">请选择</option>
                <option v-for="l in levelOptions" :key="l.id" :value="l.id">{{ l.registName }} (¥{{ l.registFee }})</option>
              </select>
            </div>
            <div class="form-group" style="flex:1">
              <label class="form-label">结算类别*</label>
              <select v-model="form.settleCategoryId" class="form-input" required>
                <option value="">请选择</option>
                <option v-for="c in categoryOptions" :key="c.id" :value="c.id">{{ c.settleName }}</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group" style="flex:1"><label class="form-label">午别</label><select v-model="form.noon" class="form-input"><option>上午</option><option>下午</option></select></div>
            <div class="form-group" style="flex:1"><label class="form-label">收费方式</label><select v-model="form.registMethod" class="form-input"><option>现金</option><option>医保卡</option><option>微信</option><option>支付宝</option></select></div>
          </div>
          <div class="form-row">
            <div class="form-group" style="flex:1"><label class="form-label">是否记账</label><select v-model="form.isBook" class="form-input"><option>否</option><option>是</option></select></div>
            <div class="form-group" style="flex:1"><label class="form-label">挂号费</label><input v-model="form.registMoney" class="form-input" type="number" step="0.01" /></div>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="submitting" style="width:100%">{{ submitting ? '提交中...' : '提交' }}</button>
        </form>
      </div>
    </div>

    <!-- 编辑状态 -->
    <div class="modal-overlay" v-if="modalVisible && crud.editingItem.value" @click.self="modalVisible = false">
      <div class="modal">
        <div class="modal-header"><h4>修改状态</h4><button class="modal-close" @click="modalVisible = false">&times;</button></div>
        <form class="modal-body" @submit.prevent="submit">
          <div class="form-group">
            <label class="form-label">看诊状态</label>
            <select v-model="form.visitState" class="form-input">
              <option :value="1">1-已挂号</option><option :value="2">2-医生接诊</option><option :value="3">3-看诊结束</option><option :value="4">4-已退号</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="submitting" style="width:100%">{{ submitting ? '提交中...' : '提交' }}</button>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import '../../assets/page.css';
.form-row { display: flex; gap: 0.75rem; }
</style>
