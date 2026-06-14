import { create } from 'zustand'
import { Cart, Order, OrderItem, OrderStatus, Product, halfHalfPrice } from '../types'
import { api } from '../lib/api'

interface OrderState {
  orders: Order[]
  loading: boolean
  error: string | null
  cart: Cart
  fetchOrders: () => Promise<void>
  // Cart actions (sync)
  addToCart: (product: Product) => void
  addHalfHalfToCart: (first: Product, second: Product) => void
  removeFromCart: (productId: string, isHalfHalf?: boolean, secondProductId?: string) => void
  updateCartQuantity: (productId: string, quantity: number, isHalfHalf?: boolean, secondProductId?: string) => void
  clearCart: () => void
  setTableNumber: (n: number | undefined) => void
  // Order actions (async)
  confirmOrder: () => Promise<Order>
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>
  deleteOrder: (id: string) => Promise<void>
}

function itemKey(item: OrderItem): string {
  if (item.isHalfHalf && item.secondProduct) {
    return `half:${item.productId}:${item.secondProduct.id}`
  }
  return item.productId
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

  // ── Cart (síncrono) ──────────────────────────────────────────────────────────

  addToCart(product) {
    const { cart } = get()
    const existing = cart.items.find((i) => !i.isHalfHalf && i.productId === product.id)
    let items: OrderItem[]
    if (existing) {
      items = cart.items.map((i) =>
        !i.isHalfHalf && i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
      )
    } else {
      items = [...cart.items, { productId: product.id, product, quantity: 1 }]
    }
    set({ cart: { ...cart, items } })
  },

  addHalfHalfToCart(first, second) {
    const { cart } = get()
    const price = halfHalfPrice(first.price, second.price)
    // Produto "representante" é o de maior preço; exibimos os dois
    const representative = first.price >= second.price ? first : second
    const other = first.price >= second.price ? second : first

    const existing = cart.items.find(
      (i) => i.isHalfHalf && i.productId === representative.id && i.secondProduct?.id === other.id
    )

    let items: OrderItem[]
    if (existing) {
      items = cart.items.map((i) =>
        i.isHalfHalf && i.productId === representative.id && i.secondProduct?.id === other.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    } else {
      const halfItem: OrderItem = {
        productId: representative.id,
        product: { ...representative, price },
        quantity: 1,
        isHalfHalf: true,
        secondProduct: other,
      }
      items = [...cart.items, halfItem]
    }
    set({ cart: { ...cart, items } })
  },

  removeFromCart(productId, isHalfHalf, secondProductId) {
    const { cart } = get()
    const items = cart.items.filter((i) => {
      if (isHalfHalf) {
        return !(i.isHalfHalf && i.productId === productId && i.secondProduct?.id === secondProductId)
      }
      return !((!i.isHalfHalf) && i.productId === productId)
    })
    set({ cart: { ...cart, items } })
  },

  updateCartQuantity(productId, quantity, isHalfHalf, secondProductId) {
    if (quantity <= 0) {
      get().removeFromCart(productId, isHalfHalf, secondProductId)
      return
    }
    const { cart } = get()
    const items = cart.items.map((i) => {
      if (isHalfHalf) {
        return i.isHalfHalf && i.productId === productId && i.secondProduct?.id === secondProductId
          ? { ...i, quantity }
          : i
      }
      return !i.isHalfHalf && i.productId === productId ? { ...i, quantity } : i
    })
    set({ cart: { ...cart, items } })
  },

  clearCart() {
    set({ cart: { items: [] } })
  },

  setTableNumber(n) {
    set({ cart: { ...get().cart, tableNumber: n } })
  },

  // ── Orders (assíncrono) ──────────────────────────────────────────────────────

  async confirmOrder() {
    const { cart } = get()
    const total = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

    const order = await api.orders.create({
      items: cart.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        productName: i.product.name,
        productPrice: i.product.price,
        isHalfHalf: i.isHalfHalf,
        secondProductId: i.secondProduct?.id,
        secondProductName: i.secondProduct?.name,
        secondProductPrice: i.secondProduct?.price,
      })),
      tableNumber: cart.tableNumber,
      total,
    })

    set({ orders: [order, ...get().orders], cart: { items: [] } })
    return order
  },

  async updateOrderStatus(id, status) {
    await api.orders.updateStatus(id, status)
    set({ orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)) })
  },

  async deleteOrder(id) {
    await api.orders.delete(id)
    set({ orders: get().orders.filter((o) => o.id !== id) })
  },
}))

export { itemKey }
