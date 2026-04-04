import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, LogOut, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar({ title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="h-14 glass border-b border-surface-border/60 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <h2 className="font-semibold text-base text-white">{title}</h2>
      </div>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-surface-2 transition-all"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center text-white font-bold text-xs shadow-glow-sm">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm text-gray-300 hidden md:block">{user?.name}</span>
          <ChevronDown size={14} className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 w-48 glass-card py-1 z-50"
            >
              <div className="px-3 py-2 border-b border-surface-border/50 mb-1">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={() => { setOpen(false); logout(); navigate('/login') }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors rounded-lg mx-1"
                style={{ width: 'calc(100% - 8px)' }}
              >
                <LogOut size={14} />
                Sign out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
