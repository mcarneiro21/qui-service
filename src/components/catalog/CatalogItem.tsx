import { Plus, Minus, Slash } from 'lucide-react'
import { Product } from '../../types'
import { Badge } from '../ui/Badge'

interface CatalogItemProps {
  product: Product
  quantityInCart: number
  onAdd: () => void
  onRemove: () => void
  onHalfHalf?: () => void
  selectingSecondHalf?: boolean
}

export function CatalogItem({
  product,
  quantityInCart,
  onAdd,
  onRemove,
  onHalfHalf,
  selectingSecondHalf = false,
}: CatalogItemProps) {
  return (
    <div className={[
      'rounded-2xl px-5 py-4 flex items-center justify-between gap-4 transition-colors',
      selectingSecondHalf
        ? 'bg-primary/5 ring-2 ring-primary/30'
        : 'bg-surface_container_lowest',
    ].join(' ')}>
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium font-display text-on_surface">{product.name}</span>
          <Badge variant={product.category} />
        </div>
        <p className="text-sm text-on_surface_variant font-body mt-0.5 truncate max-w-xs">
          {product.description}
        </p>
        <span className="text-base font-bold font-display text-primary mt-1 block">
          R${product.price.toFixed(2).replace('.', ',')}
        </span>
      </div>

      <div className="flex-shrink-0 flex items-center gap-2">
        {/* Botão meio a meio — só para pizzas, e só quando não estamos escolhendo a 2ª metade */}
        {product.category === 'pizza' && onHalfHalf && !selectingSecondHalf && (
          <button
            onClick={onHalfHalf}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-secondary_container text-on_secondary_container text-xs font-medium font-body active:scale-95 transition-transform"
            title="Adicionar como meio a meio"
          >
            <Slash size={12} />
            ½+½
          </button>
        )}

        {/* Controles de quantidade */}
        {quantityInCart === 0 ? (
          <button
            onClick={onAdd}
            className="w-10 h-10 rounded-xl bg-gradient-primary text-on_primary flex items-center justify-center active:scale-95 transition-transform shadow-sm"
            aria-label={`Adicionar ${product.name}`}
          >
            <Plus size={18} />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onRemove}
              className="w-8 h-8 rounded-xl bg-surface_container_highest text-on_surface flex items-center justify-center active:scale-95 transition-transform"
            >
              <Minus size={14} />
            </button>
            <span className="w-6 text-center font-bold font-display text-on_surface">
              {quantityInCart}
            </span>
            <button
              onClick={onAdd}
              className="w-8 h-8 rounded-xl bg-gradient-primary text-on_primary flex items-center justify-center active:scale-95 transition-transform shadow-sm"
            >
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
