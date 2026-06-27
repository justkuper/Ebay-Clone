import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ebay_clone_cart') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('ebay_clone_cart', JSON.stringify(items))
  }, [items])

  function addToCart(listing) {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === listing.id)
      if (exists) return prev
      return [...prev, { ...listing, cartQty: 1 }]
    })
  }

  function removeFromCart(id) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function updateQty(id, qty) {
    if (qty < 1) return removeFromCart(id)
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, cartQty: qty } : i)))
  }

  function clearCart() {
    setItems([])
  }

  const total = items.reduce((sum, i) => sum + (i.buyNowPrice || 0) * i.cartQty, 0)
  const itemCount = items.reduce((sum, i) => sum + i.cartQty, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
