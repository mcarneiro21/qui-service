import { Order, OrderItem } from '../../types'

function itemLabel(item: OrderItem): string {
  if (item.isHalfHalf && item.secondProduct) {
    return `1/2 ${item.product.name} + 1/2 ${item.secondProduct.name}`
  }
  return item.product.name
}

function brl(n: number): string {
  return n.toFixed(2).replace('.', ',')
}

const dashed: React.CSSProperties = { borderTop: '1px dashed #000', margin: '5px 0' }
const row: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', gap: '4px' }

/**
 * Cupom 58mm renderizado como conteúdo visível (48mm centrado). Pensado para
 * ocupar a página inteira na ReceiptPage e ser impresso com window.print() —
 * confiável no Android/RawBT (que imprime a página principal).
 */
export function Receipt({ order }: { order: Order }) {
  const createdAt = new Date(order.createdAt)
  const dateStr = createdAt.toLocaleDateString('pt-BR')
  const timeStr = createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const subtotal = order.total - order.deliveryFee

  return (
    <div
      style={{
        width: '48mm',
        boxSizing: 'border-box',
        padding: '2mm 1mm 8mm',
        fontFamily: '"Courier New", monospace',
        color: '#000',
        fontSize: '10px',
        fontWeight: 'bold',
        lineHeight: 1.35,
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '6px' }}>
        <div style={{ fontSize: '14px' }}>QUI PIZZAS</div>
        <div>Rua Antônio Del Buoni, 196</div>
        <div>(11) 2467-6793</div>
      </div>

      <div style={dashed} />

      <div style={row}>
        <span>PEDIDO #{order.orderNumber}</span>
        <span>{dateStr} {timeStr}</span>
      </div>
      {order.tableNumber != null && <div>Mesa: {order.tableNumber}</div>}

      {order.customer && (
        <>
          <div style={dashed} />
          <div>CLIENTE</div>
          <div>{order.customer.name}</div>
          <div>Tel: {order.customer.phone}</div>
          <div>End: {order.customer.address}</div>
        </>
      )}

      <div style={dashed} />

      <div>ITENS</div>
      {order.items.map((item, idx) => (
        <div key={idx} style={{ ...row, marginTop: '2px' }}>
          <span style={{ flex: 1, wordBreak: 'break-word' }}>
            {item.quantity}x {itemLabel(item)}
          </span>
          <span style={{ whiteSpace: 'nowrap' }}>{brl(item.product.price * item.quantity)}</span>
        </div>
      ))}

      <div style={dashed} />

      <div style={row}><span>Subtotal</span><span>R$ {brl(subtotal)}</span></div>
      <div style={row}><span>Entrega</span><span>R$ {brl(order.deliveryFee)}</span></div>
      <div style={{ ...row, fontSize: '12px', marginTop: '2px' }}>
        <span>TOTAL</span><span>R$ {brl(order.total)}</span>
      </div>

      <div style={{ textAlign: 'center', marginTop: '8px' }}>Obrigado pela preferência!</div>
    </div>
  )
}
