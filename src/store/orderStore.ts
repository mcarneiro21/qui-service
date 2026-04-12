import { create } from 'zustand'
import { Cart, Order, OrderItem, OrderStatus, Product } from '../types'
import { loadFromStorage, saveToStorage } from '../lib/persistence'

const STORAGE_KEY = 'qui:orders'

interface PersistedOrderData {
  orders: Order[]
  nextOrderNumber: number
}

interface OrderState {
  orders: Order[]
  nextOrderNumber: number
  cart: Cart
  // Cart actions
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  setTableNumber: (n: number | undefined) => void
  // Order actions
  confirmOrder: () => Order
  updateOrderStatus: (id: string, status: OrderStatus) => void
  deleteOrder: (id: string) => void
}

const { orders, nextOrderNumber } = loadFromStorage<PersistedOrderData>(STORAGE_KEY, {
  orders: [],
  nextOrderNumber: 1,
})

function saveOrders(orders: Order[], nextOrderNumber: number) {
  saveToStorage<PersistedOrderData>(STORAGE_KEY, { orders, nextOrderNumber })
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders,
  nextOrderNumber,
  cart: { items: [] },

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
    const items = cart.items.filter((i) => i.productId !== productId)
    set({ cart: { ...cart, items } })
  },

  updateCartQuantity(productId, quantity) {
    const { cart } = get()
    if (quantity <= 0) {
      get().removeFromCart(productId)
      return
    }
    const items = cart.items.map((i) =>
      i.productId === productId ? { ...i, quantity } : i
    )
    set({ cart: { ...cart, items } })
  },

  clearCart() {
    set({ cart: { items: [] } })
  },

  setTableNumber(n) {
    const { cart } = get()
    set({ cart: { ...cart, tableNumber: n } })
  },

  confirmOrder() {
    const { cart, orders, nextOrderNumber } = get()
    const total = cart.items.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    )
    const order: Order = {
      id: crypto.randomUUID(),
      orderNumber: nextOrderNumber,
      items: cart.items,
      status: 'pending',
      tableNumber: cart.tableNumber,
      createdAt: new Date().toISOString(),
      total,
    }
    const newOrders = [order, ...orders]
    const newNextNumber = nextOrderNumber + 1
    set({ orders: newOrders, nextOrderNumber: newNextNumber, cart: { items: [] } })
    saveOrders(newOrders, newNextNumber)
    return order
  },

  updateOrderStatus(id, status) {
    const orders = get().orders.map((o) =>
      o.id === id ? { ...o, status } : o
    )
    set({ orders })
    saveOrders(orders, get().nextOrderNumber)
  },

  deleteOrder(id) {
    const orders = get().orders.filter((o) => o.id !== id)
    set({ orders })
    saveOrders(orders, get().nextOrderNumber)
  },
}))
