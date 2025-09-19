'use client'

import { hookNow } from '@/app/hooks/hookNow'
import React from 'react'

const Time = () => {

    const now = hookNow()

    const structuredTime = new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    }).format(now)
    
  return (
    <div>
        <p>{structuredTime}</p>
    </div>
  )
}

export default Time