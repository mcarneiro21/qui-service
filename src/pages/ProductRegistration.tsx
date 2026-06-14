import { useEffect, useRef, useState } from 'react'
import { useProductStore } from '../store/productStore'
import { Product } from '../types'
import { ProductForm } from '../components/products/ProductForm'
import { ProductCard } from '../components/products/ProductCard'
import { PageHeader } from '../components/layout/PageHeader'
import { Package, Loader2 } from 'lucide-react'

export function ProductRegistration() {
  const products = useProductStore((s) => s.products)
  const loading = useProductStore((s) => s.loading)
  const fetchProducts = useProductStore((s) => s.fetchProducts)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  function handleEdit(product: Product) {
    setEditingProduct(product)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleCancel() {
    setEditingProduct(null)
  }

  function handleSuccess() {
    setEditingProduct(null)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader
        title="Produtos"
        subtitle="Gerencie o cardápio da pizzaria"
      />

      <div ref={formRef}>
        <ProductForm
          editingProduct={editingProduct}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-base font-semibold font-display text-on_surface_variant mb-4">
          Cardápio ({products.length} {products.length === 1 ? 'item' : 'itens'})
        </h2>

        {loading && products.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="text-primary animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package size={40} className="text-on_surface_variant/40 mb-3" />
            <p className="text-on_surface_variant font-body">Nenhum produto cadastrado</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={() => handleEdit(product)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
