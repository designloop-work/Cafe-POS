import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { useOrder } from '../../context/OrderContext'
import { formatCurrency } from '../../utils/helpers'

export default function Cart({ onCheckout, loading }) {
  const { cart, updateQuantity, removeFromCart, cartTotal, selectedTable } = useOrder()

  if (cart.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-3">
        <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center">
          <ShoppingCart size={24} className="text-gray-600" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">Cart is empty</p>
          <p className="text-xs text-gray-600 mt-0.5">Add items from the menu</p>
        </div>
      </div>
    )

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <AnimatePresence initial={false}>
          {cart.map((item) => (
            <motion.div key={item.id}
              initial={{ opacity: 0, x: 20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: -20, height: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex items-center gap-3 bg-surface-2 border border-surface-border rounded-xl p-3 overflow-hidden"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{item.name}</p>
                <p className="text-xs text-brand mt-0.5">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-6 h-6 rounded-lg bg-surface-3 flex items-center justify-center text-gray-400 hover:text-white hover:bg-surface-border transition-all">
                  <Minus size={11} />
                </button>
                <span className="text-sm font-semibold text-white w-5 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-6 h-6 rounded-lg bg-surface-3 flex items-center justify-center text-gray-400 hover:text-white hover:bg-surface-border transition-all">
                  <Plus size={11} />
                </button>
                <button onClick={() => removeFromCart(item.id)}
                  className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all ml-1">
                  <Trash2 size={11} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="border-t border-surface-border pt-4 mt-3 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Subtotal ({cart.length} items)</span>
          <span className="text-sm text-white font-medium">{formatCurrency(cartTotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-white">Total</span>
          <span className="text-xl font-bold text-brand">{formatCurrency(cartTotal)}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onCheckout}
          disabled={!selectedTable || loading}
          className="btn-primary w-full py-3.5 text-sm"
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : selectedTable ? (
            `Place Order — Table ${selectedTable.number}`
          ) : (
            'Select a Table First'
          )}
        </motion.button>
      </div>
    </div>
  )
}
