<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useCrud } from '../../composables/useCrud'
import { employeeApi } from '../../api/employee'
import { departmentApi } from '../../api/department'
import { registLevelApi } from '../../api/registLevel'
import Pagination from '../../components/Pagination.vue'

const crud = useCrud(employeeApi)
const { records, total, pageNum, loading, searchParams, modalVisible, modalTitle, submitting, handleSearch, handleReset, handlePageChange, openCreate, openEdit, handleSubmit, handleDelete, fetchList } = crud

const deptOptions = ref([])
const levelOptions = ref([])

const form = ref({})
function openCreate_() { form.value = { realname: '', password: '', deptmentId: '', registLevelId: '', schedulingId: '' }; crud.openCreate() }
function openEdit_(item) { form.value = { realname: item.realname, password: '', deptmentId: item.deptmentId, registLevelId: item.registLevelId, schedulingId: item.schedulingId }; crud.openEdit(item) }
async function submit() {
  const data = { ...form.value }
  data.deptmentId = data.deptmentId ? Number(data.deptmentId) : null
  data.registLevelId = data.registLevelId ? Number(data.registLevelId) : null
  data.schedulingId = data.schedulingId ? Number(data.schedulingId) : null
  await crud.handleSubmit(data)
}
async function del(id) { if (confirm('确定删除？')) await crud.handleDelete(id) }

onMounted(async () => {
  fetchList()
  const [depts, levels] = await Promise.all([
    departmentApi.all(),
    registLevelApi.all()
  ])
  deptOptions.value = depts || []
  levelOptions.value = levels || []
})
</script>

<template>
  <div class="page">
    <div class="page-toolbar">
      <input v-model="searchParams.realname" class="form-input" style="width:180px" placeholder="姓名" @keyup.enter="handleSearch()" />
      <select v-model="searchParams.deptmentId" class="form-input" style="width:160px" @change="handleSearch()">
        <option value="">全部科室</option>
        <option v-for="d in deptOptions" :key="d.id" :value="d.id">{{ d.deptName }}</option>
      </select>
      <button class="btn btn-primary" @click="handleSearch()">搜索</button>
      <button class="btn btn-ghost" @click="handleReset()">重置</button>
    </div>
    <div class="page-header">
      <h3>员工管理</h3><button class="btn btn-primary" @click="openCreate_">+ 新增</button>
    </div>
    <div v-if="loading" class="table-placeholder">加载中...</div>
    <table class="table" v-else>
      <thead><tr><th>ID</th><th>姓名</th><th>科室</th><th>挂号级别</th><th>排班ID</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="r in records" :key="r.id">
          <td>{{ r.id }}</td><td>{{ r.realname }}</td><td>{{ r.deptName }}</td><td>{{ r.registLevelName }}</td><td>{{ r.schedulingId }}</td>
          <td><a href="#" @click.prevent="openEdit_(r)">编辑</a> <a href="#" @click.prevent="del(r.id)" style="color:#ef4444">删除</a></td>
        </tr>
        <tr v-if="records.length === 0"><td colspan="6" class="empty">暂无数据</td></tr>
      </tbody>
    </table>
    <Pagination :total="total" :page-num="pageNum" :page-size="10" @change="handlePageChange" />

    <div class="modal-overlay" v-if="modalVisible" @click.self="modalVisible = false">
      <div class="modal">
        <div class="modal-header"><h4>{{ modalTitle }}员工</h4><button class="modal-close" @click="modalVisible = false">&times;</button></div>
        <form class="modal-body" @submit.prevent="submit">
          <div class="form-group"><label class="form-label">姓名</label><input v-model="form.realname" class="form-input" required /></div>
          <div class="form-group"><label class="form-label">密码</label><input v-model="form.password" class="form-input" type="password" :required="!crud.editingItem.value" :placeholder="crud.editingItem.value ? '留空则不修改' : ''" /></div>
          <div class="form-row">
            <div class="form-group" style="flex:1">
              <label class="form-label">科室</label>
              <select v-model="form.deptmentId" class="form-input">
                <option value="">请选择</option>
                <option v-for="d in deptOptions" :key="d.id" :value="d.id">{{ d.deptName }}</option>
              </select>
            </div>
            <div class="form-group" style="flex:1">
              <label class="form-label">挂号级别</label>
              <select v-model="form.registLevelId" class="form-input">
                <option value="">请选择</option>
                <option v-for="l in levelOptions" :key="l.id" :value="l.id">{{ l.registName }}</option>
              </select>
            </div>
          </div>
          <div class="form-group"><label class="form-label">排班ID</label><input v-model="form.schedulingId" class="form-input" type="number" /></div>
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
