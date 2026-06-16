import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { Home } from './pages/Home'
import { ProductRegistration } from './pages/ProductRegistration'
import { CustomerRegistration } from './pages/CustomerRegistration'
import { CreateOrder } from './pages/CreateOrder'
import { OrderTracking } from './pages/OrderTracking'
import { ReceiptPage } from './pages/ReceiptPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Cupom: fora do AppShell (sem barra de navegação) para imprimir limpo */}
        <Route path="/recibo/:orderId" element={<ReceiptPage />} />

        <Route
          path="/*"
          element={
            <AppShell>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/produtos" element={<ProductRegistration />} />
                <Route path="/clientes" element={<CustomerRegistration />} />
                <Route path="/pedido/novo" element={<CreateOrder />} />
                <Route path="/pedidos" element={<OrderTracking />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppShell>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
