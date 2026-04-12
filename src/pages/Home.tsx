import { useNavigate } from 'react-router-dom'
import { Pizza, Package, ClipboardList, ChevronRight } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useOrderStore } from '../store/orderStore'
import { useProductStore } from '../store/productStore'

export function Home() {
  const navigate = useNavigate()
  const orderCount = useOrderStore((s) => s.orders.length)
  const productCount = useProductStore((s) => s.products.length)
  const activeOrders = useOrderStore((s) =>
    s.orders.filter((o) => o.status !== 'delivered').length
  )

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 shadow-lg">
          <Pizza size={36} className="text-on_primary" />
        </div>

        <h1 className="text-4xl font-bold font-display text-on_surface mb-2">
          Qui<span className="text-primary">Service</span>
        </h1>
        <p className="text-on_surface_variant font-body text-lg mb-10">
          Sistema de controle de pedidos
        </p>

        <Button
          size="lg"
          fullWidth
          className="max-w-sm"
          onClick={() => navigate('/pedido/novo')}
        >
          Novo Pedido
        </Button>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4 mt-10 w-full max-w-sm">
          <div className="bg-surface_container_lowest rounded-2xl p-4 text-left">
            <p className="text-3xl font-bold font-display text-primary">{activeOrders}</p>
            <p className="text-sm text-on_surface_variant font-body mt-1">Pedidos ativos</p>
          </div>
          <div className="bg-surface_container_lowest rounded-2xl p-4 text-left">
            <p className="text-3xl font-bold font-display text-on_surface">{orderCount}</p>
            <p className="text-sm text-on_surface_variant font-body mt-1">Total de pedidos</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-col gap-3 mt-6 w-full max-w-sm">
          <button
            onClick={() => navigate('/produtos')}
            className="bg-surface_container_lowest rounded-2xl px-5 py-4 flex items-center justify-between text-left active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-medium font-display text-on_surface text-sm">Produtos</p>
                <p className="text-xs text-on_surface_variant font-body">
                  {productCount} {productCount === 1 ? 'cadastrado' : 'cadastrados'}
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-on_surface_variant" />
          </button>

          <button
            onClick={() => navigate('/pedidos')}
            className="bg-surface_container_lowest rounded-2xl px-5 py-4 flex items-center justify-between text-left active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <ClipboardList size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-medium font-display text-on_surface text-sm">Pedidos</p>
                <p className="text-xs text-on_surface_variant font-body">
                  {activeOrders} {activeOrders === 1 ? 'em andamento' : 'em andamento'}
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-on_surface_variant" />
          </button>
        </div>
      </div>
    </div>
  )
}
