export interface Product {
  id: number
  name: string
  price: number
  currency: string
  quantity: number
}

export interface ProductsResponse {
  requestId: string
  products: Product[]
}

export interface ProductsCheckout {
  quantity: number
  product: Product
}

export interface Payment {
  requestId: string
  paymentInfo: {
    email: string
    cardInfo: {
      cardNo: string
      cardExpiryDate: string
      cardCVV: string
    }
  }
  products: PaymentProduct[]
}

export interface PaymentProduct {
  id: number
  quantity: number
}

export interface PaymentResponse {
  requestId: string
  result: {
    errorCode: string
    errorDesc: string
  }
  paymentInfo: {
    email: string
    cardInfo: {
      cardNo: string
      cardExpiryDate: string
      cardCVV: string
    }
  }
}
