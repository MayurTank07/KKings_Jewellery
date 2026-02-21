'use client'

import { forwardRef } from 'react'

const AdminCard = forwardRef(({ 
  children, 
  className = '', 
  padding = 'p-6',
  hover = false 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`
        bg-white rounded-lg shadow-sm
        ${padding}
        ${hover ? 'hover:shadow-md transition-shadow' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
})

AdminCard.displayName = 'AdminCard'

export default AdminCard
