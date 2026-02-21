'use client'

import { forwardRef } from 'react'
import { Link } from 'react-router-dom'

const AdminButton = forwardRef(({ 
  children, 
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-[#ae0b0b] hover:opacity-90 text-white focus:ring-[#ae0b0b]',
    secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-[#ae0b0b]',
    danger: 'bg-[#b91c1c] hover:opacity-90 text-white focus:ring-[#b91c1c]',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-[#ae0b0b]',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }
  
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  
  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${disabledClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  const content = (
    <>
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {Icon && !loading && <Icon className="h-4 w-4 mr-2" />}
      {children}
    </>
  )

  if (href && !disabled) {
    return (
      <Link
        ref={ref}
        to={href}
        className={classes}
        {...props}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {content}
    </button>
  )
})

AdminButton.displayName = 'AdminButton'

export default AdminButton
