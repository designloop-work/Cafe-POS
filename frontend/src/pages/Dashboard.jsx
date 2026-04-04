import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import CountUp from 'react-countup'
import Navbar from '../components/Layout/Navbar'
import Skeleton from '../components/common/Skeleton'
import api from '../services/api'
import { formatCurrency, formatTime, statusColor } from '../utils/helpers'

const statCards = [
  { key: 'total_orders', label: 'Total Orders', icon: ShoppingBag, color: 'from-orange-500/20 to-orange-600/5', iconColor: 'text-brand', border: 'border-orange-500/20' },
  { key: 'total_revenue', label: 'Revenue', icon: TrendingUp, color: 'from-green-500/20 to-green-600/5', iconColor: 'text-green-400', border: 'border-green-500/20', isCurrency: true },
  { key: 'pending_total', label: 'Active Orders', icon: Clock, color: 'from-yellow-500/20 to-yellow-600/5', iconColor: 'text-yellow-400', border: 'border-yellow-500/20' },
  { key: 'completed_total', label: 'Completed', icon: CheckCircle2, color: 'from-blue-500/20 to-blue-600/5', iconColor: 'text-blue-400', border: 'border-blue-500/20' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length)
    return (
      <div className="glass-card px-3 py-2 text-xs">
        <p className="text-gray-400">{label}</p>
        <p className="text-brand font-semibold">{payload[0].value} orders</p>
      </div>
    )
  return null
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/kitchen/dashboard'), api.get('/orders')]).then(([s, o]) => {
      setStats(s.data)
      setOrders(o.data.slice(0, 8))
      setLoading(false)
    })
  }, [])

  const chartData = orders.reduce((acc, o) => {
    const hour = new Date(o.created_at).getHours() + ':00'
    const ex = acc.find((a) => a.hour === hour)
    if (ex) ex.orders += 1
    else acc.push({ hour, orders: 1 })
    return acc
  }, []).sort((a, b) => parseInt(a.hour) - parseInt(b.hour))

  const statValues = stats ? {
    total_orders: stats.total_orders,
    total_revenue: stats.total_revenue,
    pending_total: stats.pending + stats.preparing,
    completed_total: stats.completed + stats.paid,
  } : {}

  return (
    <div className="flex flex-col h-full">
      <Navbar title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ key, label, icon: Icon, color, iconColor, border, isCurrency }, i) => (
            <motion.div key={key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`glass-card p-5 bg-gradient-to-br ${color} border ${border} hover:shadow-card-hover transition-all duration-300`}>
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
                <div className={`${iconColor} opacity-70`}><Icon size={18} /></div>
              </div>
              <p className="text-2xl font-bold text-white">
                {loading ? <Skeleton className="h-7 w-20" /> : (
                  isCurrency
                    ? formatCurrency(statValues[key] || 0)
                    : <CountUp end={statValues[key] || 0} duration={1.5} />
                )}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="glass-card p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-white">Orders by Hour</h3>
                <p className="text-xs text-gray-500 mt-0.5">Today's order distribution</p>
              </div>
            </div>
            {loading ? <Skeleton className="h-44 w-full" /> : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3347" vertical={false} />
                  <XAxis dataKey="hour" stroke="#4b5563" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#4b5563" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(249,115,22,0.05)' }} />
                  <Bar dataKey="orders" fill="url(#brandGrad)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="brandGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ea580c" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Status breakdown */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="glass-card p-5">
            <h3 className="font-semibold text-white mb-4">Order Status</h3>
            {loading ? <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10" />)}</div> : (
              <div className="space-y-3">
                {[
                  { label: 'Pending', value: stats?.pending || 0, color: 'bg-yellow-500', bg: 'bg-yellow-500/10' },
                  { label: 'Preparing', value: stats?.preparing || 0, color: 'bg-blue-500', bg: 'bg-blue-500/10' },
                  { label: 'Completed', value: stats?.completed || 0, color: 'bg-green-500', bg: 'bg-green-500/10' },
                  { label: 'Paid', value: stats?.paid || 0, color: 'bg-gray-500', bg: 'bg-gray-500/10' },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${bg}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${color}`} />
                      <span className="text-sm text-gray-300">{label}</span>
                    </div>
                    <span className="text-sm font-semibold text-white">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="glass-card p-5">
          <h3 className="font-semibold text-white mb-4">Recent Orders</h3>
          {loading ? (
            <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : (
            <div className="space-y-1">
              {orders.map((o, i) => (
                <motion.div key={o.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-surface-2 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-3 flex items-center justify-center text-xs font-bold text-gray-400">
                      T{o.table_id?.slice(-2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Order #{o.id?.slice(-6)}</p>
                      <p className="text-xs text-gray-500">{formatTime(o.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-white">{formatCurrency(o.total_amount)}</span>
                    <span className={`badge ${statusColor[o.status]}`}>{o.status}</span>
                  </div>
                </motion.div>
              ))}
              {orders.length === 0 && <p className="text-gray-500 text-sm text-center py-6">No orders yet</p>}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
