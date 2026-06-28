<script setup>
import { ref, onMounted } from 'vue'
import { useCrud } from '../../composables/useCrud'
import { departmentApi } from '../../api/department'
import Pagination from '../../components/Pagination.vue'

const crud = useCrud(departmentApi)
const { records, total, pageNum, loading, searchParams, modalVisible, modalTitle, submitting, handleSearch, handleReset, handlePageChange, openCreate, openEdit, handleSubmit, handleDelete, fetchList } = crud

const form = ref({})
const formRef = ref(null)

function openCreate_() { form.value = { deptCode: '', deptName: '', deptType: '' }; crud.openCreate() }
function openEdit_(item) { form.value = { deptCode: item.deptCode, deptName: item.deptName, deptType: item.deptType }; crud.openEdit(item) }
async function submit() { await crud.handleSubmit(form.value) }
async function del(id) { if (confirm('确定删除？')) await crud.handleDelete(id) }

onMounted(() => fetchList())
</script>

<template>
  <div class="page">
    <div class="page-toolbar">
      <input v-model="searchParams.deptName" class="form-input" style="width:220px" placeholder="科室名称" @keyup.enter="handleSearch()" />
      <button class="btn btn-primary" @click="handleSearch()">搜索</button>
      <button class="btn btn-ghost" @click="handleReset()">重置</button>
    </div>
    <div class="page-header">
      <h3>科室管理</h3>
      <button class="btn btn-primary" @click="openCreate_">+ 新增</button>
    </div>
    <div v-if="loading" class="table-placeholder">加载中...</div>
    <table class="table" v-else>
      <thead><tr><th>ID</th><th>科室编码</th><th>科室名称</th><th>科室类型</th><th>状态</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="r in records" :key="r.id">
          <td>{{ r.id }}</td><td>{{ r.deptCode }}</td><td>{{ r.deptName }}</td><td>{{ r.deptType }}</td><td>{{ r.delmark === 1 ? '正常' : '已删除' }}</td>
          <td><a href="#" @click.prevent="openEdit_(r)">编辑</a> <a href="#" @click.prevent="del(r.id)" style="color:#ef4444">删除</a></td>
        </tr>
        <tr v-if="records.length === 0"><td colspan="6" class="empty">暂无数据</td></tr>
      </tbody>
    </table>
    <Pagination :total="total" :page-num="pageNum" :page-size="10" @change="handlePageChange" />

    <!-- Modal -->
    <div class="modal-overlay" v-if="modalVisible" @click.self="modalVisible = false">
      <div class="modal">
        <div class="modal-header"><h4>{{ modalTitle }}科室</h4><button class="modal-close" @click="modalVisible = false">&times;</button></div>
        <form class="modal-body" @submit.prevent="submit">
          <div class="form-group"><label class="form-label">科室编码</label><input v-model="form.deptCode" class="form-input" required /></div>
          <div class="form-group"><label class="form-label">科室名称</label><input v-model="form.deptName" class="form-input" required /></div>
          <div class="form-group"><label class="form-label">科室类型</label><input v-model="form.deptType" class="form-input" /></div>
          <button type="submit" class="btn btn-primary" :disabled="submitting" style="width:100%">{{ submitting ? '提交中...' : '提交' }}</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../../assets/page.css';
</style>
