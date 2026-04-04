import { createContext, useContext, useState, useCallback } from 'react'

const OrderContext = createContext(null)

export function OrderProvider({ children }) {
  const [cart, setCart] = useState([])
  const [selectedTable, setSelectedTable] = useState(null)

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { ...product, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((i) => i.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId)
    setCart((prev) => prev.map((i) => i.id === productId ? { ...i, quantity } : i))
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setCart([])
    setSelectedTable(null)
  }, [])

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <OrderContext.Provider value={{ cart, selectedTable, setSelectedTable, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrder = () => useContext(OrderContext)
