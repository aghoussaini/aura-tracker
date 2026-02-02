import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

const MotionDiv = motion.div

export const Card = forwardRef(function Card(
  { className, animate = true, ...props },
  ref
) {
  if (animate) {
    return (
      <MotionDiv
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={cn(
          'rounded-2xl border border-slate-200 bg-white p-6 shadow-soft',
          'transition-shadow duration-300 hover:shadow-card-hover',
          className
        )}
        {...props}
      />
    )
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-slate-200 bg-white p-6 shadow-soft',
        'transition-shadow duration-300 hover:shadow-card-hover',
        className
      )}
      {...props}
    />
  )
})

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn('mb-4 space-y-1.5', className)}
      {...props}
    />
  )
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn('text-xl font-semibold tracking-tight text-slate-900', className)}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn('text-sm text-slate-500', className)}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }) {
  return (
    <div
      className={cn('space-y-3', className)}
      {...props}
    />
  )
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn('mt-4 flex items-center pt-4 border-t border-slate-100', className)}
      {...props}
    />
  )
}
