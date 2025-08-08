<template>
  <DefaultLayout>
    <h1 class="text-3xl font-bold">Dashboard</h1>
    <p class="text-gray-500 mt-1">Overview of your e-commerce metrics</p>

    <div class="grid md:grid-cols-4 gap-4 mt-6">
      <div v-for="card in cards" :key="card.label" class="bg-white border rounded-xl p-5">
        <div class="text-sm text-gray-500">{{ card.label }}</div>
        <div class="text-2xl font-semibold mt-2">{{ card.value }}</div>
      </div>
    </div>

    <div class="mt-8 grid md:grid-cols-2 gap-6">
      <div class="bg-white border rounded-xl p-5">
        <h2 class="text-lg font-semibold">Products by Category</h2>
        <p class="text-gray-500 text-sm">Distribution of products across categories</p>
        <div class="h-40 grid place-items-center text-gray-400">[chart placeholder]</div>
      </div>
      <div class="bg-white border rounded-xl p-5">
        <h2 class="text-lg font-semibold">Category Distribution</h2>
        <div class="h-40 grid place-items-center text-gray-400">[pie placeholder]</div>
      </div>
    </div>

    <div v-if="toast" class="fixed bottom-6 right-6 bg-white border shadow rounded-lg px-4 py-3">
      <div class="font-medium">Login successful</div>
      <div class="text-gray-500 text-sm">Welcome back, Emily!</div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import api from '@/services/api'
import { ref, onMounted } from 'vue'
const cards = ref([
  { label:'Total Products', value:'—' },
  { label:'Total Users', value:'—' },
  { label:'Active Carts', value:'—' },
  { label:'Total Revenue', value:'$589088.80' },
])
const toast = ref(false)
onMounted(async ()=>{
  if (sessionStorage.getItem('justLoggedIn') === '1') {
    toast.value = true
    sessionStorage.removeItem('justLoggedIn')
    setTimeout(()=>toast.value=false, 2500)
  }
  const [p,u,c] = await Promise.all([
    api.get('/products'), api.get('/users'), api.get('/carts')
  ])
  cards.value[0].value = p.data.total
  cards.value[1].value = u.data.total
  cards.value[2].value = c.data.total
})
</script>
