import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrderStore } from '../store/orderStore'
import { OrderStatus, STATUS_LABELS } from '../types'
import { OrderCard } from '../components/orders/OrderCard'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui/Button'
import { ClipboardList, Plus, Loader2 } from 'lucide-react'

type FilterTab = OrderStatus | 'all'

const TABS: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: STATUS_LABELS.pending },
  { value: 'preparing', label: STATUS_LABELS.preparing },
  { value: 'ready', label: STATUS_LABELS.ready },
  { value: 'delivered', label: STATUS_LABELS.delivered },
]

export function OrderTracking() {
  const navigate = useNavigate()
  const orders = useOrderStore((s) => s.orders)
  const loading = useOrderStore((s) => s.loading)
  const fetchOrders = useOrderStore((s) => s.fetchOrders)
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filtered = useMemo(
    () => activeTab === 'all' ? orders : orders.filter((o) => o.status === activeTab),
    [orders, activeTab]
  )

  const counts = useMemo(() => {
    const c: Record<FilterTab, number> = { all: orders.length, pending: 0, preparing: 0, ready: 0, delivered: 0 }
    orders.forEach((o) => { c[o.status as OrderStatus]++ })
    return c
  }, [orders])

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader
        title="Pedidos"
        subtitle={`${counts.all} ${counts.all === 1 ? 'pedido' : 'pedidos'} no total`}
        action={
          <Button size="sm" onClick={() => navigate('/pedido/novo')}>
            <Plus size={14} className="inline mr-1" />
            Novo
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={[
              'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium font-body transition-colors duration-150',
              'flex items-center gap-1.5',
              activeTab === tab.value
                ? 'bg-primary text-on_primary'
                : 'bg-surface_container_lowest text-on_surface_variant hover:bg-surface_container_highest',
            ].join(' ')}
          >
            {tab.label}
            {counts[tab.value] > 0 && (
              <span className={[
                'text-xs px-1.5 py-0.5 rounded-full font-display',
                activeTab === tab.value
                  ? 'bg-white/20 text-on_primary'
                  : 'bg-surface_container_highest text-on_surface_variant',
              ].join(' ')}>
                {counts[tab.value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && orders.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="text-primary animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ClipboardList size={40} className="text-on_surface_variant/40 mb-3" />
          <p className="text-on_surface_variant font-body mb-6">
            {activeTab === 'all'
              ? 'Nenhum pedido ainda'
              : `Nenhum pedido com status "${STATUS_LABELS[activeTab as OrderStatus]}"`}
          </p>
          {activeTab === 'all' && (
            <Button onClick={() => navigate('/pedido/novo')}>
              Criar primeiro pedido
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
