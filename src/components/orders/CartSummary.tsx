import { ShoppingBag, Loader2 } from 'lucide-react'
import { useOrderStore } from '../../store/orderStore'

interface CartSummaryProps {
  onConfirm: () => void
  confirming?: boolean
}

export function CartSummary({ onConfirm, confirming = false }: CartSummaryProps) {
  const cart = useOrderStore((s) => s.cart)
  const total = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0)
  const disabled = cart.items.length === 0 || confirming

  return (
    <div className="border-t border-outline_variant/20 pt-4 mt-2">
      <div className="flex items-center justify-between mb-4">
        <span className="font-body text-on_surface_variant text-sm">
          {itemCount} {itemCount === 1 ? 'item' : 'itens'}
        </span>
        <div className="text-right">
          <p className="text-xs text-on_surface_variant font-body">Total</p>
          <p className="text-2xl font-bold font-display text-on_surface">
            R${total.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>

      <button
        onClick={onConfirm}
        disabled={disabled}
        className={[
          'w-full rounded-xl py-4 font-display font-semibold text-base text-on_primary',
          'flex items-center justify-center gap-2',
          'transition-all duration-150 active:scale-95',
          disabled
            ? 'bg-surface_container_highest text-on_surface_variant cursor-not-allowed'
            : 'bg-gradient-primary shadow-sm',
        ].join(' ')}
      >
        {confirming ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <ShoppingBag size={18} />
        )}
        {confirming ? 'Enviando...' : 'Confirmar Pedido'}
      </button>
    </div>
  )
}
