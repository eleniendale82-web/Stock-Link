export interface InventoryItem {
  id: string
  productId: string
  locationId: string
  quantity: number
  minStock?: number
  maxStock?: number
  updatedAt: string
}

export interface StockMovement {
  id: string
  productId: string
  fromLocationId?: string
  toLocationId?: string
  quantity: number
  type: 'transfer' | 'adjustment' | 'purchase' | 'sale' | 'return'
  reason?: string
  createdAt: string
}
