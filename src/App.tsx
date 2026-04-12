import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { Home } from './pages/Home'
import { ProductRegistration } from './pages/ProductRegistration'
import { CreateOrder } from './pages/CreateOrder'
import { OrderTracking } from './pages/OrderTracking'

export function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<ProductRegistration />} />
          <Route path="/pedido/novo" element={<CreateOrder />} />
          <Route path="/pedidos" element={<OrderTracking />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}
