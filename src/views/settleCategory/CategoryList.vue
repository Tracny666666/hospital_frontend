<script setup>
import { ref, onMounted } from 'vue'
import { useCrud } from '../../composables/useCrud'
import { settleCategoryApi } from '../../api/settleCategory'
import Pagination from '../../components/Pagination.vue'

const crud = useCrud(settleCategoryApi)
const { records, total, pageNum, loading, modalVisible, modalTitle, submitting, handleSearch, handleReset, handlePageChange, openCreate, openEdit, handleSubmit, handleDelete, fetchList } = crud

const form = ref({})
function openCreate_() { form.value = { settleCode: '', settleName: '', sequenceNo: '' }; crud.openCreate() }
function openEdit_(item) { form.value = { settleCode: item.settleCode, settleName: item.settleName, sequenceNo: item.sequenceNo }; crud.openEdit(item) }
async function submit() { await crud.handleSubmit(form.value) }
async function del(id) { if (confirm('确定删除？')) await crud.handleDelete(id) }

onMounted(() => fetchList())
</script>

<template>
  <div class="page">
    <div class="page-toolbar"><button class="btn btn-primary" @click="handleSearch()">搜索</button><button class="btn btn-ghost" @click="handleReset()">重置</button></div>
    <div class="page-header"><h3>结算类别管理</h3><button class="btn btn-primary" @click="openCreate_">+ 新增</button></div>
    <div v-if="loading" class="table-placeholder">加载中...</div>
    <table class="table" v-else>
      <thead><tr><th>ID</th><th>编码</th><th>名称</th><th>顺序</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="r in records" :key="r.id">
          <td>{{ r.id }}</td><td>{{ r.settleCode }}</td><td>{{ r.settleName }}</td><td>{{ r.sequenceNo }}</td>
          <td><a href="#" @click.prevent="openEdit_(r)">编辑</a> <a href="#" @click.prevent="del(r.id)" style="color:#ef4444">删除</a></td>
        </tr>
        <tr v-if="records.length === 0"><td colspan="5" class="empty">暂无数据</td></tr>
      </tbody>
    </table>
    <Pagination :total="total" :page-num="pageNum" :page-size="10" @change="handlePageChange" />

    <div class="modal-overlay" v-if="modalVisible" @click.self="modalVisible = false">
      <div class="modal">
        <div class="modal-header"><h4>{{ modalTitle }}结算类别</h4><button class="modal-close" @click="modalVisible = false">&times;</button></div>
        <form class="modal-body" @submit.prevent="submit">
          <div class="form-group"><label class="form-label">编码</label><input v-model="form.settleCode" class="form-input" required /></div>
          <div class="form-group"><label class="form-label">名称</label><input v-model="form.settleName" class="form-input" required /></div>
          <div class="form-group"><label class="form-label">顺序号</label><input v-model="form.sequenceNo" class="form-input" type="number" /></div>
          <button type="submit" class="btn btn-primary" :disabled="submitting" style="width:100%">{{ submitting ? '提交中...' : '提交' }}</button>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>@import '../../assets/page.css';</style>
