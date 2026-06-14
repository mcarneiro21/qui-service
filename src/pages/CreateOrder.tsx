import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductStore, CATEGORY_FILTER_OPTIONS } from '../store/productStore'
import { useOrderStore, itemKey } from '../store/orderStore'
import { Product, ProductCategory } from '../types'
import { CatalogItem } from '../components/catalog/CatalogItem'
import { CartItem } from '../components/orders/CartItem'
import { CartSummary } from '../components/orders/CartSummary'
import { GlassCard } from '../components/ui/GlassCard'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/layout/PageHeader'
import { ShoppingCart, Loader2, X } from 'lucide-react'

type FilterValue = ProductCategory | 'all'

export function CreateOrder() {
  const navigate = useNavigate()
  const products = useProductStore((s) => s.products)
  const loadingProducts = useProductStore((s) => s.loading)
  const fetchProducts = useProductStore((s) => s.fetchProducts)
  const cart = useOrderStore((s) => s.cart)
  const addToCart = useOrderStore((s) => s.addToCart)
  const addHalfHalfToCart = useOrderStore((s) => s.addHalfHalfToCart)
  const updateCartQuantity = useOrderStore((s) => s.updateCartQuantity)
  const setTableNumber = useOrderStore((s) => s.setTableNumber)
  const confirmOrder = useOrderStore((s) => s.confirmOrder)

  const [filter, setFilter] = useState<FilterValue>('all')
  const [tableInput, setTableInput] = useState('')
  const [confirming, setConfirming] = useState(false)
  // Seleção meio a meio: guarda a primeira pizza escolhida
  const [halfHalfFirst, setHalfHalfFirst] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Mapa de quantidades no carrinho para itens normais
  const cartMap = useMemo(
    () => new Map(cart.items.filter((i) => !i.isHalfHalf).map((i) => [i.productId, i.quantity])),
    [cart.items]
  )

  const filteredProducts = useMemo(
    () => filter === 'all' ? products : products.filter((p) => p.category === filter),
    [products, filter]
  )

  // Ao clicar em "½+½" na primeira pizza
  function handleStartHalfHalf(product: Product) {
    setHalfHalfFirst(product)
    // Força mostrar só pizzas para facilitar seleção da segunda metade
    setFilter('pizza')
  }

  // Ao clicar na segunda pizza (botão "+" quando halfHalfFirst está ativo)
  function handleSelectSecondHalf(second: Product) {
    if (!halfHalfFirst) return
    addHalfHalfToCart(halfHalfFirst, second)
    setHalfHalfFirst(null)
  }

  async function handleConfirm() {
    if (confirming) return
    setConfirming(true)
    try {
      await confirmOrder()
      navigate('/pedidos')
    } finally {
      setConfirming(false)
    }
  }

  function handleTableInput(value: string) {
    setTableInput(value)
    const num = parseInt(value)
    setTableNumber(value && !isNaN(num) ? num : undefined)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <PageHeader title="Novo Pedido" subtitle="Selecione os itens do pedido" />

      <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-6">
        {/* Catalog */}
        <div>
          {/* Banner de seleção da 2ª metade */}
          {halfHalfFirst && (
            <div className="mb-4 px-4 py-3 rounded-2xl bg-secondary_container text-on_secondary_container flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold font-display text-sm">Escolha a 2ª metade</p>
                <p className="text-xs font-body mt-0.5">
                  1ª metade: <strong>{halfHalfFirst.name}</strong> — clique em outra pizza
                </p>
              </div>
              <button
                onClick={() => setHalfHalfFirst(null)}
                className="p-1.5 rounded-xl hover:bg-black/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Filtros de categoria */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {CATEGORY_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={[
                  'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium font-body transition-colors duration-150',
                  filter === opt.value
                    ? 'bg-primary text-on_primary'
                    : 'bg-surface_container_lowest text-on_surface_variant hover:bg-surface_container_highest',
                ].join(' ')}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {loadingProducts && products.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="text-primary animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-on_surface_variant font-body">Nenhum produto nessa categoria</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredProducts.map((product) => (
                <CatalogItem
                  key={product.id}
                  product={product}
                  quantityInCart={cartMap.get(product.id) ?? 0}
                  selectingSecondHalf={!!halfHalfFirst && product.category === 'pizza' && product.id !== halfHalfFirst.id}
                  onAdd={() => {
                    if (halfHalfFirst && product.category === 'pizza') {
                      handleSelectSecondHalf(product)
                    } else {
                      addToCart(product)
                    }
                  }}
                  onRemove={() =>
                    updateCartQuantity(product.id, (cartMap.get(product.id) ?? 1) - 1)
                  }
                  onHalfHalf={
                    product.category === 'pizza' && !halfHalfFirst
                      ? () => handleStartHalfHalf(product)
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Cart — glass panel */}
        <div className="mt-6 lg:mt-0">
          <div className="lg:sticky lg:top-8">
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart size={18} className="text-primary" />
                <h2 className="font-bold font-display text-on_surface">Carrinho</h2>
                {cart.items.length > 0 && (
                  <span className="ml-auto text-xs bg-primary text-on_primary px-2 py-0.5 rounded-full font-display">
                    {cart.items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>

              <Input
                label="Mesa (opcional)"
                placeholder="Ex: 14"
                value={tableInput}
                onChange={(e) => handleTableInput(e.target.value)}
                type="number"
                min={1}
                className="mb-4"
              />

              {cart.items.length === 0 ? (
                <div className="py-8 text-center">
                  <ShoppingCart size={32} className="text-on_surface_variant/30 mx-auto mb-2" />
                  <p className="text-sm text-on_surface_variant font-body">
                    Adicione itens do cardápio
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-outline_variant/15">
                  {cart.items.map((item) => (
                    <CartItem key={itemKey(item)} item={item} />
                  ))}
                </div>
              )}

              <CartSummary onConfirm={handleConfirm} confirming={confirming} />
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Mobile: sticky cart summary */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 px-4 pb-3 z-40">
        {cart.items.length > 0 && (
          <div className="bg-white/90 backdrop-blur-[20px] rounded-2xl p-4 shadow-lg">
            <CartSummary onConfirm={handleConfirm} confirming={confirming} />
          </div>
        )}
      </div>
    </div>
  )
}
