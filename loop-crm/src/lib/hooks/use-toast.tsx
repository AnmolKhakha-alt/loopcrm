"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast"
import { ToastProvider, ToastViewport } from "@/components/ui/toast"

interface ToastItem {
  id: string
  title: string
  description?: string
  variant?: "default" | "success" | "error" | "warning"
}

interface ToastContextType {
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastContextProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])

    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastProvider>
      <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
        {children}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            className={
              toast.variant === "error"
                ? "border-red-500/30 bg-red-500/10"
                : toast.variant === "success"
                ? "border-green-500/30 bg-green-500/10"
                : toast.variant === "warning"
                ? "border-yellow-500/30 bg-yellow-500/10"
                : "border-white/10 bg-slate-900"
            }
          >
            <ToastTitle>{toast.title}</ToastTitle>
            {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
          </Toast>
        ))}
        <ToastViewport />
      </ToastContext.Provider>
    </ToastProvider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastContextProvider")
  }
  return context
}