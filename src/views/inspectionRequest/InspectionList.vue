<script setup>
import { ref, onMounted } from 'vue'
import { useCrud } from '../../composables/useCrud'
import { inspectionRequestApi } from '../../api/inspectionRequest'
import Pagination from '../../components/Pagination.vue'

const crud = useCrud(inspectionRequestApi)
const { records, total, pageNum, loading, searchParams, modalVisible, modalTitle, submitting, handleSearch, handleReset, handlePageChange, openCreate, openEdit, handleSubmit, fetchList } = crud

const form = ref({})
function openCreate_() { form.value = { registerId: '', medicalTechnologyId: '', inspectionInfo: '', inspectionPosition: '' }; crud.openCreate() }
function openEdit_(item) {
  form.value = { inspectionEmployeeId: item.inspectionEmployeeId || '', inspectionTime: item.inspectionTime || '', inspectionResult: item.inspectionResult || '', inspectionState: item.inspectionState || '', inspectionRemark: item.inspectionRemark || '' }
  crud.openEdit(item)
}
async function submit() { await crud.handleSubmit(form.value) }

onMounted(() => fetchList())
</script>

<template>
  <div class="page">
    <div class="page-toolbar">
      <input v-model="searchParams.registerId" class="form-input" style="width:130px" placeholder="挂号ID" @keyup.enter="handleSearch()" />
      <select v-model="searchParams.inspectionState" class="form-input" style="width:120px" @change="handleSearch()">
        <option value="">全部状态</option><option>待检验</option><option>已完成</option><option>已出结果</option>
      </select>
      <button class="btn btn-primary" @click="handleSearch()">搜索</button><button class="btn btn-ghost" @click="handleReset()">重置</button>
    </div>
    <div class="page-header"><h3>检验申请管理</h3><button class="btn btn-primary" @click="openCreate_">+ 新增</button></div>
    <div v-if="loading" class="table-placeholder">加载中...</div>
    <table class="table" v-else>
      <thead><tr><th>ID</th><th>挂号ID</th><th>项目</th><th>部位</th><th>状态</th><th>结果</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="r in records" :key="r.id">
          <td>{{ r.id }}</td><td>{{ r.registerId }}</td><td>{{ r.techName }}</td><td>{{ r.inspectionPosition }}</td><td>{{ r.inspectionState }}</td><td>{{ r.inspectionResult?.substring(0,20) || '-' }}</td>
          <td><a href="#" @click.prevent="openEdit_(r)">编辑</a></td>
        </tr>
        <tr v-if="records.length === 0"><td colspan="7" class="empty">暂无数据</td></tr>
      </tbody>
    </table>
    <Pagination :total="total" :page-num="pageNum" :page-size="10" @change="handlePageChange" />

    <div class="modal-overlay" v-if="modalVisible && !crud.editingItem.value" @click.self="modalVisible = false">
      <div class="modal">
        <div class="modal-header"><h4>新增检验申请</h4><button class="modal-close" @click="modalVisible = false">&times;</button></div>
        <form class="modal-body" @submit.prevent="submit">
          <div class="form-group"><label class="form-label">挂号ID*</label><input v-model="form.registerId" class="form-input" type="number" required /></div>
          <div class="form-group"><label class="form-label">医技项目ID*</label><input v-model="form.medicalTechnologyId" class="form-input" type="number" required /></div>
          <div class="form-group"><label class="form-label">检验信息</label><input v-model="form.inspectionInfo" class="form-input" /></div>
          <div class="form-group"><label class="form-label">检验部位</label><input v-model="form.inspectionPosition" class="form-input" /></div>
          <button type="submit" class="btn btn-primary" :disabled="submitting" style="width:100%">{{ submitting ? '提交中...' : '提交' }}</button>
        </form>
      </div>
    </div>

    <div class="modal-overlay" v-if="modalVisible && crud.editingItem.value" @click.self="modalVisible = false">
      <div class="modal">
        <div class="modal-header"><h4>录入检验结果</h4><button class="modal-close" @click="modalVisible = false">&times;</button></div>
        <form class="modal-body" @submit.prevent="submit">
          <div class="form-group"><label class="form-label">检验医生ID</label><input v-model="form.inspectionEmployeeId" class="form-input" type="number" /></div>
          <div class="form-group"><label class="form-label">检验时间</label><input v-model="form.inspectionTime" class="form-input" type="datetime-local" /></div>
          <div class="form-group"><label class="form-label">检验结果</label><textarea v-model="form.inspectionResult" class="form-input" rows="3"></textarea></div>
          <div class="form-group"><label class="form-label">状态</label><input v-model="form.inspectionState" class="form-input" /></div>
          <div class="form-group"><label class="form-label">备注</label><input v-model="form.inspectionRemark" class="form-input" /></div>
          <button type="submit" class="btn btn-primary" :disabled="submitting" style="width:100%">{{ submitting ? '提交中...' : '提交' }}</button>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>@import '../../assets/page.css';</style>
