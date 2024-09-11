export interface ICartContext {
  cart: Record<number, Product>
  updateCart: (cart: Product, quantity: number) => void
  removeFromCart: (productId: number) => void
  totalQuantity: number
  totalCost: number
}
