import { useEffect, useRef, useState } from 'react'
import { useCustomerStore } from '../store/customerStore'
import { Customer } from '../types'
import { CustomerForm } from '../components/customers/CustomerForm'
import { CustomerCard } from '../components/customers/CustomerCard'
import { PageHeader } from '../components/layout/PageHeader'
import { Users, Loader2 } from 'lucide-react'

export function CustomerRegistration() {
  const customers = useCustomerStore((s) => s.customers)
  const loading = useCustomerStore((s) => s.loading)
  const fetchCustomers = useCustomerStore((s) => s.fetchCustomers)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  function handleEdit(customer: Customer) {
    setEditingCustomer(customer)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleCancel() {
    setEditingCustomer(null)
  }

  function handleSuccess() {
    setEditingCustomer(null)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader
        title="Clientes"
        subtitle="Cadastro de clientes para os pedidos"
      />

      <div ref={formRef}>
        <CustomerForm
          editingCustomer={editingCustomer}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-base font-semibold font-display text-on_surface_variant mb-4">
          Clientes ({customers.length} {customers.length === 1 ? 'cliente' : 'clientes'})
        </h2>

        {loading && customers.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="text-primary animate-spin" />
          </div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users size={40} className="text-on_surface_variant/40 mb-3" />
            <p className="text-on_surface_variant font-body">Nenhum cliente cadastrado</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {customers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onEdit={() => handleEdit(customer)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
