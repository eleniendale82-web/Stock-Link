export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface Order {
  id: string
  customerId: string
  businessId: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  createdAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
}
