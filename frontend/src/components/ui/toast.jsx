import { createContext, useContext, useState, useEffect, useCallback } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '../../lib/cn'

const ToastContext = createContext()

const variants = {
  default: {
    bg: 'bg-white border-slate-200',
    icon: null,
  },
  success: {
    bg: 'bg-aura-positive-50 border-aura-positive-200',
    icon: CheckCircle,
    iconClass: 'text-aura-positive-500',
  },
  error: {
    bg: 'bg-aura-negative-50 border-aura-negative-200',
    icon: XCircle,
    iconClass: 'text-aura-negative-500',
  },
  info: {
    bg: 'bg-primary-50 border-primary-200',
    icon: Info,
    iconClass: 'text-primary-500',
  },
  warning: {
    bg: 'bg-sunshine-50 border-sunshine-200',
    icon: AlertCircle,
    iconClass: 'text-sunshine-500',
  },
}

function Toast({ toast, onRemove }) {
  const variantConfig = variants[toast.variant] || variants.default
  const Icon = variantConfig.icon
  const duration = toast.duration || 4000

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, duration)

    return () => clearTimeout(timer)
  }, [toast.id, duration, onRemove])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn(
        'relative flex items-start gap-3 rounded-xl border p-4 shadow-lg pointer-events-auto',
        variantConfig.bg,
        toast.className
      )}
    >
      {Icon && (
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', variantConfig.iconClass)} />
      )}
      <div className="flex-1 space-y-1">
        {toast.title && (
          <p className="text-sm font-semibold text-slate-900">
            {toast.title}
          </p>
        )}
        {toast.description && (
          <p className="text-sm text-slate-600">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-slate-400 hover:text-slate-600 transition-colors p-1 -m-1 rounded-lg hover:bg-slate-100"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random()
    const variant = toast.variant || 'default'
    setToasts((prev) => [...prev, { id, variant, ...toast }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 w-96 max-w-[calc(100vw-2rem)] pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <Toast key={t.id} toast={t} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  return useContext(ToastContext)
}
