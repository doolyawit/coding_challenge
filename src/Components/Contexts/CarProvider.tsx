import { createContext, useState } from 'react'
import { ICartContext } from '../../Types/Cart'
import { Product } from '../../Types/Product'

export const CartContext = createContext<ICartContext>({} as ICartContext)

export const CartContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Record<number, Product>>({})

  const updateCart = (product: Product, quantityChange: number) => {
    setCart(() => {
      return {
        ...cart,
        [product.id]: {
          ...product,
          quantity: quantityChange,
        },
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart }
      delete newCart[productId]
      return newCart
    })
  }

  const totalQuantity = Object.values(cart).reduce((acc, product) => acc + product.quantity, 0)

  const totalCost = Object.values(cart).reduce(
    (acc, product) => acc + product.price * product.quantity,
    0,
  )

  return (
    <CartContext.Provider
      value={{
        cart,
        updateCart,
        removeFromCart,
        totalQuantity,
        totalCost,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
