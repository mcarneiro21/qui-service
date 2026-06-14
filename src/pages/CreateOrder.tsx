import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductStore, CATEGORY_FILTER_OPTIONS } from '../store/productStore'
import { useOrderStore, itemKey } from '../store/orderStore'
import { useCustomerStore } from '../store/customerStore'
import { Customer, Order, Product, ProductCategory } from '../types'
import { CatalogItem } from '../components/catalog/CatalogItem'
import { CartItem } from '../components/orders/CartItem'
import { CartSummary } from '../components/orders/CartSummary'
import { CustomerSelect } from '../components/customers/CustomerSelect'
import { Receipt } from '../components/orders/Receipt'
import { GlassCard } from '../components/ui/GlassCard'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/layout/PageHeader'
import { computeDeliveryFee } from '../lib/delivery'
import { ShoppingCart, Loader2, X } from 'lucide-react'

type FilterValue = ProductCategory | 'all'

export function CreateOrder() {
  const navigate = useNavigate()
  const products = useProductStore((s) => s.products)
  const loadingProducts = useProductStore((s) => s.loading)
  const fetchProducts = useProductStore((s) => s.fetchProducts)
  const fetchCustomers = useCustomerStore((s) => s.fetchCustomers)
  const cart = useOrderStore((s) => s.cart)
  const addToCart = useOrderStore((s) => s.addToCart)
  const addHalfHalfToCart = useOrderStore((s) => s.addHalfHalfToCart)
  const updateCartQuantity = useOrderStore((s) => s.updateCartQuantity)
  const setTableNumber = useOrderStore((s) => s.setTableNumber)
  const setCustomer = useOrderStore((s) => s.setCustomer)
  const setDeliveryFee = useOrderStore((s) => s.setDeliveryFee)
  const confirmOrder = useOrderStore((s) => s.confirmOrder)

  const [filter, setFilter] = useState<FilterValue>('all')
  const [tableInput, setTableInput] = useState('')
  const [deliveryInput, setDeliveryInput] = useState(
    cart.deliveryFee.toFixed(2).replace('.', ',')
  )
  const [confirming, setConfirming] = useState(false)
  const [confirmError, setConfirmError] = useState<string | null>(null)
  const [halfHalfFirst, setHalfHalfFirst] = useState<Product | null>(null)
  const [printOrder, setPrintOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchProducts()
    fetchCustomers()
  }, [fetchProducts, fetchCustomers])

  // Impressão automática do cupom após confirmar
  useEffect(() => {
    if (!printOrder) return
    let navigated = false
    const go = () => {
      if (navigated) return
      navigated = true
      navigate('/pedidos')
    }
    window.addEventListener('afterprint', go)
    const raf = requestAnimationFrame(() => window.print())
    const fallback = setTimeout(go, 3000)
    return () => {
      window.removeEventListener('afterprint', go)
      cancelAnimationFrame(raf)
      clearTimeout(fallback)
    }
  }, [printOrder, navigate])

  const cartMap = useMemo(
    () => new Map(cart.items.filter((i) => !i.isHalfHalf).map((i) => [i.productId, i.quantity])),
    [cart.items]
  )

  const filteredProducts = useMemo(
    () => filter === 'all' ? products : products.filter((p) => p.category === filter),
    [products, filter]
  )

  function handleStartHalfHalf(product: Product) {
    setHalfHalfFirst(product)
    setFilter('pizza')
  }

  function handleSelectSecondHalf(second: Product) {
    if (!halfHalfFirst) return
    addHalfHalfToCart(halfHalfFirst, second)
    setHalfHalfFirst(null)
  }

  async function handleConfirm() {
    if (confirming) return
    setConfirming(true)
    setConfirmError(null)
    try {
      const order = await confirmOrder()
      setPrintOrder(order) // dispara a impressão automática (useEffect)
    } catch (e) {
      setConfirmError((e as Error).message)
      setConfirming(false)
    }
  }

  function handleTableInput(value: string) {
    setTableInput(value)
    const num = parseInt(value)
    setTableNumber(value && !isNaN(num) ? num : undefined)
  }

  // Ao selecionar o cliente, a taxa de entrega é pré-preenchida (hoje = mínimo;
  // futuro = derivada do endereço). O campo continua editável.
  function handleSelectCustomer(customer: Customer | undefined) {
    setCustomer(customer)
    const fee = customer ? computeDeliveryFee(customer.address) : cart.deliveryFee
    setDeliveryInput(fee.toFixed(2).replace('.', ','))
  }

  function handleDeliveryInput(value: string) {
    const clean = value.replace(/[^0-9,.]/g, '')
    setDeliveryInput(clean)
    const num = parseFloat(clean.replace(',', '.'))
    setDeliveryFee(isNaN(num) ? 0 : num)
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

              <CustomerSelect selected={cart.customer} onSelect={handleSelectCustomer} />

              <div className="grid grid-cols-2 gap-3 mb-4">
                <Input
                  label="Mesa (opcional)"
                  placeholder="Ex: 14"
                  value={tableInput}
                  onChange={(e) => handleTableInput(e.target.value)}
                  type="number"
                  min={1}
                />
                <Input
                  label="Entrega (R$)"
                  placeholder="3,00"
                  value={deliveryInput}
                  onChange={(e) => handleDeliveryInput(e.target.value)}
                  inputMode="decimal"
                />
              </div>

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

              {confirmError && (
                <p className="text-xs text-primary font-body mt-3 text-center">{confirmError}</p>
              )}

              <CartSummary
                onConfirm={handleConfirm}
                confirming={confirming}
                customerSelected={!!cart.customer}
              />
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Mobile: sticky cart summary */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 px-4 pb-3 z-40">
        {cart.items.length > 0 && (
          <div className="bg-white/90 backdrop-blur-[20px] rounded-2xl p-4 shadow-lg">
            <CartSummary
              onConfirm={handleConfirm}
              confirming={confirming}
              customerSelected={!!cart.customer}
            />
          </div>
        )}
      </div>

      {/* Cupom para impressão (fora da tela, visível só ao imprimir) */}
      {printOrder && <Receipt order={printOrder} />}
    </div>
  )
}
