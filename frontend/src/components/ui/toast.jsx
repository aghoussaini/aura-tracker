import { createContext, useContext, useState } from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { clsx } from 'clsx'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  function addToast(toast) {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, ...toast }])
  }

  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map((t) => (
          <ToastPrimitive.Root
            key={t.id}
            duration={4000}
            open
            onOpenChange={(v) => {
              if (!v) removeToast(t.id)
            }}
            className={clsx(
              'relative flex items-start gap-2 rounded-lg border bg-gray-900 p-4 text-white shadow-lg',
              t.className,
            )}
          >
            <div className="space-y-1">
              {t.title && (
                <ToastPrimitive.Title className="text-sm font-semibold">
                  {t.title}
                </ToastPrimitive.Title>
              )}
              {t.description && (
                <ToastPrimitive.Description className="text-sm">
                  {t.description}
                </ToastPrimitive.Description>
              )}
            </div>
            <ToastPrimitive.Close className="ml-auto text-white focus:outline-none">
              ×
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  return useContext(ToastContext)
}
