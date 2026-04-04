import { motion } from 'framer-motion'

export default function Card({ children, className = '', animate = false, ...props }) {
  const Comp = animate ? motion.div : 'div'
  const animProps = animate ? { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } } : {}
  return (
    <Comp className={`glass-card p-5 ${className}`} {...animProps} {...props}>
      {children}
    </Comp>
  )
}
