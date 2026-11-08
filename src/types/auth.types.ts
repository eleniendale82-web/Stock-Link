export type Role = 'owner' | 'manager' | 'seller' | 'customer' | 'delivery' | 'admin'

export interface AuthUser {
  id: string
  email: string
  phone?: string
  role: Role
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  phone: string
  password: string
}
