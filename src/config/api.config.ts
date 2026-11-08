export const API_BASE = '/api/v1'

export const ENDPOINTS = {
  AUTH: `${API_BASE}/auth`,
  USERS: `${API_BASE}/users`,
  BUSINESSES: `${API_BASE}/businesses`,
  PRODUCTS: `${API_BASE}/products`,
  CATEGORIES: `${API_BASE}/categories`,
  INVENTORY: `${API_BASE}/inventory`,
  ORDERS: `${API_BASE}/orders`,
  PAYMENTS: `${API_BASE}/payments`,
  DELIVERIES: `${API_BASE}/deliveries`,
  ANALYTICS: `${API_BASE}/analytics`,
  NOTIFICATIONS: `${API_BASE}/notifications`,
} as const
