import { useState } from 'react'
import { Trash2, Pencil, MapPin, Phone } from 'lucide-react'
import { Customer } from '../../types'
import { useCustomerStore } from '../../store/customerStore'

interface CustomerCardProps {
  customer: Customer
  onEdit: () => void
}

export function CustomerCard({ customer, onEdit }: CustomerCardProps) {
  const deleteCustomer = useCustomerStore((s) => s.deleteCustomer)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3000)
      return
    }
    setConfirming(false)
    try {
      await deleteCustomer(customer.id)
    } catch (e) {
      setError((e as Error).message)
      setTimeout(() => setError(null), 4000)
    }
  }

  return (
    <div className="bg-surface_container_lowest rounded-2xl px-5 py-4 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <span className="font-medium font-display text-on_surface truncate block">
            {customer.name}
          </span>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="flex items-center gap-1 text-sm text-on_surface_variant font-body">
              <Phone size={13} /> {customer.phone}
            </span>
            <span className="flex items-center gap-1 text-sm text-on_surface_variant font-body">
              <MapPin size={13} /> {customer.address}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onEdit}
            className="w-8 h-8 rounded-xl bg-surface_container_low text-on_surface_variant flex items-center justify-center hover:bg-surface_container_highest transition-colors"
            title="Editar cliente"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={handleDelete}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors duration-150',
              confirming
                ? 'bg-primary text-on_primary'
                : 'bg-primary/10 text-primary hover:bg-primary/20',
            ].join(' ')}
            title="Excluir cliente"
          >
            <Trash2 size={14} />
            {confirming ? 'Confirmar?' : ''}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-primary font-body bg-primary/5 rounded-xl px-3 py-2">
          {error}
        </p>
      )}
    </div>
  )
}
