"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Bell, Search, LogOut, Settings, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"

interface NavbarProps {
  user: {
    name: string
    email: string
    avatar?: string
  }
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter()
  const { signOut } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = async () => {
    await signOut()
    router.push("/auth/login")
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-slate-900/80 backdrop-blur-xl px-4 sm:px-6"
    >
      {/* Search - hidden on very small screens */}
      <div className="hidden sm:flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            placeholder="Search customers..."
            className="w-full pl-10 bg-white/5"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <Bell className="h-5 w-5 text-white/60" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 sm:gap-3 rounded-lg px-2 py-1.5 hover:bg-white/5 transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-white/40">{user.email}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-white/40 hidden lg:block" />
          </button>

          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-slate-900 p-2 shadow-xl"
            >
              <button
                onClick={() => { router.push("/settings"); setShowDropdown(false) }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  )
}