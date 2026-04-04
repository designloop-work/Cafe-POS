import { motion } from 'framer-motion'

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 font-medium rounded-xl px-5 py-2.5 transition-all duration-200',
  ghost: 'btn-ghost',
}

export default function Button({ children, variant = 'primary', className = '', disabled, loading, ...props }) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`inline-flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </motion.button>
  )
}
