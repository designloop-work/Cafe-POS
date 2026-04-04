import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { statusColor } from '../../utils/helpers'

export default function TableCard({ table, onClick }) {
  const isOccupied = table.status === 'occupied'
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(table)}
      className={`relative cursor-pointer rounded-2xl border p-5 transition-all duration-200 select-none overflow-hidden
        ${isOccupied
          ? 'border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-600/5 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]'
          : 'border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-600/5 hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]'
        }`}
    >
      {/* Glow dot */}
      <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${isOccupied ? 'bg-red-400' : 'bg-green-400'} shadow-[0_0_6px_currentColor]`} />

      <div className="text-3xl font-black text-white mb-2 tracking-tight">T{table.number}</div>
      <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
        <Users size={12} />
        <span>{table.capacity} seats</span>
      </div>
      <span className={`badge ${statusColor[table.status]} capitalize`}>
        {table.status}
      </span>
    </motion.div>
  )
}
