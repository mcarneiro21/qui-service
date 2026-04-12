import { create } from 'zustand'
import { Product, ProductCategory } from '../types'
import { api } from '../lib/api'

interface ProductState {
  products: Product[]
  loading: boolean
  error: string | null
  fetchProducts: () => Promise<void>
  addProduct: (data: Omit<Product, 'id' | 'createdAt'>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  async fetchProducts() {
    set({ loading: true, error: null })
    try {
      const products = await api.products.list()
      set({ products })
    } catch (e) {
      set({ error: (e as Error).message })
    } finally {
      set({ loading: false })
    }
  },

  async addProduct(data) {
    const product = await api.products.create(data)
    set({ products: [...get().products, product] })
  },

  async deleteProduct(id) {
    await api.products.delete(id)
    set({ products: get().products.filter((p) => p.id !== id) })
  },
}))

export const CATEGORY_FILTER_OPTIONS: { label: string; value: ProductCategory | 'all' }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Pizzas', value: 'pizza' },
  { label: 'Esfirras', value: 'esfirra' },
  { label: 'Bebidas', value: 'refrigerante' },
]
