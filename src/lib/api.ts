import { Order, OrderStatus, Product } from '../types'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

// Products
export const api = {
  products: {
    list: () => request<Product[]>('/api/products'),
    create: (data: Omit<Product, 'id' | 'createdAt'>) =>
      request<Product>('/api/products', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<void>(`/api/products/${id}`, { method: 'DELETE' }),
  },

  orders: {
    list: () => request<Order[]>('/api/orders'),
    create: (payload: {
      items: Array<{ productId: string; quantity: number; productName: string; productPrice: number }>
      tableNumber?: number
      total: number
    }) => request<Order>('/api/orders', { method: 'POST', body: JSON.stringify(payload) }),
    updateStatus: (id: string, status: OrderStatus) =>
      request<{ id: string; status: OrderStatus }>(`/api/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    delete: (id: string) =>
      request<void>(`/api/orders/${id}`, { method: 'DELETE' }),
  },
}
