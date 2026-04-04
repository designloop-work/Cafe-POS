import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ChefHat } from 'lucide-react'
import { formatCurrency, formatTime, statusColor } from '../../utils/helpers'

const NEXT_STATUS = { pending: 'preparing', preparing: 'completed' }
const NEXT_LABEL = { pending: '▶ Start Preparing', preparing: '✓ Mark Complete' }
const NEXT_COLOR = {
  pending: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20',
  preparing: 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20',
}

export default function OrderCard({ order, onStatusUpdate, isNew }) {
  const next = NEXT_STATUS[order.status]
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`rounded-2xl border p-4 space-y-3 transition-all duration-300
        ${order.status === 'pending'
          ? 'border-yellow-500/25 bg-gradient-to-br from-yellow-500/5 to-transparent'
          : 'border-blue-500/25 bg-gradient-to-br from-blue-500/5 to-transparent'}
        ${isNew ? 'ring-2 ring-brand/40 shadow-glow-sm' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-white text-base">Table {order.table_id?.slice(-4)}</p>
            {isNew && (
              <span className="text-xs bg-brand/20 text-brand border border-brand/30 px-2 py-0.5 rounded-full font-medium animate-pulse-slow">
                New
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Clock size={11} className="text-gray-500" />
            <p className="text-xs text-gray-500">{formatTime(order.created_at)}</p>
          </div>
        </div>
        <span className={`badge ${statusColor[order.status]} capitalize`}>{order.status}</span>
      </div>

      <div className="space-y-1.5 border-t border-white/5 pt-3">
        {order.items?.map((item, i) => (
          <div key={i} className="flex justify-between items-center text-sm">
            <span className="text-gray-300">{item.product_name}</span>
            <span className="text-xs font-bold bg-surface-3 text-gray-300 px-2 py-0.5 rounded-lg">×{item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-1">
        <span className="font-bold text-brand">{formatCurrency(order.total_amount)}</span>
        {next && (
          <motion.button whileTap={{ scale: 0.95 }}
            onClick={() => onStatusUpdate(order.id, next)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${NEXT_COLOR[order.status]}`}>
            {NEXT_LABEL[order.status]}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
