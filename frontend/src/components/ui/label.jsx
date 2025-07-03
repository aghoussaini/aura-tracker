import * as LabelPrimitive from '@radix-ui/react-label'
import { clsx } from 'clsx'

export function Label({ className, ...props }) {
  return <LabelPrimitive.Root className={clsx('text-sm font-medium', className)} {...props} />
}
