import { NavLink, useLocation } from 'react-router-dom'
import { Home, Package, Users, ShoppingCart, ClipboardList } from 'lucide-react'
import { useOrderStore } from '../../store/orderStore'

const navItems = [
  { to: '/', icon: Home, label: 'Início', exact: true },
  { to: '/produtos', icon: Package, label: 'Produtos', exact: false },
  { to: '/clientes', icon: Users, label: 'Clientes', exact: false },
  { to: '/pedido/novo', icon: ShoppingCart, label: 'Pedido', exact: false },
  { to: '/pedidos', icon: ClipboardList, label: 'Pedidos', exact: false },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const cartCount = useOrderStore((s) => s.cart.items.reduce((sum, i) => sum + i.quantity, 0))

  return (
    <div className="min-h-screen bg-surface flex flex-col font-body">
      {/* Top bar — visible on desktop */}
      <header className="hidden md:flex items-center justify-between px-8 py-4 bg-surface_container_lowest border-b border-outline_variant/20">
        <span className="font-display font-bold text-xl text-on_surface tracking-tight">
          Qui<span className="text-primary">Service</span>
        </span>
        <nav className="flex items-center gap-1">
          {navItems.map(({ to, icon: Icon, label, exact }) => {
            const active = exact
              ? location.pathname === to
              : location.pathname.startsWith(to)
            return (
              <NavLink
                key={to}
                to={to}
                className={[
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-on_surface_variant hover:bg-surface_container_low hover:text-on_surface',
                ].join(' ')}
              >
                <Icon size={16} />
                {label}
                {label === 'Pedido' && cartCount > 0 && (
                  <span className="ml-1 bg-primary text-on_primary text-xs rounded-full w-5 h-5 flex items-center justify-center font-display">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Bottom nav — mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface_container_lowest border-t border-outline_variant/20 z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ to, icon: Icon, label, exact }) => {
            const active = exact
              ? location.pathname === to
              : location.pathname.startsWith(to)
            return (
              <NavLink
                key={to}
                to={to}
                className="flex flex-col items-center gap-1 px-3 py-1 relative"
              >
                <div className={[
                  'p-2 rounded-xl transition-colors duration-150',
                  active ? 'bg-primary/10' : '',
                ].join(' ')}>
                  <Icon
                    size={20}
                    className={active ? 'text-primary' : 'text-on_surface_variant'}
                  />
                  {label === 'Pedido' && cartCount > 0 && (
                    <span className="absolute top-0 right-2 bg-primary text-on_primary text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-display">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className={[
                  'text-[10px] font-medium',
                  active ? 'text-primary' : 'text-on_surface_variant',
                ].join(' ')}>
                  {label}
                </span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
