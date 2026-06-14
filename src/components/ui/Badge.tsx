import { OrderStatus, ProductCategory, STATUS_LABELS, CATEGORY_LABELS } from '../../types'

type BadgeVariant = OrderStatus | ProductCategory

const statusClasses: Record<OrderStatus, string> = {
  pending: 'bg-surface_container_highest text-on_surface',
  preparing: 'bg-amber-100 text-amber-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-primary_container text-on_primary',
}

const categoryClasses: Record<ProductCategory, string> = {
  pizza: 'bg-primary/10 text-primary',
  broto: 'bg-orange-100 text-orange-800',
  esfirra: 'bg-amber-100 text-amber-800',
  refrigerante: 'bg-blue-100 text-blue-800',
}

function isOrderStatus(v: BadgeVariant): v is OrderStatus {
  return ['pending', 'preparing', 'ready', 'delivered'].includes(v)
}

function isProductCategory(v: BadgeVariant): v is ProductCategory {
  return ['pizza', 'broto', 'esfirra', 'refrigerante'].includes(v)
}

interface BadgeProps {
  variant: BadgeVariant
}

export function Badge({ variant }: BadgeProps) {
  let cls = ''
  let label = ''

  if (isOrderStatus(variant)) {
    cls = statusClasses[variant]
    label = STATUS_LABELS[variant]
  } else if (isProductCategory(variant)) {
    cls = categoryClasses[variant]
    label = CATEGORY_LABELS[variant]
  }

  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-body',
        cls,
      ].join(' ')}
    >
      {label}
    </span>
  )
}
