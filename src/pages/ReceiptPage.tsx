import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useOrderStore } from '../store/orderStore'
import { Receipt } from '../components/orders/Receipt'
import { Printer, ArrowLeft } from 'lucide-react'

/**
 * Página dedicada do cupom (fora do AppShell, sem barra de navegação).
 * Como o documento inteiro é o cupom, window.print() imprime exatamente ele —
 * funciona no Android/RawBT (que imprime a página principal).
 */
export function ReceiptPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const order = useOrderStore((s) => s.orders.find((o) => o.id === orderId))
  const fetchOrders = useOrderStore((s) => s.fetchOrders)
  const printed = useRef(false)

  // Se o pedido não estiver no store (ex.: abriu a página direto), busca.
  useEffect(() => {
    if (!order) fetchOrders()
  }, [order, fetchOrders])

  // Dispara a impressão automática uma vez, quando o cupom estiver pronto.
  useEffect(() => {
    if (order && !printed.current) {
      printed.current = true
      const t = setTimeout(() => window.print(), 400)
      return () => clearTimeout(t)
    }
  }, [order])

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-on_surface_variant font-body">
        Carregando recibo...
      </div>
    )
  }

  return (
    <div className="receipt-screen min-h-screen bg-white flex flex-col items-center py-6 gap-6">
      <Receipt order={order} />

      <div className="no-print flex gap-3">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-xl px-5 py-3 bg-gradient-primary text-on_primary font-display font-semibold active:scale-95 transition-transform"
        >
          <Printer size={18} /> Imprimir novamente
        </button>
        <button
          onClick={() => navigate('/pedidos')}
          className="flex items-center gap-2 rounded-xl px-5 py-3 bg-surface_container_low text-on_surface font-display font-semibold active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} /> Voltar aos pedidos
        </button>
      </div>
    </div>
  )
}
