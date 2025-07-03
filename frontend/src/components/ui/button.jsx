import { Slot } from '@radix-ui/react-slot'
import { clsx } from 'clsx'

export function Button({ className, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={clsx(
        'inline-flex items-center justify-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600',
        className
      )}
      {...props}
    />
  )
}
