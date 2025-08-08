import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Auth/Login.vue'
import Dashboard from '@/pages/Dashboard.vue'
import ProductList from '@/pages/Products/ProductList.vue'
import ProductDetail from '@/pages/Products/ProductDetail.vue'
import Transactions from '@/pages/Transactions/TransactionList.vue'
import Shop from '@/pages/Shop.vue'
import Orders from '@/pages/Orders/OrderList.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', redirect:'/dashboard' },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/products', component: ProductList },
  { path: '/products/:id', component: ProductDetail },
  { path: '/transactions', component: Transactions },
  { path: '/shop', component: Shop },
  { path: '/orders', component: Orders },
]

const router = createRouter({ history:createWebHistory(), routes })

// Ensure navigation works even if Pinia store isn't initialized yet by
// checking localStorage directly for the auth token.
router.beforeEach((to, _, next) => {
  const auth = useAuthStore()
  const token = auth?.token || localStorage.getItem('token') || ''

  if (to.path !== '/login' && !token) return next('/login')
  if (to.path === '/login' && token) return next('/dashboard')
  return next()
})
export default router
