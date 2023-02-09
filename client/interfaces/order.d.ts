import User from './user'

export default interface Order {
  _id: string
  user: User
  orderItems: {
    name: string
    qty: number
    image: string
    price: number
    product: string
  }[]
  shippingAddress: {
    address: string
    city: string
    postalCode: string
    country: string
  }
  paymentMethod: string
  paymentResult?: {
    id: string
    status: string
    update_time: string
    email_address: string
  }
  taxPrice: number
  shippingPrice: number
  totalPrice: number
  isPaid: boolean
  paidAt?: string
  isDelivered: boolean
  deliveredAt?: string
  createdAt: string
}
