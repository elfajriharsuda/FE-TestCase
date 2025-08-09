<template>
  <DefaultLayout>
    <h1 class="text-3xl font-bold">Shop</h1>
    <p class="text-gray-500">Browse and purchase products</p>

    <!-- Controls -->
    <div class="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div class="lg:col-span-2">
        <input
          v-model.trim="search"
          type="text"
          placeholder="Search products by name, brand, description..."
          class="w-full border rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <select v-model="selectedCategory" class="w-full border rounded-lg px-3 py-2 bg-white">
          <option value="all">All categories</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
    </div>

    <div class="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <article v-for="p in filtered" :key="p.id" class="bg-white border rounded-2xl p-4">
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
import { ref, onMounted, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
const products = ref([])
const categories = ref([])
const search = ref('')
const selectedCategory = ref('all')
const cart = useCartStore()
onMounted(async()=>{
  const { data: pData } = await api.get('/products?limit=100')
  products.value = pData.products || []
  // Build categories from products so the list only shows categories present
  const set = new Set(products.value.map(p => String(p.category || '').toLowerCase()).filter(Boolean))
  categories.value = Array.from(set).sort()
})
const filtered = computed(()=>{
  let list = products.value || []
  const cat = selectedCategory.value
  const q = search.value.toLowerCase()
  if (cat && cat !== 'all') list = list.filter(p => String(p.category).toLowerCase() === String(cat).toLowerCase())
  if (q) list = list.filter(p =>
    [p.title, p.brand, p.description, p.category]
      .filter(Boolean)
      .some(v => String(v).toLowerCase().includes(q))
  )
  return list
})
const addToCart = async(id)=>{
  const p = products.value.find(x => x.id === id)
  if (!p) return
  // Update local cart immediately (real data for Cart page)
  cart.addProduct(p, 1)
  // Optional: also reflect on DummyJSON (ignore any failure)
  try { await api.post('/carts/add', { userId: 1, products:[{ id, quantity:1 }] }) } catch {}
}
</script>
