import { forwardRef } from 'react'
import { clsx } from 'clsx'

export const Input = forwardRef(function Input({ className, type = 'text', ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={clsx(
        'w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none',
        className
      )}
      {...props}
    />
  )
})
