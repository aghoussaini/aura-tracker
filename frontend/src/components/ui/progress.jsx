import { forwardRef } from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

const MotionIndicator = motion(ProgressPrimitive.Indicator)

export const Progress = forwardRef(function Progress(
  { className, value = 0, variant = 'default', showValue = false, ...props },
  ref
) {
  const variants = {
    default: 'bg-primary-500',
    success: 'bg-aura-positive-500',
    error: 'bg-aura-negative-500',
    warning: 'bg-sunshine-500',
  }

  return (
    <div className="w-full">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          'relative h-2 w-full overflow-hidden rounded-full bg-slate-100',
          className
        )}
        {...props}
      >
        <MotionIndicator
          className={cn('h-full rounded-full', variants[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </ProgressPrimitive.Root>
      {showValue && (
        <div className="mt-1 text-right text-xs text-slate-500">
          {Math.round(value)}%
        </div>
      )}
    </div>
  )
})
