import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChefHat, Clock } from 'lucide-react'
import Navbar from '../components/Layout/Navbar'
import OrderCard from '../components/Kitchen/OrderCard'
import Skeleton from '../components/common/Skeleton'
import { useSocket } from '../hooks/useSocket'
import api from '../services/api'
import { notify } from '../utils/toast'

export default function Kitchen() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [newOrderIds, setNewOrderIds] = useState(new Set())
  const prevOrderIds = useRef(new Set())

  const fetchOrders = useCallback(() => {
    api.get('/kitchen/orders').then((r) => {
      const incoming = r.data
      const incomingIds = new Set(incoming.map((o) => o.id))
      const fresh = new Set([...incomingIds].filter((id) => !prevOrderIds.current.has(id)))
      if (fresh.size > 0 && prevOrderIds.current.size > 0) {
        setNewOrderIds(fresh)
        notify.success(`${fresh.size} new order${fresh.size > 1 ? 's' : ''} received!`)
        setTimeout(() => setNewOrderIds(new Set()), 8000)
      }
      prevOrderIds.current = incomingIds
      setOrders(incoming)
      setLoading(false)
    })
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  useSocket(useCallback((msg) => {
    if (msg.event === 'new_order' || msg.event === 'order_updated') fetchOrders()
  }, [fetchOrders]))

  const handleStatusUpdate = async (orderId, status) => {
    await api.patch(`/orders/${orderId}/status`, { status })
    fetchOrders()
  }

  const pending = orders.filter((o) => o.status === 'pending')
  const preparing = orders.filter((o) => o.status === 'preparing')

  const Column = ({ title, items, color, dotColor, emptyMsg }) => (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center gap-2.5 mb-4 px-1">
        <div className={`w-2.5 h-2.5 rounded-full ${dotColor} shadow-[0_0_8px_currentColor] animate-pulse`} />
        <h3 className={`font-semibold text-sm ${color}`}>{title}</h3>
        <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${color} bg-current/10`}
          style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
          {items.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        <AnimatePresence mode="popLayout">
          {items.map((o) => (
            <OrderCard key={o.id} order={o} onStatusUpdate={handleStatusUpdate} isNew={newOrderIds.has(o.id)} />
          ))}
        </AnimatePresence>
        {items.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-600">
            <ChefHat size={28} className="mb-2 opacity-40" />
            <p className="text-sm">{emptyMsg}</p>
          </div>
        )}
        {loading && [...Array(2)].map((_, i) => <Skeleton key={i} className="h-36" />)}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      <Navbar title="Kitchen Display" />
      <div className="flex-1 overflow-hidden flex gap-0 p-5">
        <div className="flex-1 flex flex-col overflow-hidden pr-4 border-r border-surface-border">
          <Column title="Pending Orders" items={pending} color="text-yellow-400" dotColor="bg-yellow-400" emptyMsg="No pending orders" />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden pl-4">
          <Column title="In Preparation" items={preparing} color="text-blue-400" dotColor="bg-blue-400" emptyMsg="Nothing being prepared" />
        </div>
      </div>
    </div>
  )
}
