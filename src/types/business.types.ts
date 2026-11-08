export interface Business {
  id: string
  name: string
  description?: string
  ownerId: string
  logo?: string
  verified: boolean
  createdAt: string
}

export interface Location {
  id: string
  businessId: string
  name: string
  address: string
  lat?: number
  lng?: number
}
