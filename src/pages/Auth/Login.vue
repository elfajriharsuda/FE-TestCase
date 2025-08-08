<template>
  <div class="min-h-screen grid place-items-center bg-gray-50">
    <div class="bg-white w-[520px] max-w-[92vw] rounded-xl shadow p-8">
      <h1 class="text-3xl font-bold text-center">Sign in</h1>
      <p class="text-gray-500 text-center mt-1">Enter your credentials to access the e-commerce dashboard</p>

      <form class="mt-8 space-y-4" @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm font-medium mb-1">Username</label>
          <input v-model="form.username" class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring" placeholder="emilys">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Password</label>
          <input v-model="form.password" type="password" class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring" placeholder="emilyspass">
        </div>
        <button :disabled="loading"
          class="w-full bg-gray-900 text-white rounded-lg py-2.5 hover:bg-black disabled:opacity-50">
          Sign in
        </button>
      </form>

      <div class="mt-6 p-4 rounded-lg bg-blue-50 text-sm">
        <p class="font-semibold text-blue-800">Demo Credentials:</p>
        <p>Username: emilys</p><p>Password: emilyspass</p>
      </div>
    </div>

    <!-- Toast: login result -->
    <div v-if="toast.show" class="fixed bottom-6 right-6 bg-white border shadow rounded-lg px-4 py-3">
      <div class="font-medium" :class="toast.type==='error' ? 'text-red-600' : 'text-green-600'">{{ toast.title }}</div>
      <div class="text-gray-500 text-sm">{{ toast.message }}</div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const form = reactive({ username:'emilys', password:'emilyspass' })
const toast = ref({ show:false, type:'info', title:'', message:'' })
const showToast = (title, message, type='info') => {
  toast.value = { show:true, type, title, message }
  setTimeout(()=>{ toast.value.show=false }, 2500)
}
const onSubmit = async () => {
  loading.value = true
  const ok = await auth.login(form.username, form.password)
  loading.value = false
  if (ok) {
    // Flag for dashboard to show success toast
    sessionStorage.setItem('justLoggedIn','1')
    router.push('/dashboard')
  } else {
    showToast('Login failed','Invalid username or password','error')
  }
}
</script>
