<script setup>
import { ref, onMounted } from 'vue'
import { useCrud } from '../../composables/useCrud'
import { medicalTechnologyApi } from '../../api/medicalTechnology'
import { departmentApi } from '../../api/department'
import Pagination from '../../components/Pagination.vue'

const crud = useCrud(medicalTechnologyApi)
const { records, total, pageNum, loading, searchParams, modalVisible, modalTitle, submitting, handleSearch, handleReset, handlePageChange, openCreate, openEdit, handleSubmit, fetchList } = crud

const deptOptions = ref([])

const form = ref({})
function openCreate_() { form.value = { techCode: '', techName: '', techFormat: '', techPrice: '', techType: '', priceType: '', deptmentId: '' }; crud.openCreate() }
function openEdit_(item) { form.value = { techCode: item.techCode, techName: item.techName, techFormat: item.techFormat, techPrice: item.techPrice, techType: item.techType, priceType: item.priceType, deptmentId: item.deptmentId }; crud.openEdit(item) }
async function submit() {
  const data = { ...form.value }
  data.deptmentId = data.deptmentId ? Number(data.deptmentId) : null
  data.techPrice = data.techPrice ? Number(data.techPrice) : null
  await crud.handleSubmit(data)
}

onMounted(async () => {
  fetchList()
  deptOptions.value = await departmentApi.all() || []
})
</script>

<template>
  <div class="page">
    <div class="page-toolbar">
      <input v-model="searchParams.techName" class="form-input" style="width:180px" placeholder="项目名称" @keyup.enter="handleSearch()" />
      <input v-model="searchParams.techType" class="form-input" style="width:120px" placeholder="类型" @keyup.enter="handleSearch()" />
      <select v-model="searchParams.deptmentId" class="form-input" style="width:140px" @change="handleSearch()">
        <option value="">全部科室</option>
        <option v-for="d in deptOptions" :key="d.id" :value="d.id">{{ d.deptName }}</option>
      </select>
      <button class="btn btn-primary" @click="handleSearch()">搜索</button>
      <button class="btn btn-ghost" @click="handleReset()">重置</button>
    </div>
    <div class="page-header"><h3>医技项目管理</h3><button class="btn btn-primary" @click="openCreate_">+ 新增</button></div>
    <div v-if="loading" class="table-placeholder">加载中...</div>
    <table class="table" v-else>
      <thead><tr><th>ID</th><th>编码</th><th>名称</th><th>规格</th><th>价格</th><th>类型</th><th>科室</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="r in records" :key="r.id">
          <td>{{ r.id }}</td><td>{{ r.techCode }}</td><td>{{ r.techName }}</td><td>{{ r.techFormat }}</td><td>{{ r.techPrice }}</td><td>{{ r.techType }}</td><td>{{ r.deptName }}</td>
          <td><a href="#" @click.prevent="openEdit_(r)">编辑</a></td>
        </tr>
        <tr v-if="records.length === 0"><td colspan="8" class="empty">暂无数据</td></tr>
      </tbody>
    </table>
    <Pagination :total="total" :page-num="pageNum" :page-size="10" @change="handlePageChange" />

    <div class="modal-overlay" v-if="modalVisible" @click.self="modalVisible = false">
      <div class="modal">
        <div class="modal-header"><h4>{{ modalTitle }}医技项目</h4><button class="modal-close" @click="modalVisible = false">&times;</button></div>
        <form class="modal-body" @submit.prevent="submit">
          <div class="form-group"><label class="form-label">编码</label><input v-model="form.techCode" class="form-input" required /></div>
          <div class="form-group"><label class="form-label">名称</label><input v-model="form.techName" class="form-input" required /></div>
          <div class="form-group"><label class="form-label">规格</label><input v-model="form.techFormat" class="form-input" /></div>
          <div class="form-row">
            <div class="form-group" style="flex:1"><label class="form-label">价格</label><input v-model="form.techPrice" class="form-input" type="number" step="0.01" /></div>
            <div class="form-group" style="flex:1"><label class="form-label">类型</label><input v-model="form.techType" class="form-input" /></div>
          </div>
          <div class="form-row">
            <div class="form-group" style="flex:1"><label class="form-label">费用分类</label><input v-model="form.priceType" class="form-input" /></div>
            <div class="form-group" style="flex:1">
              <label class="form-label">科室</label>
              <select v-model="form.deptmentId" class="form-input">
                <option value="">请选择</option>
                <option v-for="d in deptOptions" :key="d.id" :value="d.id">{{ d.deptName }}</option>
              </select>
            </div>
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
