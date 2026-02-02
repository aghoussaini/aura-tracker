import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '../../lib/cn'

export function Label({ className, ...props }) {
  return (
    <LabelPrimitive.Root
      className={cn(
        'text-sm font-medium text-slate-700',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  )
}
