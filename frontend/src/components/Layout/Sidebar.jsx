import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, UtensilsCrossed, ShoppingCart,
  CreditCard, ChefHat, LogOut, ChevronLeft, ChevronRight, Coffee
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tables', icon: UtensilsCrossed, label: 'Tables' },
  { to: '/order', icon: ShoppingCart, label: 'New Order' },
  { to: '/payment', icon: CreditCard, label: 'Payment' },
  { to: '/kitchen', icon: ChefHat, label: 'Kitchen' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 220 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative flex flex-col py-5 shrink-0 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #161b27 0%, #0f1117 100%)', borderRight: '1px solid #2a3347' }}
    >
      {/* Logo */}
      <div className="px-4 mb-6 flex items-center gap-3 overflow-hidden">
        <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shrink-0 shadow-glow-sm">
          <Coffee size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <p className="font-bold text-white text-sm leading-tight">CaféPOS</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-2">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-link overflow-hidden ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className="shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      className="text-sm whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && !collapsed && (
                  <motion.div layoutId="activeIndicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-brand" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-2 space-y-1 mt-2">
        <button
          onClick={handleLogout}
          className="nav-link nav-link-inactive w-full overflow-hidden text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
        >
          <LogOut size={18} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm whitespace-nowrap">
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-surface-2 border border-surface-border flex items-center justify-center text-gray-400 hover:text-white hover:bg-surface-3 transition-all z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  )
}
