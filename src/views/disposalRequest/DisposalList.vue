<script setup>
import { ref, onMounted } from 'vue'
import { useCrud } from '../../composables/useCrud'
import { disposalRequestApi } from '../../api/disposalRequest'
import Pagination from '../../components/Pagination.vue'

const crud = useCrud(disposalRequestApi)
const { records, total, pageNum, loading, searchParams, modalVisible, submitting, handleSearch, handleReset, handlePageChange, openCreate, openEdit, handleSubmit, fetchList } = crud

const form = ref({})
function openCreate_() { form.value = { registerId: '', medicalTechnologyId: '', disposalInfo: '', disposalPosition: '' }; crud.openCreate() }
function openEdit_(item) {
  form.value = { disposalEmployeeId: item.disposalEmployeeId || '', disposalTime: item.disposalTime || '', disposalResult: item.disposalResult || '', disposalState: item.disposalState || '', disposalRemark: item.disposalRemark || '' }
  crud.openEdit(item)
}
async function submit() { await crud.handleSubmit(form.value) }

onMounted(() => fetchList())
</script>

<template>
  <div class="page">
    <div class="page-toolbar">
      <input v-model="searchParams.registerId" class="form-input" style="width:130px" placeholder="挂号ID" @keyup.enter="handleSearch()" />
      <select v-model="searchParams.disposalState" class="form-input" style="width:120px" @change="handleSearch()">
        <option value="">全部状态</option><option>待处置</option><option>已完成</option>
      </select>
      <button class="btn btn-primary" @click="handleSearch()">搜索</button><button class="btn btn-ghost" @click="handleReset()">重置</button>
    </div>
    <div class="page-header"><h3>处置申请管理</h3><button class="btn btn-primary" @click="openCreate_">+ 新增</button></div>
    <div v-if="loading" class="table-placeholder">加载中...</div>
    <table class="table" v-else>
      <thead><tr><th>ID</th><th>挂号ID</th><th>项目</th><th>部位</th><th>状态</th><th>结果</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="r in records" :key="r.id">
          <td>{{ r.id }}</td><td>{{ r.registerId }}</td><td>{{ r.techName }}</td><td>{{ r.disposalPosition }}</td><td>{{ r.disposalState }}</td><td>{{ r.disposalResult?.substring(0,20) || '-' }}</td>
          <td><a href="#" @click.prevent="openEdit_(r)">编辑</a></td>
        </tr>
        <tr v-if="records.length === 0"><td colspan="7" class="empty">暂无数据</td></tr>
      </tbody>
    </table>
    <Pagination :total="total" :page-num="pageNum" :page-size="10" @change="handlePageChange" />

    <div class="modal-overlay" v-if="modalVisible && !crud.editingItem.value" @click.self="modalVisible = false">
      <div class="modal">
        <div class="modal-header"><h4>新增处置申请</h4><button class="modal-close" @click="modalVisible = false">&times;</button></div>
        <form class="modal-body" @submit.prevent="submit">
          <div class="form-group"><label class="form-label">挂号ID*</label><input v-model="form.registerId" class="form-input" type="number" required /></div>
          <div class="form-group"><label class="form-label">医技项目ID*</label><input v-model="form.medicalTechnologyId" class="form-input" type="number" required /></div>
          <div class="form-group"><label class="form-label">处置信息</label><input v-model="form.disposalInfo" class="form-input" /></div>
          <div class="form-group"><label class="form-label">处置部位</label><input v-model="form.disposalPosition" class="form-input" /></div>
          <button type="submit" class="btn btn-primary" :disabled="submitting" style="width:100%">{{ submitting ? '提交中...' : '提交' }}</button>
        </form>
      </div>
    </div>

    <div class="modal-overlay" v-if="modalVisible && crud.editingItem.value" @click.self="modalVisible = false">
      <div class="modal">
        <div class="modal-header"><h4>录入处置结果</h4><button class="modal-close" @click="modalVisible = false">&times;</button></div>
        <form class="modal-body" @submit.prevent="submit">
          <div class="form-group"><label class="form-label">处置医生ID</label><input v-model="form.disposalEmployeeId" class="form-input" type="number" /></div>
          <div class="form-group"><label class="form-label">处置时间</label><input v-model="form.disposalTime" class="form-input" type="datetime-local" /></div>
          <div class="form-group"><label class="form-label">处置结果</label><textarea v-model="form.disposalResult" class="form-input" rows="3"></textarea></div>
          <div class="form-group"><label class="form-label">状态</label><input v-model="form.disposalState" class="form-input" /></div>
          <div class="form-group"><label class="form-label">备注</label><input v-model="form.disposalRemark" class="form-input" /></div>
          <button type="submit" class="btn btn-primary" :disabled="submitting" style="width:100%">{{ submitting ? '提交中...' : '提交' }}</button>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>@import '../../assets/page.css';</style>
