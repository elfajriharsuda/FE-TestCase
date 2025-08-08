const KEY = 'user_products'

export function loadLocalProducts() {
  try {
    const raw = localStorage.getItem(KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

export function saveLocalProducts(items) {
  try { localStorage.setItem(KEY, JSON.stringify(items || [])) } catch {}
}

export function addLocalProduct(product) {
  const items = loadLocalProducts()
  const id = 'L' + Date.now()
  const p = {
    id,
    _local: true,
    title: '',
    description: '',
    price: 0,
    stock: 0,
    brand: '',
    category: '',
    rating: 0,
    thumbnail: 'https://via.placeholder.com/400x300?text=Product',
    ...product,
  }
  items.unshift(p)
  saveLocalProducts(items)
  return p
}

export function updateLocalProduct(product) {
  const items = loadLocalProducts()
  const idx = items.findIndex(x => String(x.id) === String(product.id))
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...product, _local: true }
    saveLocalProducts(items)
    return items[idx]
  }
  return null
}

export function removeLocalProduct(id) {
  const items = loadLocalProducts()
  const next = items.filter(x => String(x.id) !== String(id))
  saveLocalProducts(next)
}

