<script setup>
import { ref, watch, onMounted } from 'vue'
import { useCrud } from '../../composables/useCrud'
import { diseaseApi } from '../../api/disease'
import Pagination from '../../components/Pagination.vue'

const crud = useCrud(diseaseApi)
const { records, total, pageNum, loading, searchParams, modalVisible, modalTitle, submitting, handleSearch, handleReset, handlePageChange, openCreate, openEdit, handleSubmit, fetchList } = crud

let timer = null
watch(() => searchParams.keyword, (val) => {
  clearTimeout(timer)
  timer = setTimeout(() => handleSearch(), 300)
})

const form = ref({})
function openCreate_() { form.value = { diseaseCode: '', diseaseName: '', diseaseICD: '', diseaseCategory: '' }; crud.openCreate() }
function openEdit_(item) { form.value = { diseaseCode: item.diseaseCode, diseaseName: item.diseaseName, diseaseICD: item.diseaseICD, diseaseCategory: item.diseaseCategory }; crud.openEdit(item) }
async function submit() { await crud.handleSubmit(form.value) }

onMounted(() => fetchList())
</script>

<template>
  <div class="page">
    <div class="page-toolbar">
      <input v-model="searchParams.keyword" class="form-input" style="width:260px" placeholder="疾病名称或ICD编码" @keyup.enter="handleSearch()" />
      <button class="btn btn-primary" @click="handleSearch()">搜索</button>
      <button class="btn btn-ghost" @click="handleReset()">重置</button>
    </div>
    <div class="page-header"><h3>疾病管理</h3><button class="btn btn-primary" @click="openCreate_">+ 新增</button></div>
    <div v-if="loading" class="table-placeholder">加载中...</div>
    <table class="table" v-else>
      <thead><tr><th>ID</th><th>编码</th><th>名称</th><th>ICD编码</th><th>分类</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="r in records" :key="r.id">
          <td>{{ r.id }}</td><td>{{ r.diseaseCode }}</td><td>{{ r.diseaseName }}</td><td>{{ r.diseaseICD }}</td><td>{{ r.diseaseCategory }}</td>
          <td><a href="#" @click.prevent="openEdit_(r)">编辑</a></td>
        </tr>
        <tr v-if="records.length === 0"><td colspan="6" class="empty">暂无数据</td></tr>
      </tbody>
    </table>
    <Pagination :total="total" :page-num="pageNum" :page-size="10" @change="handlePageChange" />

    <div class="modal-overlay" v-if="modalVisible" @click.self="modalVisible = false">
      <div class="modal">
        <div class="modal-header"><h4>{{ modalTitle }}疾病</h4><button class="modal-close" @click="modalVisible = false">&times;</button></div>
        <form class="modal-body" @submit.prevent="submit">
          <div class="form-group"><label class="form-label">编码</label><input v-model="form.diseaseCode" class="form-input" required /></div>
          <div class="form-group"><label class="form-label">名称</label><input v-model="form.diseaseName" class="form-input" required /></div>
          <div class="form-group"><label class="form-label">ICD编码</label><input v-model="form.diseaseICD" class="form-input" /></div>
          <div class="form-group"><label class="form-label">分类</label><input v-model="form.diseaseCategory" class="form-input" /></div>
          <button type="submit" class="btn btn-primary" :disabled="submitting" style="width:100%">{{ submitting ? '提交中...' : '提交' }}</button>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>@import '../../assets/page.css';</style>
