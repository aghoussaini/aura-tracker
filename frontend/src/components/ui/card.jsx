import { clsx } from 'clsx'

export function Card({ className, ...props }) {
  return <div className={clsx('rounded-lg border bg-white p-4 shadow', className)} {...props} />
}

export function CardHeader({ className, ...props }) {
  return <div className={clsx('mb-4 space-y-1', className)} {...props} />
}

export function CardTitle({ className, ...props }) {
  return <h3 className={clsx('text-lg font-semibold', className)} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={clsx('space-y-2', className)} {...props} />
}
