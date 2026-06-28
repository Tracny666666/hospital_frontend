<script setup>
defineProps({
  total: { type: Number, default: 0 },
  pageNum: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 }
})
const emit = defineEmits(['change'])
</script>

<template>
  <div class="pagination" v-if="total > 0">
    <span class="pagination-info">共 {{ total }} 条</span>
    <div class="pagination-btns">
      <button
        class="pagination-btn"
        :disabled="pageNum <= 1"
        @click="emit('change', pageNum - 1)"
      >&lt;</button>
      <template v-for="p in Math.ceil(total / pageSize)" :key="p">
        <button
          v-if="p <= 7 || p === Math.ceil(total / pageSize) || Math.abs(p - pageNum) <= 1"
          class="pagination-btn"
          :class="{ active: p === pageNum }"
          @click="emit('change', p)"
        >{{ p }}</button>
        <span v-else-if="p === 8 && pageNum > 4" class="pagination-ellipsis">...</span>
      </template>
      <button
        class="pagination-btn"
        :disabled="pageNum >= Math.ceil(total / pageSize)"
        @click="emit('change', pageNum + 1)"
      >&gt;</button>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pagination-info {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.pagination-btns {
  display: flex;
  gap: 4px;
}

.pagination-btn {
  min-width: 34px;
  height: 34px;
  padding: 0 8px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: #fff;
  font-size: 0.875rem;
  cursor: pointer;
  color: var(--color-text);
  transition: all 0.15s;
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pagination-btn.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-ellipsis {
  padding: 0 4px;
  color: var(--color-text-secondary);
  align-self: center;
}
</style>
