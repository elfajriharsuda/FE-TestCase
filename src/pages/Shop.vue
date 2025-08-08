<template>
  <DefaultLayout>
    <h1 class="text-3xl font-bold">Shop</h1>
    <p class="text-gray-500">Browse and purchase products</p>

    <div class="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <article v-for="p in products" :key="p.id" class="bg-white border rounded-2xl p-4">
        <div class="relative">
          <span class="absolute left-3 top-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">-{{ p.discountPercentage || 10 }}%</span>
          <img :src="p.thumbnail" class="rounded-xl aspect-[4/3] object-cover w-full cursor-pointer" @click="$router.push(`/products/${p.id}`)"/>
        </div>
        <h3 class="mt-3 text-xl font-semibold line-clamp-1 cursor-pointer" @click="$router.push(`/products/${p.id}`)">{{ p.title }}</h3>
        <p class="text-gray-500 text-sm line-clamp-2">{{ p.description }}</p>
        <div class="mt-3 font-semibold">${{ Number(p.price).toFixed(2) }}</div>
        <div class="mt-1 text-sm text-gray-500">{{ p.stock }} in stock</div>
        <button class="mt-4 w-full bg-gray-900 text-white py-2 rounded-lg" @click="addToCart(p.id)">Add to Cart</button>
      </article>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import api from '@/services/api'
import { ref, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
const products = ref([])
const cart = useCartStore()
onMounted(async()=>{ products.value = (await api.get('/products?limit=100')).data.products })
const addToCart = async(id)=>{
  const p = products.value.find(x => x.id === id)
  if (!p) return
  // Update local cart immediately (real data for Cart page)
  cart.addProduct(p, 1)
  // Optional: also reflect on DummyJSON (ignore any failure)
  try { await api.post('/carts/add', { userId: 1, products:[{ id, quantity:1 }] }) } catch {}
}
</script>
