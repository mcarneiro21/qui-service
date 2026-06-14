import { create } from 'zustand'
import { Customer } from '../types'
import { api } from '../lib/api'

interface CustomerState {
  customers: Customer[]
  loading: boolean
  error: string | null
  fetchCustomers: () => Promise<void>
  addCustomer: (data: Omit<Customer, 'id' | 'createdAt'>) => Promise<Customer>
  updateCustomer: (id: string, data: Partial<Omit<Customer, 'id' | 'createdAt'>>) => Promise<void>
  deleteCustomer: (id: string) => Promise<void>
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  loading: false,
  error: null,

  async fetchCustomers() {
    set({ loading: true, error: null })
    try {
      const customers = await api.customers.list()
      set({ customers })
    } catch (e) {
      set({ error: (e as Error).message })
    } finally {
      set({ loading: false })
    }
  },

  async addCustomer(data) {
    const customer = await api.customers.create(data)
    set({ customers: [...get().customers, customer].sort((a, b) => a.name.localeCompare(b.name)) })
    return customer
  },

  async updateCustomer(id, data) {
    const updated = await api.customers.update(id, data)
    set({ customers: get().customers.map((c) => (c.id === id ? updated : c)) })
  },

  async deleteCustomer(id) {
    await api.customers.delete(id)
    set({ customers: get().customers.filter((c) => c.id !== id) })
  },
}))
