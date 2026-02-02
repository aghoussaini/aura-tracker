import { forwardRef } from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

const sizeVariants = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

const colorPalette = [
  'bg-primary-500',
  'bg-lavender-500',
  'bg-coral-500',
  'bg-mint-500',
  'bg-sunshine-500',
  'bg-aura-positive-500',
  'bg-peach-500',
]

function getColorFromUsername(username) {
  if (!username) return colorPalette[0]
  let hash = 0
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colorPalette[Math.abs(hash) % colorPalette.length]
}

function getInitials(firstName, lastName, username) {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }
  if (firstName) {
    return firstName.slice(0, 2).toUpperCase()
  }
  if (username) {
    return username.slice(0, 2).toUpperCase()
  }
  return '??'
}

const MotionRoot = motion(AvatarPrimitive.Root)

export const Avatar = forwardRef(function Avatar(
  {
    className,
    size = 'md',
    username,
    firstName,
    lastName,
    src,
    withRing = false,
    ...props
  },
  ref
) {
  const initials = getInitials(firstName, lastName, username)
  const bgColor = getColorFromUsername(username)

  return (
    <MotionRoot
      ref={ref}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full',
        sizeVariants[size],
        withRing && 'ring-2 ring-white ring-offset-2 ring-offset-slate-100',
        className
      )}
      {...props}
    >
      <AvatarPrimitive.Image
        src={src}
        alt={`${firstName || username}'s avatar`}
        className="aspect-square h-full w-full object-cover"
      />
      <AvatarPrimitive.Fallback
        className={cn(
          'flex h-full w-full items-center justify-center font-semibold text-white',
          bgColor
        )}
        delayMs={0}
      >
        {initials}
      </AvatarPrimitive.Fallback>
    </MotionRoot>
  )
})

export function AvatarGroup({ children, max = 4, className }) {
  const childArray = Array.isArray(children) ? children : [children]
  const visibleChildren = childArray.slice(0, max)
  const remainingCount = childArray.length - max

  return (
    <div className={cn('flex -space-x-3', className)}>
      {visibleChildren}
      {remainingCount > 0 && (
        <div className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-600',
          'ring-2 ring-white'
        )}>
          +{remainingCount}
        </div>
      )}
    </div>
  )
}
