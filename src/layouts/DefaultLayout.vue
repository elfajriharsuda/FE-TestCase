<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar/>
    <div class="md:pl-64">
      <header class="sticky top-0 bg-white border-b px-6 h-16 flex items-center justify-between z-10">
        <div class="font-medium">Navigation</div>
        <button class="text-sm px-3 py-1.5 rounded-md border" @click="logout">Logout</button>
      </header>
      <main class="p-6"><slot/></main>
    </div>
  </div>
</template>
<script setup>
import Sidebar from '@/components/Sidebar.vue'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
const logout = ()=>{ auth.logout(); location.href='/login' }
</script>
