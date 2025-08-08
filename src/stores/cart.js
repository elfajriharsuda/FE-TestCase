import { defineStore } from 'pinia'

const STORAGE_KEY = 'cart_items'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [], // { id, title, price, thumbnail, quantity }
    initialized: false,
  }),
  getters: {
    totalQuantity: (state) => state.items.reduce((a, b) => a + b.quantity, 0),
    subtotal: (state) => state.items.reduce((a, b) => a + (Number(b.price) || 0) * b.quantity, 0),
  },
  actions: {
    init() {
      if (this.initialized) return
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        this.items = raw ? JSON.parse(raw) : []
      } catch {
        this.items = []
      }
      this.initialized = true
    },
    persist() {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items)) } catch {}
    },
    addProduct(product, quantity = 1) {
      this.init()
      const idx = this.items.findIndex((i) => i.id === product.id)
      if (idx >= 0) this.items[idx].quantity += quantity
      else this.items.push({ id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail, quantity })
      this.persist()
    },
    updateQuantity(id, quantity) {
      this.init()
      const item = this.items.find((i) => i.id === id)
      if (!item) return
      item.quantity = Math.max(1, quantity)
      this.persist()
    },
    remove(id) {
      this.init()
      this.items = this.items.filter((i) => i.id !== id)
      this.persist()
    },
    clear() {
      this.items = []
      this.persist()
    },
  },
})

