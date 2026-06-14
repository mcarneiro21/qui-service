import { forwardRef } from 'react'
import { Order, OrderItem } from '../../types'

function itemLabel(item: OrderItem): string {
  if (item.isHalfHalf && item.secondProduct) {
    return `1/2 ${item.product.name} + 1/2 ${item.secondProduct.name}`
  }
  return item.product.name
}

interface ReceiptProps {
  order: Order
}

const dashed: React.CSSProperties = {
  borderTop: '1px dashed #000',
  margin: '5px 0',
}

const row: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '4px',
}

/**
 * Cupom de impressão para impressora térmica de 58mm (MPT-II / ESC-POS).
 * Fica fora da tela e só aparece via @media print (ver src/index.css).
 */
export const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(({ order }, ref) => {
  const createdAt = new Date(order.createdAt)
  const dateStr = createdAt.toLocaleDateString('pt-BR')
  const timeStr = createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const subtotal = order.total - order.deliveryFee

  return (
    <div ref={ref} className="receipt-print">
      <div
        style={{
          width: '48mm',
          margin: '0 auto',
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
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>QUI PIZZAS</div>
          <div>Rua Antônio Del Buoni, 196</div>
          <div>(11) 2467-6793</div>
        </div>

        <div style={dashed} />

        <div style={row}>
          <span style={{ fontWeight: 'bold' }}>PEDIDO #{order.orderNumber}</span>
          <span>{dateStr} {timeStr}</span>
        </div>
        {order.tableNumber != null && <div>Mesa: {order.tableNumber}</div>}

        {order.customer && (
          <>
            <div style={dashed} />
            <div style={{ fontWeight: 'bold' }}>CLIENTE</div>
            <div>{order.customer.name}</div>
            <div>Tel: {order.customer.phone}</div>
            <div>End: {order.customer.address}</div>
          </>
        )}

        <div style={dashed} />

        <div style={{ fontWeight: 'bold' }}>ITENS</div>
        {order.items.map((item, idx) => (
          <div key={idx} style={{ ...row, marginTop: '2px' }}>
            <span style={{ flex: 1, wordBreak: 'break-word' }}>
              {item.quantity}x {itemLabel(item)}
            </span>
            <span style={{ whiteSpace: 'nowrap' }}>
              {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
            </span>
          </div>
        ))}

        <div style={dashed} />

        <div style={row}>
          <span>Subtotal</span>
          <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
        </div>
        <div style={row}>
          <span>Entrega</span>
          <span>R$ {order.deliveryFee.toFixed(2).replace('.', ',')}</span>
        </div>
        <div style={{ ...row, fontWeight: 'bold', fontSize: '12px', marginTop: '2px' }}>
          <span>TOTAL</span>
          <span>R$ {order.total.toFixed(2).replace('.', ',')}</span>
        </div>

        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          Obrigado pela preferência!
        </div>
      </div>
    </div>
  )
})

Receipt.displayName = 'Receipt'
