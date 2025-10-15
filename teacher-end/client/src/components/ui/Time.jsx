'use client'

import { hookNow } from '@/hooks/hookNow'
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

    !now ? <div>--:--:--</div> :

      <div>
        <p>{structuredTime}</p>
      </div>
  )
}

export default Time