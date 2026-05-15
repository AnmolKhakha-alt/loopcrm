"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  Bell,
  MessageSquare,
  Settings,
  BarChart3,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
]

const bottomNavItems = [
  { href: "/dashboard", label: "Home", icon: Home, activeIcon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users, activeIcon: Users },
  { href: "/reminders", label: "Reminders", icon: Bell, activeIcon: Bell },
  { href: "/messages", label: "Messages", icon: MessageSquare, activeIcon: MessageSquare },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-14 px-3 bg-slate-950/95 backdrop-blur-lg border-b border-white/5">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 -ml-1 rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors"
        >
          <Menu className="h-5 w-5 text-white" />
        </button>

        <Link href="/dashboard" className="flex items-center gap-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500 shadow-lg shadow-blue-500/20">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <span className="text-base font-bold text-white">LoopCRM</span>
        </Link>

        <div className="w-9" />
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] bg-slate-900 border-r border-white/10"
            >
              {/* Header */}
              <div className="flex items-center justify-between h-14 px-4 border-b border-white/10">
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-white">LoopCRM</span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/5"
                >
                  <X className="h-5 w-5 text-white/60" />
                </button>
              </div>

              {/* Nav Items */}
              <nav className="p-3 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                        isActive
                          ? "bg-blue-500/15 text-blue-400"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                      {isActive && (
                        <ChevronRight className="h-4 w-4 ml-auto text-blue-400" />
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
                <button
                  onClick={() => {
                    signOut()
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Nav - Improved Touch Targets */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-lg border-t border-white/5 safe-area-bottom">
        <nav className="flex items-center justify-around h-16 px-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full relative ${
                  isActive ? "text-blue-400" : "text-white/40"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavActive"
                    className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-blue-400"
                  />
                )}
                <div className={`p-1.5 rounded-lg ${isActive ? "bg-blue-500/10" : ""}`}>
                  {isActive ? (
                    <item.activeIcon className="h-5 w-5" />
                  ) : (
                    <item.icon className="h-5 w-5" />
                  )}
                </div>
                <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}