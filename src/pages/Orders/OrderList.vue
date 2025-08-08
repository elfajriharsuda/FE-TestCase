<template>
  <DefaultLayout>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Orders</h1>
        <p class="text-gray-500">Track your placed orders</p>
      </div>
    </div>

    <div v-if="!orders.length" class="mt-8 text-gray-500">No orders yet. Place an order from the Cart.</div>

    <div v-else class="mt-6 space-y-4">
      <article v-for="o in orders" :key="o.id" class="bg-white border rounded-xl p-5">
        <div class="flex items-start justify-between">
          <div>
            <div class="font-semibold">Order #{{ o.id }}</div>
            <div class="text-sm text-gray-500">{{ formatDate(o.createdAt) }}</div>
          </div>
          <span :class="statusClass(o.status)" class="text-xs rounded-full px-2 py-0.5">{{ o.status }}</span>
        </div>
        <div class="mt-4 flex items-center gap-3 overflow-x-auto">
          <img v-for="it in o.items" :key="it.id" :src="it.thumbnail" :alt="it.title" class="w-12 h-12 rounded object-cover border"/>
        </div>
        <div class="mt-3 text-sm text-gray-600">{{ itemCount(o) }} items • <span class="font-medium text-gray-900">${{ Number(o.total).toFixed(2) }}</span></div>
      </article>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { storeToRefs } from 'pinia'
import { useOrdersStore } from '@/stores/orders'

const store = useOrdersStore()
store.init()
const { orders } = storeToRefs(store)

const itemCount = (o) => o.items.reduce((s, i) => s + (i.quantity || 1), 0)
const statusClass = (s) => s === 'Placed'
  ? 'bg-blue-100 text-blue-700'
  : s === 'Completed'
  ? 'bg-green-100 text-green-700'
  : 'bg-gray-100 text-gray-700'
const formatDate = (iso) => new Date(iso).toLocaleString()
</script>
