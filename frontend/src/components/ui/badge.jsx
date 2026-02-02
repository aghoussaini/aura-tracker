import { cn } from '../../lib/cn'

const variants = {
  default: 'bg-slate-100 text-slate-800 border-slate-200',
  primary: 'bg-primary-100 text-primary-700 border-primary-200',
  success: 'bg-aura-positive-100 text-aura-positive-700 border-aura-positive-200',
  error: 'bg-aura-negative-100 text-aura-negative-700 border-aura-negative-200',
  warning: 'bg-sunshine-100 text-sunshine-700 border-sunshine-200',
  info: 'bg-primary-100 text-primary-700 border-primary-200',
  gold: 'bg-gradient-to-r from-yellow-200 to-yellow-400 text-yellow-900 border-yellow-300',
  silver: 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700 border-slate-400',
  bronze: 'bg-gradient-to-r from-orange-200 to-orange-300 text-orange-800 border-orange-400',
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  default: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

export function Badge({
  children,
  variant = 'default',
  size = 'default',
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        'transition-colors duration-200',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
