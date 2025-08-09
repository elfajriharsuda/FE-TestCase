<template>
  <DefaultLayout>
    <div class="mb-4">
      <button class="inline-flex items-center gap-2 border rounded-lg px-3 py-1.5" @click="$router.back()">
        <span>←</span>
        <span>Back</span>
      </button>
    </div>
    <div v-if="p" class="grid md:grid-cols-2 gap-8">
      <img :src="p.thumbnail" class="rounded-2xl border w-full"/>
      <div>
        <h1 class="text-3xl font-bold">{{ p.title }}</h1>
        <p class="text-gray-600 mt-2">{{ p.description }}</p>
        <div class="mt-4 text-2xl font-semibold">${{ Number(p.price).toFixed(2) }}</div>
        <div class="mt-1 text-gray-500">Brand: {{ p.brand }} • Category: {{ p.category }} • Stock: {{ p.stock }}</div>
      </div>
    </div>
  </DefaultLayout>
</template>
<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import api from '@/services/api'
import { ref, onMounted } from 'vue'
import { loadLocalProducts } from '@/services/localProducts'
import { applyEditTo } from '@/services/localEdits'
import { useRoute } from 'vue-router'
const p = ref(null); const route = useRoute()
onMounted(async()=>{
  const id = String(route.params.id)
  if (id.startsWith('L')) {
    const locals = loadLocalProducts()
    p.value = locals.find(x => String(x.id) === id) || null
  } else {
    const res = await api.get(`/products/${id}`)
    p.value = applyEditTo(res.data)
  }
})
</script>
