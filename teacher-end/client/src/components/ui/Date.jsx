'use client'

import { hookNow } from '@/app/hooks/hookNow'
import React from 'react'

const Date = () => {

    const now = hookNow()

    const structuredDate = new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(now)

  return (
    <div>
        <p>{structuredDate}</p>
    </div>
  )
}

export default Date