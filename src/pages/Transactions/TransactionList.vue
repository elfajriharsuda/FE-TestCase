<template>
  <DefaultLayout>
    <h1 class="text-3xl font-bold">Checkout</h1>
    <div class="grid lg:grid-cols-3 gap-6 mt-6">
      <div class="lg:col-span-2 bg-white border rounded-2xl p-6">
        <h2 class="text-xl font-semibold mb-4">Shipping Information</h2>
        <form class="grid sm:grid-cols-2 gap-4">
          <div>
            <input class="rounded-lg px-3 py-2 border" :class="invalid('firstName') ? 'border-red-500' : ''" placeholder="First Name" v-model="shipping.firstName" @blur="touch('firstName')" required>
            <p v-if="invalid('firstName')" class="text-xs text-red-600 mt-1">First name is required</p>
          </div>
          <div>
            <input class="rounded-lg px-3 py-2 border" :class="invalid('lastName') ? 'border-red-500' : ''" placeholder="Last Name" v-model="shipping.lastName" @blur="touch('lastName')" required>
            <p v-if="invalid('lastName')" class="text-xs text-red-600 mt-1">Last name is required</p>
          </div>
          <div class="sm:col-span-2">
            <input class="rounded-lg px-3 py-2 w-full border" :class="invalid('email') ? 'border-red-500' : ''" placeholder="Email" v-model="shipping.email" @blur="touch('email')" required>
            <p v-if="touched.email && !shipping.email.trim()" class="text-xs text-red-600 mt-1">Email is required</p>
            <p v-else-if="touched.email && shipping.email.trim() && !isEmail(shipping.email)" class="text-xs text-red-600 mt-1">Enter a valid email address</p>
          </div>
          <div class="sm:col-span-2">
            <input class="rounded-lg px-3 py-2 w-full border" :class="invalid('address') ? 'border-red-500' : ''" placeholder="Address" v-model="shipping.address" @blur="touch('address')" required>
            <p v-if="invalid('address')" class="text-xs text-red-600 mt-1">Address is required</p>
          </div>
          <div>
            <input class="rounded-lg px-3 py-2 border" :class="invalid('city') ? 'border-red-500' : ''" placeholder="City" v-model="shipping.city" @blur="touch('city')" required>
            <p v-if="invalid('city')" class="text-xs text-red-600 mt-1">City is required</p>
          </div>
          <div>
            <input class="rounded-lg px-3 py-2 border" :class="invalid('state') ? 'border-red-500' : ''" placeholder="State" v-model="shipping.state" @blur="touch('state')" required>
            <p v-if="invalid('state')" class="text-xs text-red-600 mt-1">State is required</p>
          </div>
          <div>
            <input class="rounded-lg px-3 py-2 border" :class="invalid('zip') ? 'border-red-500' : ''" placeholder="ZIP Code" v-model="shipping.zip" @blur="touch('zip')" required>
            <p v-if="invalid('zip')" class="text-xs text-red-600 mt-1">ZIP Code is required</p>
          </div>
        </form>
      </div>

      <div class="bg-white border rounded-2xl p-6">
        <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
        <div v-if="!items.length" class="text-sm text-gray-500">Your cart is empty.</div>
        <ul v-else class="space-y-3 max-h-64 overflow-auto">
          <li v-for="i in items" :key="i.id" class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-3 min-w-0">
              <img :src="i.thumbnail" alt="" class="w-10 h-10 rounded object-cover border"/>
              <div class="min-w-0">
                <span class="line-clamp-1">{{ i.title }}</span>
                <div class="mt-1 flex items-center gap-2">
                  <button class="border rounded w-6 h-6 grid place-items-center" @click="decrease(i)">-</button>
                  <span class="text-gray-700">{{ i.quantity }}</span>
                  <button class="border rounded w-6 h-6 grid place-items-center" @click="increase(i)">+</button>
                </div>
              </div>
            </div>
            <span class="font-medium">${{ (Number(i.price) * i.quantity).toFixed(2) }}</span>
          </li>
        </ul>
        <dl class="text-sm mt-4 space-y-1 pt-2 border-t ">
          <div class="flex justify-between"><dt>Subtotal</dt><dd>${{ subtotal.toFixed(2) }}</dd></div>
          <div class="flex justify-between"><dt>Shipping</dt><dd>Free</dd></div>
          <div class="flex justify-between"><dt>Tax</dt><dd>$1.00</dd></div>
          <div class="flex justify-between font-semibold text-lg pt-2 border-t">
            <dt>Total</dt><dd>${{ (Number(subtotal)+1).toFixed(2) }}</dd>
          </div>
        </dl>
        <button class="mt-5 w-full bg-gray-900 text-white py-2 rounded-lg disabled:opacity-50"
          :disabled="!items.length || placing"
          @click="completeOrder">
          {{ placing ? 'Placing…' : 'Complete Order' }}
        </button>
      </div>
    </div>
  </DefaultLayout>

  <!-- Remove item confirmation -->
  <TransitionRoot appear :show="confirmOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="confirmOpen=false">
      <div class="fixed inset-0 bg-black/30"/>
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <DialogPanel class="w-full max-w-md rounded-2xl bg-white p-6 shadow">
            <DialogTitle class="text-lg font-semibold">Remove item?</DialogTitle>
            <p class="text-gray-600 mt-1">Are you sure you want to remove
              <span class="font-medium">{{ targetItem?.title }}</span> from your cart?</p>
            <div class="mt-5 flex justify-end gap-2">
              <button class="px-4 py-2 rounded-lg border" @click="confirmOpen=false">Cancel</button>
              <button class="px-4 py-2 rounded-lg bg-red-600 text-white" @click="confirmRemove">Remove</button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'
import { useRouter } from 'vue-router'
import { ref, reactive, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot } from '@headlessui/vue'

const cart = useCartStore()
cart.init()
const { items, subtotal } = storeToRefs(cart)

const orders = useOrdersStore()
orders.init()
const router = useRouter()
const placing = ref(false)
const shipping = reactive({
  firstName: 'Emily',
  lastName: 'Johnson',
  email: 'emily.johnson@x.dummyjson.com',
  address: '',
  city: '',
  state: '',
  zip: '',
})
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const isShippingValid = computed(() => {
  const { firstName, lastName, email, address, city, state, zip } = shipping
  return [firstName, lastName, email, address, city, state, zip].every(v => String(v || '').trim().length > 0) && isEmail(email)
})
const touched = reactive({ firstName:false, lastName:false, email:false, address:false, city:false, state:false, zip:false })
const touch = (f) => { touched[f] = true }
const invalid = (f) => touched[f] && (
  f === 'email' ? (!shipping.email.trim() || !isEmail(shipping.email)) : !String(shipping[f] || '').trim().length
)

const completeOrder = async () => {
  if (!items.value.length || placing.value || !isShippingValid.value) {
    Object.keys(touched).forEach(k => touched[k] = true)
    return
  }
  placing.value = true
  try {
    orders.addOrder({ items: items.value, total: subtotal.value, status: 'Placed' })
    cart.clear()
    router.push('/orders')
  } finally {
    placing.value = false
  }
}

// Quantity controls with removal confirmation
const confirmOpen = ref(false)
const targetItem = ref(null)
const increase = (it) => cart.updateQuantity(it.id, it.quantity + 1)
const decrease = (it) => {
  if (it.quantity <= 1) { targetItem.value = it; confirmOpen.value = true }
  else cart.updateQuantity(it.id, it.quantity - 1)
}
const confirmRemove = () => {
  if (!targetItem.value) return
  cart.remove(targetItem.value.id)
  confirmOpen.value = false
  targetItem.value = null
}
</script>
