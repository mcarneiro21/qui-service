import { Minus, Plus, Trash2 } from 'lucide-react'
import { OrderItem } from '../../types'
import { useOrderStore } from '../../store/orderStore'

interface CartItemProps {
  item: OrderItem
}

export function CartItem({ item }: CartItemProps) {
  const updateCartQuantity = useOrderStore((s) => s.updateCartQuantity)
  const removeFromCart = useOrderStore((s) => s.removeFromCart)

  const displayName = item.isHalfHalf && item.secondProduct
    ? `${item.product.name} / ${item.secondProduct.name}`
    : item.product.name

  const unitPrice = item.product.price

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex-1 min-w-0">
        <p className="font-medium font-display text-on_surface text-sm truncate">
          {displayName}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          {item.isHalfHalf && (
            <span className="text-[10px] bg-secondary_container text-on_secondary_container px-1.5 py-0.5 rounded-full font-body">
              ½+½
            </span>
          )}
          <p className="text-xs text-on_surface_variant font-body">
            R${unitPrice.toFixed(2).replace('.', ',')} cada
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={() => updateCartQuantity(item.productId, item.quantity - 1, item.isHalfHalf, item.secondProduct?.id)}
          className="w-7 h-7 rounded-lg bg-surface_container_highest text-on_surface flex items-center justify-center active:scale-95 transition-transform"
        >
          <Minus size={12} />
        </button>
        <span className="w-5 text-center font-bold font-display text-on_surface text-sm">
          {item.quantity}
        </span>
        <button
          onClick={() => updateCartQuantity(item.productId, item.quantity + 1, item.isHalfHalf, item.secondProduct?.id)}
          className="w-7 h-7 rounded-xl bg-gradient-primary text-on_primary flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus size={12} />
        </button>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="font-bold font-display text-on_surface text-sm w-16 text-right">
          R${(unitPrice * item.quantity).toFixed(2).replace('.', ',')}
        </span>
        <button
          onClick={() => removeFromCart(item.productId, item.isHalfHalf, item.secondProduct?.id)}
          className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center active:scale-95 transition-transform"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}
