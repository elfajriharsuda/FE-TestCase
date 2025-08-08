<template>
  <TransitionRoot appear :show="open" as="template">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <div class="fixed inset-0 bg-black/30"/>
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <DialogPanel class="w-full max-w-xl rounded-2xl bg-white p-6 shadow">
            <DialogTitle class="text-2xl font-bold mb-1">{{ initial ? 'Edit Product' : 'Add New Product' }}</DialogTitle>
            <p class="text-gray-500 mb-4">Create a new product for your store</p>

            <form class="grid grid-cols-2 gap-4" @submit.prevent="onSubmit">
              <div class="col-span-2">
                <label class="text-sm">Title</label>
                <input v-model="form.title" class="w-full border rounded-lg px-3 py-2">
              </div>
              <div class="col-span-2">
                <label class="text-sm">Description</label>
                <textarea v-model="form.description" class="w-full border rounded-lg px-3 py-2 rows-3"></textarea>
              </div>
              <div>
                <label class="text-sm">Price</label>
                <input v-model.number="form.price" type="number" step="0.01" min="0" class="w-full border rounded-lg px-3 py-2">
              </div>
              <div>
                <label class="text-sm">Stock</label>
                <input v-model.number="form.stock" type="number" class="w-full border rounded-lg px-3 py-2">
              </div>
              <div>
                <label class="text-sm">Brand</label>
                <input v-model="form.brand" class="w-full border rounded-lg px-3 py-2">
              </div>
              <div>
                <label class="text-sm">Category</label>
                <input v-model="form.category" class="w-full border rounded-lg px-3 py-2">
              </div>
              <div class="col-span-2 flex justify-end gap-2 mt-2">
                <button type="button" class="px-4 py-2 rounded-lg border" @click="$emit('close')">Cancel</button>
                <button class="px-4 py-2 rounded-lg bg-gray-900 text-white">{{ initial ? 'Save' : 'Add Product' }}</button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot } from '@headlessui/vue'
import api from '@/services/api'
import { addLocalProduct, updateLocalProduct } from '@/services/localProducts'

const props = defineProps({ open:Boolean, initial:Object })
const emit = defineEmits(['close','saved'])
const form = reactive({ title:'', description:'', price:0, stock:0, brand:'', category:'' })

watch(()=>props.initial, (v)=>{ Object.assign(form,{ title:'',description:'',price:0,stock:0,brand:'',category:'' }); if(v) Object.assign(form,v) }, { immediate:true })

const onSubmit = async ()=>{
  const payload = { ...form, price: Number(parseFloat(form.price || 0).toFixed(2)) }
  let saved
  if (props.initial) {
    if (props.initial._local) {
      saved = updateLocalProduct({ ...props.initial, ...payload })
    } else {
      const res = await api.put(`/products/${props.initial.id}`, payload)
      saved = res.data
    }
  } else {
    // Create locally so it persists across reloads
    saved = addLocalProduct(payload)
    // Optional: also post to API (mock) without relying on persistence
    try { await api.post('/products/add', payload) } catch {}
  }
  emit('saved', saved)
}
</script>
