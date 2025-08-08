import { defineStore } from 'pinia'

const STORAGE_KEY = 'orders_list'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [], // { id, items, total, status, createdAt }
    initialized: false,
  }),
  actions: {
    init() {
      if (this.initialized) return
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        this.orders = raw ? JSON.parse(raw) : []
      } catch {
        this.orders = []
      }
      this.initialized = true
    },
    persist() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.orders)) } catch {} },
    nextId() { return (this.orders.reduce((m, o) => Math.max(m, o.id || 0), 0) || 0) + 1 },
    addOrder({ items, total, status = 'Pending' }) {
      this.init()
      const order = {
        id: this.nextId(),
        items: JSON.parse(JSON.stringify(items || [])),
        total: Number(total) || 0,
        status,
        createdAt: new Date().toISOString(),
      }
      this.orders.unshift(order)
      this.persist()
      return order
    },
    updateStatus(id, status) {
      this.init()
      const o = this.orders.find(o => o.id === id)
      if (!o) return
      o.status = status
      this.persist()
    },
    clear() { this.orders = []; this.persist() },
  },
})

