'use client'
import { useEffect, useState } from "react"

export const hookNow =  (ticks = 1000) => {
    // initialize with a Date so the client and server have a value on first render
    const [now, setNow] = useState(() => new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date())
        }, ticks);

        return () => clearInterval(interval)
    }, [ticks])

    return now
}