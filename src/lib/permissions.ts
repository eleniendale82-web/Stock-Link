export type Role = 'owner' | 'manager' | 'seller' | 'customer' | 'delivery' | 'admin'

export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  const hierarchy: Role[] = ['customer', 'delivery', 'seller', 'manager', 'owner', 'admin']
  return hierarchy.indexOf(userRole) >= hierarchy.indexOf(requiredRole)
}
