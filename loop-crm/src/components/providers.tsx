"use client"

import { ReactNode } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { ToastContextProvider } from "@/lib/hooks/use-toast"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastContextProvider>
        {children}
      </ToastContextProvider>
    </AuthProvider>
  )
}