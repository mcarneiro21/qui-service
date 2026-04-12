import { create } from 'zustand'
import { Product, ProductCategory } from '../types'
import { loadFromStorage, saveToStorage } from '../lib/persistence'

const STORAGE_KEY = 'qui:products'

const SEED_PRODUCTS: Product[] = [
  {
    id: 'seed-1',
    name: 'Margherita Clássica',
    description: 'Molho de tomate, mozzarella fior di latte e manjericão fresco',
    price: 38.0,
    category: 'pizza',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-2',
    name: 'Esfirra de Carne',
    description: 'Massa artesanal com carne temperada e cebola caramelizada',
    price: 12.0,
    category: 'esfirra',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-3',
    name: 'Refrigerante Lata',
    description: 'Coca-Cola, Pepsi ou Guaraná Antarctica (350ml)',
    price: 6.0,
    category: 'refrigerante',
    createdAt: new Date().toISOString(),
  },
]

interface ProductState {
  products: Product[]
  addProduct: (data: Omit<Product, 'id' | 'createdAt'>) => void
  updateProduct: (id: string, patch: Partial<Omit<Product, 'id' | 'createdAt'>>) => void
  deleteProduct: (id: string) => void
}

const initialProducts = loadFromStorage<Product[]>(STORAGE_KEY, [])

export const useProductStore = create<ProductState>((set, get) => ({
  products: initialProducts.length > 0 ? initialProducts : SEED_PRODUCTS,

  addProduct(data) {
    const product: Product = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    const products = [...get().products, product]
    set({ products })
    saveToStorage(STORAGE_KEY, products)
  },

  updateProduct(id, patch) {
    const products = get().products.map((p) =>
      p.id === id ? { ...p, ...patch } : p
    )
    set({ products })
    saveToStorage(STORAGE_KEY, products)
  },

  deleteProduct(id) {
    const products = get().products.filter((p) => p.id !== id)
    set({ products })
    saveToStorage(STORAGE_KEY, products)
  },
}))

export const CATEGORY_FILTER_OPTIONS: { label: string; value: ProductCategory | 'all' }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Pizzas', value: 'pizza' },
  { label: 'Esfirras', value: 'esfirra' },
  { label: 'Bebidas', value: 'refrigerante' },
]
