import { OrderStatus, STATUS_LABELS } from '../../types'
import { useOrderStore } from '../../store/orderStore'

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'preparing', 'ready', 'delivered']

interface StatusSelectorProps {
  orderId: string
  currentStatus: OrderStatus
}

export function StatusSelector({ orderId, currentStatus }: StatusSelectorProps) {
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus)

  return (
    <select
      value={currentStatus}
      onChange={(e) => updateOrderStatus(orderId, e.target.value as OrderStatus)}
      className="rounded-xl bg-surface_container_low px-3 py-2 text-sm font-body text-on_surface outline-none cursor-pointer focus:bg-surface_container_highest transition-colors"
    >
      {STATUS_OPTIONS.map((status) => (
        <option key={status} value={status}>
          {STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  )
}
