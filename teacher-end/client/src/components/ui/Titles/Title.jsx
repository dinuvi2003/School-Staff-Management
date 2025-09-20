import React from 'react'

const Title = ( {children, className} ) => {
  return (
    <div>
        <h1 className={`font-bold text-4xl ${className}`}>{children}</h1>
    </div>
  )
}

export default Title