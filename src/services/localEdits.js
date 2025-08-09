const KEY = 'product_edits'

export function loadEdits() {
  try {
    const raw = localStorage.getItem(KEY)
    const obj = raw ? JSON.parse(raw) : {}
    return obj && typeof obj === 'object' ? obj : {}
  } catch {
    return {}
  }
}

export function saveEdits(edits) {
  try { localStorage.setItem(KEY, JSON.stringify(edits || {})) } catch {}
}

export function getEdit(id) {
  const edits = loadEdits()
  return edits[String(id)] || null
}

export function setEdit(id, patch) {
  const edits = loadEdits()
  const next = { ...(edits[String(id)] || {}), ...(patch || {}) }
  edits[String(id)] = next
  saveEdits(edits)
  return next
}

export function removeEdit(id) {
  const edits = loadEdits()
  delete edits[String(id)]
  saveEdits(edits)
}

export function applyEditTo(product) {
  if (!product) return product
  const e = getEdit(product.id)
  return e ? { ...product, ...e } : product
}

export function applyEditsToList(list) {
  return (list || []).map(applyEditTo)
}

