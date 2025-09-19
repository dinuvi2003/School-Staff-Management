'use client'
import { useEffect, useState } from "react"

export const hookNow =  (ticks = 1000) => {
    const [now, setNow] = useState()

    useEffect(() => {

        const interval = setInterval(() => {
            setNow(new Date())
        }, ticks);

        return () => clearInterval(interval)
        
    }, [ticks])

    return now
}