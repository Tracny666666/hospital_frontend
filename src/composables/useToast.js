import { reactive } from 'vue'

const state = reactive({
  toasts: []
})

let nextId = 0

export function useToast() {
  function show(message, type = 'info', duration = 3000) {
    const id = ++nextId
    state.toasts.push({ id, message, type })
    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
  }

  function success(message) { show(message, 'success') }
  function error(message) { show(message, 'error', 5000) }
  function info(message) { show(message, 'info') }

  function remove(id) {
    const idx = state.toasts.findIndex(t => t.id === id)
    if (idx > -1) state.toasts.splice(idx, 1)
  }

  return { toasts: state.toasts, show, success, error, info, remove }
}
