import { create } from 'zustand'
import { Cart, Customer, Order, OrderItem, OrderStatus, Product, halfHalfPrice } from '../types'
import { api } from '../lib/api'
import { MIN_DELIVERY_FEE, computeDeliveryFee } from '../lib/delivery'

const EMPTY_CART: Cart = { items: [], deliveryFee: MIN_DELIVERY_FEE }

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
  setCustomer: (customer: Customer | undefined) => void
  setDeliveryFee: (fee: number) => void
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
  cart: EMPTY_CART,

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
    set({ cart: { ...EMPTY_CART } })
  },

  setTableNumber(n) {
    set({ cart: { ...get().cart, tableNumber: n } })
  },

  setCustomer(customer) {
    const { cart } = get()
    // Pré-preenche a taxa de entrega a partir do endereço do cliente.
    // Hoje computeDeliveryFee retorna o mínimo; no futuro derivará do endereço.
    const deliveryFee = customer ? computeDeliveryFee(customer.address) : cart.deliveryFee
    set({ cart: { ...cart, customer, deliveryFee } })
  },

  setDeliveryFee(fee) {
    set({ cart: { ...get().cart, deliveryFee: fee } })
  },

  // ── Orders (assíncrono) ──────────────────────────────────────────────────────

  async confirmOrder() {
    const { cart } = get()
    if (!cart.customer) {
      throw new Error('Selecione um cliente para o pedido')
    }
    if (cart.deliveryFee < MIN_DELIVERY_FEE) {
      throw new Error('A taxa de entrega mínima é R$ 3,00')
    }
    const subtotal = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
    const total = subtotal + cart.deliveryFee

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
      customerId: cart.customer.id,
      deliveryFee: cart.deliveryFee,
    })

    set({ orders: [order, ...get().orders], cart: { ...EMPTY_CART } })
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
