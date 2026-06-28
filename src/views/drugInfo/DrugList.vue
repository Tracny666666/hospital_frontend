<script setup>
import { ref, watch, onMounted } from 'vue'
import { useCrud } from '../../composables/useCrud'
import { drugInfoApi } from '../../api/drugInfo'
import Pagination from '../../components/Pagination.vue'

const crud = useCrud(drugInfoApi)
const { records, total, pageNum, loading, searchParams, modalVisible, modalTitle, submitting, handleSearch, handleReset, handlePageChange, openCreate, openEdit, handleSubmit, fetchList } = crud

let timer = null
watch(() => searchParams.keyword, (val) => {
  clearTimeout(timer)
  timer = setTimeout(() => handleSearch(), 300)
})

const form = ref({})
function openCreate_() { form.value = { drugCode: '', drugName: '', drugFormat: '', drugUnit: '', manufacturer: '', drugDosage: '', drugType: '', drugPrice: '' }; crud.openCreate() }
function openEdit_(item) { form.value = { drugCode: item.drugCode, drugName: item.drugName, drugFormat: item.drugFormat, drugUnit: item.drugUnit, manufacturer: item.manufacturer, drugDosage: item.drugDosage, drugType: item.drugType, drugPrice: item.drugPrice }; crud.openEdit(item) }
async function submit() { const data = { ...form.value }; data.drugPrice = data.drugPrice ? Number(data.drugPrice) : null; await crud.handleSubmit(data) }

onMounted(() => fetchList())
</script>

<template>
  <div class="page">
    <div class="page-toolbar">
      <input v-model="searchParams.keyword" class="form-input" style="width:200px" placeholder="名称/拼音码" @keyup.enter="handleSearch()" />
      <select v-model="searchParams.drugType" class="form-input" style="width:130px" @change="handleSearch()">
        <option value="">全部类型</option>
        <option value="西药">西药</option><option value="中成药">中成药</option><option value="中草药">中草药</option>
      </select>
      <button class="btn btn-primary" @click="handleSearch()">搜索</button>
      <button class="btn btn-ghost" @click="handleReset()">重置</button>
    </div>
    <div class="page-header"><h3>药品信息管理</h3><button class="btn btn-primary" @click="openCreate_">+ 新增</button></div>
    <div v-if="loading" class="table-placeholder">加载中...</div>
    <table class="table" v-else>
      <thead><tr><th>ID</th><th>编码</th><th>名称</th><th>规格</th><th>单位</th><th>厂家</th><th>价格</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="r in records" :key="r.id">
          <td>{{ r.id }}</td><td>{{ r.drugCode }}</td><td>{{ r.drugName }}</td><td>{{ r.drugFormat }}</td><td>{{ r.drugUnit }}</td><td>{{ r.manufacturer }}</td><td>{{ r.drugPrice }}</td>
          <td><a href="#" @click.prevent="openEdit_(r)">编辑</a></td>
        </tr>
        <tr v-if="records.length === 0"><td colspan="8" class="empty">暂无数据</td></tr>
      </tbody>
    </table>
    <Pagination :total="total" :page-num="pageNum" :page-size="10" @change="handlePageChange" />

    <div class="modal-overlay" v-if="modalVisible" @click.self="modalVisible = false">
      <div class="modal">
        <div class="modal-header"><h4>{{ modalTitle }}药品</h4><button class="modal-close" @click="modalVisible = false">&times;</button></div>
        <form class="modal-body" @submit.prevent="submit">
          <div class="form-row">
            <div class="form-group" style="flex:1"><label class="form-label">编码</label><input v-model="form.drugCode" class="form-input" required /></div>
            <div class="form-group" style="flex:1"><label class="form-label">名称</label><input v-model="form.drugName" class="form-input" required /></div>
          </div>
          <div class="form-row">
            <div class="form-group" style="flex:1"><label class="form-label">规格</label><input v-model="form.drugFormat" class="form-input" /></div>
            <div class="form-group" style="flex:1"><label class="form-label">单位</label><input v-model="form.drugUnit" class="form-input" /></div>
          </div>
          <div class="form-group"><label class="form-label">厂家</label><input v-model="form.manufacturer" class="form-input" /></div>
          <div class="form-row">
            <div class="form-group" style="flex:1"><label class="form-label">剂型</label><input v-model="form.drugDosage" class="form-input" /></div>
            <div class="form-group" style="flex:1"><label class="form-label">类型</label><select v-model="form.drugType" class="form-input"><option value="">请选择</option><option>西药</option><option>中成药</option><option>中草药</option></select></div>
            <div class="form-group" style="flex:1"><label class="form-label">单价</label><input v-model="form.drugPrice" class="form-input" type="number" step="0.01" /></div>
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
