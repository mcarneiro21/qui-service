import { Plus, Minus } from 'lucide-react'
import { Product } from '../../types'
import { Badge } from '../ui/Badge'

interface CatalogItemProps {
  product: Product
  quantityInCart: number
  onAdd: () => void
  onRemove: () => void
}

export function CatalogItem({ product, quantityInCart, onAdd, onRemove }: CatalogItemProps) {
  return (
    <div className="bg-surface_container_lowest rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
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

      <div className="flex-shrink-0">
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
              aria-label="Remover um"
            >
              <Minus size={14} />
            </button>
            <span className="w-6 text-center font-bold font-display text-on_surface">
              {quantityInCart}
            </span>
            <button
              onClick={onAdd}
              className="w-8 h-8 rounded-xl bg-gradient-primary text-on_primary flex items-center justify-center active:scale-95 transition-transform shadow-sm"
              aria-label="Adicionar um"
            >
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
