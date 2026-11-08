export interface Product {
  id: string
  name: string
  description?: string
  price: number
  images: string[]
  categoryId: string
  businessId: string
  sku?: string
  barcode?: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  parentId?: string
  image?: string
}
