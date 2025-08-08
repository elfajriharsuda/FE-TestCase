<template>
  <aside class="hidden md:flex md:w-64 bg-white border-r h-screen fixed left-0 top-0">
    <div class="w-full p-6 flex flex-col">
      <!-- Brand -->
      <h1 class="text-xl font-semibold">Dummy Store</h1>
      <div class="text-sm mt-8 text-gray-500 mt-2">
        <p>Navigation</p>
      </div>
      <!-- Nav -->
      <nav class="space-y-2 mt-6">
        <RouterLink v-for="l in links" :key="l.to" :to="l.to"
          class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
          active-class="bg-gray-100 font-medium">
          <component :is="l.icon" class="w-5 h-5"/>
          <span>{{ l.label }}</span>
          <span v-if="l.badge" class="ml-auto text-xs bg-gray-900 text-white rounded-full px-1.5 py-0.5">
            {{ l.badge }}
          </span>
        </RouterLink>
      </nav>

      <!-- User (stick to bottom) -->
      <div class="mt-auto pt-6">
        <div class="flex items-center gap-3 p-3 rounded-xl border bg-white">
          <img
            :src="avatar"
            :alt="fullName"
            class="w-10 h-10 rounded-full object-cover border"
            @error="onImgError"
          />
          <div class="min-w-0">
            <p class="text-sm font-medium truncate">{{ fullName }}</p>
            <p class="text-xs text-gray-500 truncate">@{{ username }}</p>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
import {
  ChartPieIcon, CubeIcon, ShoppingBagIcon,
  ShoppingCartIcon, ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline'

const cart = useCartStore()
cart.init()
const { totalQuantity } = storeToRefs(cart)

const links = computed(() => ([
  { to: '/dashboard', label: 'Dashboard', icon: ChartPieIcon },
  { to: '/products',  label: 'Products',  icon: CubeIcon },
  { to: '/shop',      label: 'Shop',      icon: ShoppingBagIcon },
  { to: '/transactions', label: 'Cart',   icon: ShoppingCartIcon, badge: totalQuantity.value || null },
  { to: '/orders',    label: 'Orders',    icon: ClipboardDocumentListIcon },
]))

const auth = useAuthStore()
const username = computed(() => auth.user?.username || 'guest')
const fullName = computed(() =>
  [auth.user?.firstName, auth.user?.lastName].filter(Boolean).join(' ') || 'Guest User'
)
const fallback = ref(
  'https://ui-avatars.com/api/?background=DDD&color=444&name=' + encodeURIComponent(fullName.value || 'G')
)
const avatar = computed(() => auth.user?.image || fallback.value)
const onImgError = () => { /* pakai fallback kalau image broken */ }
</script>
