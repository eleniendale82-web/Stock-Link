'use client'

import { useEffect, useState } from 'react'

export function useNotifications() {
  const [notifications, setNotifications] = useState<unknown[]>([])

  useEffect(() => {
    // Subscribe to notifications
  }, [])

  return { notifications }
}
