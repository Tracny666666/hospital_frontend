import { ref, reactive } from 'vue'
import { useToast } from './useToast'

const toast = useToast()

/**
 * 通用 CRUD composable
 * @param {object} api - { list, create, update, delete? }
 * @param {object} options - { defaultPageSize }
 */

export function useCrud(api, options = {}) {
  const records = ref([])
  const total = ref(0)
  const pageNum = ref(1)
  const pageSize = ref(options.defaultPageSize || 10)
  const loading = ref(false)
  const searchParams = reactive({})
  const modalVisible = ref(false)
  const modalTitle = ref('')
  const editingItem = ref(null)
  const submitting = ref(false)

  async function fetchList() {
    loading.value = true
    try {
      const params = { pageNum: pageNum.value, pageSize: pageSize.value, ...searchParams }
      Object.keys(params).forEach(k => {
        if (params[k] === '' || params[k] === null || params[k] === undefined) delete params[k]
      })
      const res = await api.list(params)
      records.value = res.records || []
      total.value = res.total || 0
    } catch (e) {
      toast.error(e.message || '加载失败')
    } finally {
      loading.value = false
    }
  }

  function handleSearch(params = {}) {
    Object.assign(searchParams, params)
    pageNum.value = 1
    fetchList()
  }

  function handleReset() {
    Object.keys(searchParams).forEach(k => delete searchParams[k])
    pageNum.value = 1
    fetchList()
  }

  function handlePageChange(p) {
    pageNum.value = p
    fetchList()
  }

  function openCreate() {
    editingItem.value = null
    modalTitle.value = '新增'
    modalVisible.value = true
  }

  function openEdit(item) {
    editingItem.value = { ...item }
    modalTitle.value = '编辑'
    modalVisible.value = true
  }

  async function handleSubmit(formData) {
    submitting.value = true
    try {
      if (editingItem.value) {
        await api.update({ ...formData, id: editingItem.value.id })
        toast.success('修改成功')
      } else {
        await api.create(formData)
        toast.success('新增成功')
      }
      modalVisible.value = false
      fetchList()
    } catch (e) {
      toast.error(e.message || '操作失败')
    } finally {
      submitting.value = false
    }
  }

  async function handleDelete(id, msg) {
    if (api.delete) {
      try {
        await api.delete(id)
        toast.success(msg || '删除成功')
        fetchList()
      } catch (e) {
        toast.error(e.message || '删除失败')
      }
    }
  }

  return {
    records, total, pageNum, pageSize, loading, searchParams,
    modalVisible, modalTitle, editingItem, submitting,
    fetchList, handleSearch, handleReset, handlePageChange,
    openCreate, openEdit, handleSubmit, handleDelete,
    toast
  }
}
