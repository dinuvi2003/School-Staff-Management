'use client'

import { hookNow } from '@/hooks/hookNow'
import React from 'react'

const Time = () => {

    const now = hookNow()
  if (!now) return <div>--:--:--</div>

  // Manual deterministic time formatting (12-hour with am/pm)
  const pad = (n) => n.toString().padStart(2, '0')

  let hours = now.getHours()
  const minutes = pad(now.getMinutes())
  const seconds = pad(now.getSeconds())
  const ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  if (hours === 0) hours = 12

  const structuredTime = `${hours}:${minutes}:${seconds} ${ampm}`

  return (
    <div>
      <p>{structuredTime}</p>
    </div>
  )
}

export default Time
