<script setup>
import { ref, onMounted } from 'vue'
import { useCrud } from '../../composables/useCrud'
import { prescriptionApi } from '../../api/prescription'
import Pagination from '../../components/Pagination.vue'

const crud = useCrud(prescriptionApi)
const { records, total, pageNum, loading, searchParams, modalVisible, submitting, handleSearch, handleReset, handlePageChange, openCreate, openEdit, handleSubmit, fetchList } = crud

const form = ref({})
function openCreate_() { form.value = { registerId: '', drugId: '', drugUsage: '', drugNumber: '' }; crud.openCreate() }
function openEdit_(item) {
  form.value = { drugUsage: item.drugUsage || '', drugNumber: item.drugNumber || '', drugState: item.drugState || '' }
  crud.openEdit(item)
}
async function submit() { await crud.handleSubmit(form.value) }

onMounted(() => fetchList())
</script>

<template>
  <div class="page">
    <div class="page-toolbar">
      <input v-model="searchParams.registerId" class="form-input" style="width:130px" placeholder="挂号ID" @keyup.enter="handleSearch()" />
      <select v-model="searchParams.drugState" class="form-input" style="width:120px" @change="handleSearch()">
        <option value="">全部状态</option><option>待发药</option><option>已发药</option>
      </select>
      <button class="btn btn-primary" @click="handleSearch()">搜索</button><button class="btn btn-ghost" @click="handleReset()">重置</button>
    </div>
    <div class="page-header"><h3>处方管理</h3><button class="btn btn-primary" @click="openCreate_">+ 新增</button></div>
    <div v-if="loading" class="table-placeholder">加载中...</div>
    <table class="table" v-else>
      <thead><tr><th>ID</th><th>挂号ID</th><th>药品</th><th>规格</th><th>用法</th><th>数量</th><th>状态</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="r in records" :key="r.id">
          <td>{{ r.id }}</td><td>{{ r.registerId }}</td><td>{{ r.drugName }}</td><td>{{ r.drugFormat }}</td><td>{{ r.drugUsage }}</td><td>{{ r.drugNumber }}</td><td>{{ r.drugState }}</td>
          <td><a href="#" @click.prevent="openEdit_(r)">编辑</a></td>
        </tr>
        <tr v-if="records.length === 0"><td colspan="8" class="empty">暂无数据</td></tr>
      </tbody>
    </table>
    <Pagination :total="total" :page-num="pageNum" :page-size="10" @change="handlePageChange" />

    <div class="modal-overlay" v-if="modalVisible && !crud.editingItem.value" @click.self="modalVisible = false">
      <div class="modal">
        <div class="modal-header"><h4>新增处方</h4><button class="modal-close" @click="modalVisible = false">&times;</button></div>
        <form class="modal-body" @submit.prevent="submit">
          <div class="form-group"><label class="form-label">挂号ID*</label><input v-model="form.registerId" class="form-input" type="number" required /></div>
          <div class="form-group"><label class="form-label">药品ID*</label><input v-model="form.drugId" class="form-input" type="number" required /></div>
          <div class="form-group"><label class="form-label">用法</label><input v-model="form.drugUsage" class="form-input" /></div>
          <div class="form-group"><label class="form-label">数量</label><input v-model="form.drugNumber" class="form-input" type="number" /></div>
          <button type="submit" class="btn btn-primary" :disabled="submitting" style="width:100%">{{ submitting ? '提交中...' : '提交' }}</button>
        </form>
      </div>
    </div>

    <div class="modal-overlay" v-if="modalVisible && crud.editingItem.value" @click.self="modalVisible = false">
      <div class="modal">
        <div class="modal-header"><h4>修改处方</h4><button class="modal-close" @click="modalVisible = false">&times;</button></div>
        <form class="modal-body" @submit.prevent="submit">
          <div class="form-group"><label class="form-label">用法</label><input v-model="form.drugUsage" class="form-input" /></div>
          <div class="form-group"><label class="form-label">数量</label><input v-model="form.drugNumber" class="form-input" type="number" /></div>
          <div class="form-group"><label class="form-label">状态</label><select v-model="form.drugState" class="form-input"><option>待发药</option><option>已发药</option></select></div>
          <button type="submit" class="btn btn-primary" :disabled="submitting" style="width:100%">{{ submitting ? '提交中...' : '提交' }}</button>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>@import '../../assets/page.css';</style>
