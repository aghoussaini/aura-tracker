import { useEffect, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, useSpring, useTransform } from 'framer-motion'
import { cn } from '../../lib/cn'

export function CountUpNumber({
  value,
  duration = 1,
  className,
  prefix = '',
  suffix = '',
  showSign = false,
}) {
  const [displayValue, setDisplayValue] = useState(0)

  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30,
    duration: duration * 1000,
  })

  const display = useTransform(spring, (current) => {
    return Math.round(current)
  })

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  useEffect(() => {
    const unsubscribe = display.on('change', (latest) => {
      setDisplayValue(latest)
    })
    return () => unsubscribe()
  }, [display])

  const sign = showSign && displayValue > 0 ? '+' : ''

  return (
    <motion.span
      className={cn('tabular-nums', className)}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}{sign}{displayValue}{suffix}
    </motion.span>
  )
}
