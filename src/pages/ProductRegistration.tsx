import { useProductStore } from '../store/productStore'
import { ProductForm } from '../components/products/ProductForm'
import { ProductCard } from '../components/products/ProductCard'
import { PageHeader } from '../components/layout/PageHeader'
import { Package } from 'lucide-react'

export function ProductRegistration() {
  const products = useProductStore((s) => s.products)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader
        title="Produtos"
        subtitle="Gerencie o cardápio da pizzaria"
      />

      <ProductForm />

      <div className="mt-8">
        <h2 className="text-base font-semibold font-display text-on_surface_variant mb-4">
          Cardápio ({products.length} {products.length === 1 ? 'item' : 'itens'})
        </h2>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package size={40} className="text-on_surface_variant/40 mb-3" />
            <p className="text-on_surface_variant font-body">Nenhum produto cadastrado</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
