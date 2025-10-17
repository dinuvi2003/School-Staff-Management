'use client'

import { hookNow } from '@/app/hooks/hookNow'
import React from 'react'

// Manual, deterministic formatting to avoid Intl differences between server & client.
const Date = () => {
  const now = hookNow() || new Date()

  const day = now.getDate()
  const year = now.getFullYear()
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const month = monthNames[now.getMonth()]

  const structuredDate = `${day} ${month} ${year}`

  return (
    <div>
      <p>{structuredDate}</p>
    </div>
  )
}

export default Date