export const ROLES = {
  OWNER: 'owner',
  MANAGER: 'manager',
  SELLER: 'seller',
  CUSTOMER: 'customer',
  DELIVERY: 'delivery',
  ADMIN: 'admin',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_REDIRECTS: Record<Role, string> = {
  owner: '/owner',
  manager: '/manager',
  seller: '/seller',
  customer: '/customer',
  delivery: '/delivery',
  admin: '/admin',
}
