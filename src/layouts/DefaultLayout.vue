<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar :collapsed="collapsed"/>
    <div :class="['transition-[padding] duration-200', collapsed ? 'md:pl-20' : 'md:pl-64']">
      <header class="sticky top-0 bg-white border-b px-4 sm:px-6 h-16 flex items-center justify-between z-10">
        <button class="p-2 rounded-lg hover:bg-gray-100" @click="toggleSidebar" aria-label="Toggle sidebar">
          <Bars3Icon class="w-6 h-6"/>
        </button>
        <button class="text-sm px-3 py-1.5 rounded-md border" @click="logout">Logout</button>
      </header>
      <main class="p-6"><slot/></main>
    </div>
  </div>
</template>
<script setup>
import Sidebar from '@/components/Sidebar.vue'
import { ref, watchEffect } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Bars3Icon } from '@heroicons/vue/24/outline'
const auth = useAuthStore()
const logout = ()=>{ auth.logout(); location.href='/login' }

const collapsed = ref(false)
// persist collapsed state
watchEffect(() => {
  try { localStorage.setItem('sidebar_collapsed', JSON.stringify(collapsed.value)) } catch {}
})
// initialize from storage
try {
  const raw = localStorage.getItem('sidebar_collapsed')
  collapsed.value = raw ? JSON.parse(raw) : false
} catch {}

const toggleSidebar = () => { collapsed.value = !collapsed.value }
</script>
