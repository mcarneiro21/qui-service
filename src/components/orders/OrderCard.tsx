import { useState } from 'react'
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Order, OrderItem } from '../../types'
import { useOrderStore } from '../../store/orderStore'
import { Badge } from '../ui/Badge'
import { StatusSelector } from './StatusSelector'

interface OrderCardProps {
  order: Order
}

function itemLabel(item: OrderItem): string {
  if (item.isHalfHalf && item.secondProduct) {
    return `${item.product.name} / ${item.secondProduct.name}`
  }
  return item.product.name
}

function itemKey(item: OrderItem): string {
  if (item.isHalfHalf && item.secondProduct) {
    return `half:${item.productId}:${item.secondProduct.id}`
  }
  return item.productId
}

export function OrderCard({ order }: OrderCardProps) {
  const deleteOrder = useOrderStore((s) => s.deleteOrder)
  const [expanded, setExpanded] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const createdAt = new Date(order.createdAt)
  const timeStr = createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const dateStr = createdAt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

  function handleDelete() {
    if (confirming) {
      deleteOrder(order.id)
    } else {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3000)
    }
  }

  return (
    <div className="bg-surface_container_lowest rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-bold font-display text-on_surface text-lg">
            #{order.orderNumber}
          </span>
          {order.tableNumber && (
            <span className="text-sm text-on_surface_variant font-body">
              Mesa {order.tableNumber}
            </span>
          )}
          <Badge variant={order.status} />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="text-right">
            <p className="font-bold font-display text-on_surface">
              R${order.total.toFixed(2).replace('.', ',')}
            </p>
            <p className="text-xs text-on_surface_variant font-body">
              {dateStr} às {timeStr}
            </p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-8 h-8 rounded-xl bg-surface_container_low text-on_surface_variant flex items-center justify-center transition-colors hover:bg-surface_container_highest"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Item summary when collapsed */}
      {!expanded && (
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          {order.items.map((item) => (
            <span
              key={itemKey(item)}
              className="text-xs bg-surface_container_low text-on_surface_variant px-2.5 py-1 rounded-full font-body flex items-center gap-1"
            >
              {item.quantity}x {itemLabel(item)}
              {item.isHalfHalf && (
                <span className="text-[10px] bg-secondary_container text-on_secondary_container px-1 rounded-full">
                  ½+½
                </span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-4 border-t border-outline_variant/15 mt-1 pt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            {order.items.map((item) => (
              <div key={itemKey(item)} className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-body text-on_surface text-sm">
                    {item.quantity}x {itemLabel(item)}
                  </span>
                  {item.isHalfHalf && (
                    <span className="text-[10px] bg-secondary_container text-on_secondary_container px-1.5 py-0.5 rounded-full font-body">
                      ½+½
                    </span>
                  )}
                </div>
                <span className="font-display font-semibold text-on_surface text-sm flex-shrink-0">
                  R${(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <StatusSelector orderId={order.id} currentStatus={order.status} />
            <button
              onClick={handleDelete}
              className={[
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-150',
                confirming
                  ? 'bg-primary text-on_primary'
                  : 'bg-primary/10 text-primary hover:bg-primary/20',
              ].join(' ')}
            >
              <Trash2 size={14} />
              {confirming ? 'Confirmar?' : 'Excluir'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
