import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import Navbar from '../components/Layout/Navbar'
import ProductList from '../components/Order/ProductList'
import Cart from '../components/Order/Cart'
import Skeleton from '../components/common/Skeleton'
import api from '../services/api'
import { useOrder } from '../context/OrderContext'
import { notify } from '../utils/toast'

export default function Order() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const { cart, selectedTable, clearCart } = useOrder()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/products').then((r) => { setProducts(r.data); setLoading(false) })
  }, [])

  const handleCheckout = async () => {
    if (!selectedTable || cart.length === 0) return
    setPlacing(true)
    try {
      await api.post('/orders', {
        table_id: selectedTable.id,
        items: cart.map((i) => ({ product_id: i.id, quantity: i.quantity })),
      })
      notify.success(`Order placed for Table ${selectedTable.number}!`)
      clearCart()
      navigate('/payment')
    } catch (err) {
      notify.error(err.response?.data?.detail || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Navbar title={selectedTable ? `New Order — Table ${selectedTable.number}` : 'New Order'} />
      <div className="flex-1 flex overflow-hidden">
        {/* Products */}
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[...Array(9)].map((_, i) => <Skeleton key={i} className="h-36" />)}
            </div>
          ) : (
            <ProductList products={products} />
          )}
        </div>

        {/* Cart sidebar */}
        <div className="w-72 xl:w-80 border-l border-surface-border p-4 flex flex-col bg-surface-1/40">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart size={16} className="text-brand" />
            <h3 className="font-semibold text-white text-sm">Cart</h3>
            {cart.length > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="ml-auto text-xs font-bold bg-brand text-white rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </motion.span>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <Cart onCheckout={handleCheckout} loading={placing} />
          </div>
        </div>
      </div>
    </div>
  )
}
