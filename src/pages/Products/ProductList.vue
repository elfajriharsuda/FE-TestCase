<template>
  <DefaultLayout>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Products</h1>
        <p class="text-gray-500">Manage your product inventory</p>
      </div>
      <button @click="openModal()" class="rounded-lg bg-gray-900 text-white px-4 py-2 flex items-center gap-2">
        <span class="text-xl">+</span> Add Product
      </button>
    </div>

    <div class="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <article v-for="p in products" :key="p.id" class="bg-white border rounded-2xl p-4 flex flex-col">
        <img :src="p.thumbnail" alt="" class="rounded-xl aspect-[4/3] object-cover cursor-pointer" @click="$router.push(`/products/${p.id}`)"/>
        <h3 class="mt-3 text-xl font-semibold line-clamp-1 cursor-pointer" @click="$router.push(`/products/${p.id}`)">{{ p.title }}</h3>
        <p class="text-gray-500 text-sm line-clamp-2">{{ p.description }}</p>
        <div class="mt-3 font-semibold text-lg">${{ Number(p.price).toFixed(2) }}</div>
        <div class="mt-2 flex items-center justify-between text-sm text-gray-500">
          <span>Stock: {{ p.stock }}</span><span>★ {{ p.rating }}</span>
        </div>

        <div class="mt-4 flex gap-2">
          <button class="border rounded-lg p-2" @click="openModal(p)" aria-label="Edit">
            <PencilSquareIcon class="w-5 h-5"/>
          </button>
          <button class="border rounded-lg p-2" @click="requestDelete(p)" aria-label="Delete">
            <TrashIcon class="w-5 h-5"/>
          </button>
        </div>
      </article>
    </div>

    <ProductFormModal :open="modalOpen" :initial="editing" @close="modalOpen=false" @saved="reload"/>

    <!-- Delete Confirmation Modal -->
    <TransitionRoot appear :show="deleteOpen" as="template">
      <Dialog as="div" class="relative z-50" @close="deleteOpen=false">
        <div class="fixed inset-0 bg-black/30"/>
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel class="w-full max-w-md rounded-2xl bg-white p-6 shadow">
              <DialogTitle class="text-lg font-semibold">Delete product?</DialogTitle>
              <p class="text-gray-600 mt-1">Are you sure you want to delete
                <span class="font-medium">{{ deleting?.title }}</span>?
              </p>
              <div class="mt-5 flex justify-end gap-2">
                <button class="px-4 py-2 rounded-lg border" @click="deleteOpen=false">Cancel</button>
                <button class="px-4 py-2 rounded-lg bg-red-600 text-white" @click="confirmDelete">Delete</button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ProductFormModal from './ProductModal.vue'
import api from '@/services/api'
import { loadLocalProducts, removeLocalProduct } from '@/services/localProducts'
import { applyEditsToList, removeEdit } from '@/services/localEdits'
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { ref, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot } from '@headlessui/vue'

const products = ref([])
const modalOpen = ref(false)
const editing = ref(null)

const fetchProducts = async()=> {
  const { data } = await api.get('/products?limit=100')
  const remote = data.products || []
  const locals = loadLocalProducts()
  const merged = [...locals, ...remote.filter(r => !locals.some(l => String(l.id) === String(r.id)))]
  products.value = applyEditsToList(merged)
}
const openModal = (p=null)=>{ editing.value=p; modalOpen.value=true }
const deleteOpen = ref(false)
const deleting = ref(null)
const requestDelete = (p)=>{ deleting.value = p; deleteOpen.value = true }
const confirmDelete = async()=>{
  const p = deleting.value
  if(!p) return
  if (p._local) {
    removeLocalProduct(p.id)
  } else {
    await api.delete(`/products/${p.id}`)
    removeEdit(p.id)
  }
  const idx = products.value.findIndex(x=>String(x.id)===String(p.id))
  if(idx>=0) products.value.splice(idx,1)
  deleteOpen.value = false; deleting.value = null
}
const reload = (saved)=>{
  modalOpen.value=false
  if(saved){
    const idx = products.value.findIndex(x=>x.id===saved.id)
    if(idx>=0) products.value[idx] = { ...products.value[idx], ...saved }
    else products.value.unshift(saved)
  } else {
    fetchProducts()
  }
}

onMounted(fetchProducts)
</script>
