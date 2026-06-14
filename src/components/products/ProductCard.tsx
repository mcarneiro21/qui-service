import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Product } from '../../types'
import { useProductStore } from '../../store/productStore'
import { Badge } from '../ui/Badge'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const deleteProduct = useProductStore((s) => s.deleteProduct)
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
      await deleteProduct(product.id)
    } catch (e) {
      setError((e as Error).message)
      setTimeout(() => setError(null), 4000)
    }
  }

  return (
    <div className="bg-surface_container_lowest rounded-2xl px-5 py-4 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium font-display text-on_surface truncate">
                {product.name}
              </span>
              <Badge variant={product.category} />
            </div>
            <p className="text-sm text-on_surface_variant font-body mt-0.5 truncate">
              {product.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="font-bold font-display text-on_surface text-lg">
            R${product.price.toFixed(2).replace('.', ',')}
          </span>
          <button
            onClick={handleDelete}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors duration-150',
              confirming
                ? 'bg-primary text-on_primary'
                : 'bg-primary/10 text-primary hover:bg-primary/20',
            ].join(' ')}
            title="Excluir produto"
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
