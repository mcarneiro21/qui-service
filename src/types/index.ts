export type ProductCategory = 'pizza' | 'esfirra' | 'refrigerante'

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: ProductCategory
  createdAt: string
}

export interface OrderItem {
  productId: string
  product: Product
  quantity: number
}

export interface Order {
  id: string
  orderNumber: number
  items: OrderItem[]
  status: OrderStatus
  tableNumber?: number
  createdAt: string
  total: number
}

export interface Cart {
  items: OrderItem[]
  tableNumber?: number
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  pizza: 'Pizza',
  esfirra: 'Esfirra',
  refrigerante: 'Refrigerante',
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendente',
  preparing: 'Em Preparo',
  ready: 'Pronto',
  delivered: 'Entregue',
}
