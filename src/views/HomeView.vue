<script setup>
import { ref } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppSidebar from '../components/AppSidebar.vue'

const sidebarOpen = ref(true)
function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }
</script>

<template>
  <div class="layout" :class="{ 'sidebar-closed': !sidebarOpen }">
    <div class="sidebar-overlay" v-if="!sidebarOpen" @click="sidebarOpen = true"></div>
    <AppSidebar :collapsed="!sidebarOpen" />
    <div class="layout-main">
      <AppHeader @toggle-sidebar="toggleSidebar" />
      <div class="layout-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout { display: flex; min-height: 100vh; }
.sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 90; }
.layout-main { flex: 1; display: flex; flex-direction: column; min-width: 0; background: var(--color-bg); }
.layout-content { flex: 1; overflow-y: auto; }
@media (max-width: 768px) {
  .layout.sidebar-closed .sidebar-overlay { display: block; }
}
</style>
