import { create } from 'zustand'
import { Cart, Order, OrderItem, OrderStatus, Product } from '../types'
import { api } from '../lib/api'

interface OrderState {
  orders: Order[]
  loading: boolean
  error: string | null
  cart: Cart
  // Data fetching
  fetchOrders: () => Promise<void>
  // Cart actions (sync — local only)
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  setTableNumber: (n: number | undefined) => void
  // Order actions (async — API)
  confirmOrder: () => Promise<Order>
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>
  deleteOrder: (id: string) => Promise<void>
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  loading: false,
  error: null,
  cart: { items: [] },

  async fetchOrders() {
    set({ loading: true, error: null })
    try {
      const orders = await api.orders.list()
      set({ orders })
    } catch (e) {
      set({ error: (e as Error).message })
    } finally {
      set({ loading: false })
    }
  },

  // ── Cart (síncrono) ─────────────────────────────────────────────────────────

  addToCart(product) {
    const { cart } = get()
    const existing = cart.items.find((i) => i.productId === product.id)
    let items: OrderItem[]
    if (existing) {
      items = cart.items.map((i) =>
        i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
      )
    } else {
      items = [...cart.items, { productId: product.id, product, quantity: 1 }]
    }
    set({ cart: { ...cart, items } })
  },

  removeFromCart(productId) {
    const { cart } = get()
    set({ cart: { ...cart, items: cart.items.filter((i) => i.productId !== productId) } })
  },

  updateCartQuantity(productId, quantity) {
    if (quantity <= 0) {
      get().removeFromCart(productId)
      return
    }
    const { cart } = get()
    const items = cart.items.map((i) =>
      i.productId === productId ? { ...i, quantity } : i
    )
    set({ cart: { ...cart, items } })
  },

  clearCart() {
    set({ cart: { items: [] } })
  },

  setTableNumber(n) {
    set({ cart: { ...get().cart, tableNumber: n } })
  },

  // ── Orders (assíncrono) ─────────────────────────────────────────────────────

  async confirmOrder() {
    const { cart } = get()
    const total = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

    const order = await api.orders.create({
      items: cart.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        productName: i.product.name,
        productPrice: i.product.price,
      })),
      tableNumber: cart.tableNumber,
      total,
    })

    set({ orders: [order, ...get().orders], cart: { items: [] } })
    return order
  },

  async updateOrderStatus(id, status) {
    await api.orders.updateStatus(id, status)
    set({
      orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)),
    })
  },

  async deleteOrder(id) {
    await api.orders.delete(id)
    set({ orders: get().orders.filter((o) => o.id !== id) })
  },
}))
