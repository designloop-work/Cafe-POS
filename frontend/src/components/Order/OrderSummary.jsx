import { formatCurrency, formatTime, statusColor } from '../../utils/helpers'

export default function OrderSummary({ order }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Order #{order.id?.slice(-6)}</span>
        <span>{formatTime(order.created_at)}</span>
      </div>
      <div className="space-y-2">
        {order.items?.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-300">{item.product_name} <span className="text-gray-500">×{item.quantity}</span></span>
            <span className="text-white font-medium">{formatCurrency(item.unit_price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-surface-border pt-2 flex justify-between font-bold">
        <span className="text-white">Total</span>
        <span className="text-brand">{formatCurrency(order.total_amount)}</span>
      </div>
      <span className={`badge ${statusColor[order.status]} capitalize`}>{order.status}</span>
    </div>
  )
}
