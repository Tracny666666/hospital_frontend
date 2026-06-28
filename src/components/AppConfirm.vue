<script setup>
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
const resolvePromise = ref(null)

function show(msg) {
  return new Promise((resolve) => {
    message.value = msg
    visible.value = true
    resolvePromise.value = resolve
  })
}

function confirm() { visible.value = false; resolvePromise.value(true) }
function cancel() { visible.value = false; resolvePromise.value(false) }

defineExpose({ show })
</script>

<template>
  <div class="modal-overlay" v-if="visible" @click.self="cancel">
    <div class="modal" style="max-width:360px">
      <div class="modal-header"><h4>确认操作</h4></div>
      <div class="modal-body">
        <p style="margin-bottom:1.5rem">{{ message }}</p>
        <div style="display:flex;gap:0.75rem">
          <button class="btn btn-ghost" style="flex:1" @click="cancel">取消</button>
          <button class="btn btn-primary" style="flex:1;background:#ef4444" @click="confirm">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>
