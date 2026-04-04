import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { OrderProvider } from './context/OrderContext'
import Sidebar from './components/Layout/Sidebar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Tables from './pages/Tables'
import Order from './pages/Order'
import Payment from './pages/Payment'
import Kitchen from './pages/Kitchen'

function ProtectedLayout() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col bg-surface">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OrderProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#1c2333', color: '#f1f5f9', border: '1px solid #2a3347', borderRadius: '12px', fontSize: '14px' },
              success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tables" element={<Tables />} />
              <Route path="/order" element={<Order />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/kitchen" element={<Kitchen />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </OrderProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
