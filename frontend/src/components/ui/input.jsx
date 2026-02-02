import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

export const Input = forwardRef(function Input({ className, type = 'text', ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm',
        'shadow-sm transition-all duration-200',
        'placeholder:text-slate-400',
        'hover:border-slate-300',
        'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
        'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
        className
      )}
      {...props}
    />
  )
})
