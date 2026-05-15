"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { useAuth } from "@/lib/auth-context"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
      return
    }
    if (user) {
      setLoading(false)
    }
  }, [user, authLoading, router])

  if (authLoading || loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500 animate-pulse" />
          <p className="text-white/50">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Main Content */}
      <div className="md:pl-64">
        {/* Desktop Navbar - hidden on mobile */}
        <div className="hidden md:block">
          <Navbar user={{ name: user.email?.split("@")[0] || "User", email: user.email || "" }} />
        </div>

        {/* Page Content - with bottom padding for mobile nav */}
        <main className="p-4 md:p-6 pb-24 md:pb-6 pt-20 md:pt-6">
          {children}
        </main>
      </div>
    </div>
  )
}