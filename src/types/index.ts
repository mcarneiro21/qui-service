export type ProductCategory = 'pizza' | 'broto' | 'esfirra' | 'refrigerante'

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: ProductCategory
  createdAt: string
}

export interface Customer {
  id: string
  name: string
  address: string
  phone: string
  createdAt: string
}

export interface OrderItem {
  productId: string
  product: Product
  quantity: number
  isHalfHalf?: boolean
  secondProduct?: Product
}

export interface Order {
  id: string
  orderNumber: number
  items: OrderItem[]
  status: OrderStatus
  tableNumber?: number
  deliveryFee: number
  createdAt: string
  total: number
  customer?: Customer
}

export interface Cart {
  items: OrderItem[]
  tableNumber?: number
  customer?: Customer
  deliveryFee: number
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  pizza: 'Pizza',
  broto: 'Broto',
  esfirra: 'Esfirra',
  refrigerante: 'Refrigerante',
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendente',
  preparing: 'Em Preparo',
  ready: 'Pronto',
  delivered: 'Entregue',
}

export function halfHalfPrice(a: number, b: number): number {
  return Math.max(a, b)
}
