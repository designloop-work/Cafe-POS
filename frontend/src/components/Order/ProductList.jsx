import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import { useOrder } from '../../context/OrderContext'
import { formatCurrency } from '../../utils/helpers'

const CATEGORIES = ['All', 'Coffee', 'Tea', 'Food', 'Dessert', 'Drinks']
const EMOJI = { Coffee: '☕', Tea: '🍵', Food: '🍽️', Dessert: '🍰', Drinks: '🥤', All: '✨' }

export default function ProductList({ products }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const { addToCart, cart } = useOrder()

  const filtered = products
    .filter((p) => p.is_available)
    .filter((p) => activeCategory === 'All' || p.category === activeCategory)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))

  const cartQty = (id) => cart.find((i) => i.id === id)?.quantity || 0

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-9 py-2.5" placeholder="Search menu..." />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200
              ${activeCategory === cat
                ? 'bg-brand text-white shadow-glow-sm'
                : 'bg-surface-2 border border-surface-border text-gray-400 hover:border-gray-500 hover:text-gray-200'}`}>
            <span>{EMOJI[cat]}</span>
            {cat}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto flex-1 pb-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((product, i) => {
            const qty = cartQty(product.id)
            return (
              <motion.div key={product.id}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.03 }}
                className="glass-card p-3.5 hover:border-brand/30 hover:shadow-glow-sm cursor-pointer group transition-all duration-200"
                onClick={() => addToCart(product)}
              >
                <div className="text-3xl mb-2.5">{EMOJI[product.category] || '☕'}</div>
                <p className="font-semibold text-sm text-white mb-0.5 truncate">{product.name}</p>
                <p className="text-xs text-gray-500 mb-3">{product.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-brand font-bold text-sm">{formatCurrency(product.price)}</span>
                  <div className={`flex items-center gap-1.5 transition-all ${qty > 0 ? 'opacity-100' : ''}`}>
                    {qty > 0 && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="text-xs font-bold text-brand bg-brand/10 border border-brand/20 rounded-lg px-2 py-0.5">
                        {qty}
                      </motion.span>
                    )}
                    <div className="w-7 h-7 rounded-lg bg-brand/10 border border-brand/20 group-hover:bg-brand group-hover:border-brand flex items-center justify-center transition-all">
                      <Plus size={14} className="text-brand group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="col-span-3 flex flex-col items-center justify-center py-12 text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-sm">No items found</p>
          </div>
        )}
      </div>
    </div>
  )
}
