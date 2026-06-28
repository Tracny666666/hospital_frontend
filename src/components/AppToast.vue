<script setup>
import { useToast } from '../composables/useToast'

const { toasts, remove } = useToast()
</script>

<template>
  <div class="toast-container">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="toast"
      :class="'toast-' + t.type"
      @click="remove(t.id)"
    >
      <span class="toast-icon">
        <template v-if="t.type === 'success'">✓</template>
        <template v-else-if="t.type === 'error'">✕</template>
        <template v-else>ℹ</template>
      </span>
      {{ t.message }}
    </div>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #fff;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  cursor: pointer;
  pointer-events: auto;
  animation: slideIn 0.25s ease;
  max-width: 360px;
}

.toast-success { background: #16a34a; }
.toast-error { background: #ef4444; }
.toast-info { background: #2563eb; }

.toast-icon {
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

@keyframes slideIn {
  from { transform: translateX(120%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
</style>
