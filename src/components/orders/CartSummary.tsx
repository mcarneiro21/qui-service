import { ShoppingBag, Loader2 } from 'lucide-react'
import { useOrderStore } from '../../store/orderStore'
import { MIN_DELIVERY_FEE } from '../../lib/delivery'

interface CartSummaryProps {
  onConfirm: () => void
  confirming?: boolean
  customerSelected?: boolean
}

function brl(value: number) {
  return `R$${value.toFixed(2).replace('.', ',')}`
}

export function CartSummary({ onConfirm, confirming = false, customerSelected = true }: CartSummaryProps) {
  const cart = useOrderStore((s) => s.cart)
  const subtotal = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0)
  const deliveryValid = cart.deliveryFee >= MIN_DELIVERY_FEE
  const total = subtotal + (deliveryValid ? cart.deliveryFee : 0)
  const disabled = cart.items.length === 0 || !customerSelected || !deliveryValid || confirming

  return (
    <div className="border-t border-outline_variant/20 pt-4 mt-2">
      <div className="flex flex-col gap-1 mb-4">
        <div className="flex items-center justify-between text-sm font-body text-on_surface_variant">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'itens'})</span>
          <span>{brl(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm font-body text-on_surface_variant">
          <span>Entrega</span>
          <span>{brl(cart.deliveryFee)}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="font-body text-on_surface text-sm font-medium">Total</span>
          <span className="text-2xl font-bold font-display text-on_surface">{brl(total)}</span>
        </div>
      </div>

      {!customerSelected && cart.items.length > 0 && (
        <p className="text-xs text-primary font-body mb-3 text-center">
          Selecione um cliente para confirmar
        </p>
      )}
      {customerSelected && !deliveryValid && cart.items.length > 0 && (
        <p className="text-xs text-primary font-body mb-3 text-center">
          A taxa de entrega mínima é R$ 3,00
        </p>
      )}

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
