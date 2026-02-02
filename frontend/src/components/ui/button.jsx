import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

const buttonVariants = {
  default: 'bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
  destructive: 'bg-aura-negative-500 text-white hover:bg-aura-negative-600 shadow-md',
  outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  success: 'bg-aura-positive-500 text-white hover:bg-aura-positive-600 shadow-md',
  link: 'text-primary-600 underline-offset-4 hover:underline',
}

const sizeVariants = {
  sm: 'h-8 px-3 text-sm rounded-lg',
  default: 'h-10 px-4 py-2 rounded-xl',
  lg: 'h-12 px-6 text-lg rounded-xl',
  icon: 'h-10 w-10 rounded-xl',
}

const MotionButton = motion.button

export const Button = forwardRef(function Button(
  {
    className,
    variant = 'default',
    size = 'default',
    asChild = false,
    isLoading = false,
    children,
    disabled,
    ...props
  },
  ref
) {
  const Comp = asChild ? Slot : MotionButton

  const motionProps = asChild ? {} : {
    whileHover: disabled || isLoading ? {} : { scale: 1.02 },
    whileTap: disabled || isLoading ? {} : { scale: 0.98 },
    transition: { type: 'spring', stiffness: 400, damping: 17 }
  }

  return (
    <Comp
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        buttonVariants[variant],
        sizeVariants[size],
        className
      )}
      disabled={disabled || isLoading}
      {...motionProps}
      {...props}
    >
      {isLoading && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}
      {children}
    </Comp>
  )
})
