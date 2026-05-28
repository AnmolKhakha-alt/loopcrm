"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X, ArrowRight, BellRing } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reminder } from "@/lib/hooks/use-reminders"

interface FollowupAlertProps {
  overdueReminders: Reminder[]
  todayReminders: Reminder[]
  onDismiss: () => void
}

export function FollowupAlert({ overdueReminders, todayReminders, onDismiss }: FollowupAlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  const totalTasks = overdueReminders.length + todayReminders.length
  
  const topCustomers = useMemo(() => {
    const all = [...overdueReminders, ...todayReminders]
    const uniqueNames = new Set<string>()
    const result: string[] = []
    
    for (const r of all) {
      if (r.customer?.full_name && !uniqueNames.has(r.customer.full_name)) {
        uniqueNames.add(r.customer.full_name)
        result.push(r.customer.full_name)
      }
      if (result.length >= 3) break
    }
    return result
  }, [overdueReminders, todayReminders])

  if (!isVisible || totalTasks === 0) return null

  const handleFixNow = () => {
    const element = document.getElementById('overdue-section')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-red-600 via-rose-600 to-orange-600 p-1 shadow-2xl shadow-red-500/10 mb-8"
      >
        <div className="relative bg-slate-950/20 backdrop-blur-xl rounded-[2.2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6 flex-1 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 animate-bounce">
              <BellRing className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-3 justify-center md:justify-start">
                Urgent Follow-up Alert
                <span className="bg-white/20 text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-full tracking-wider">
                  Critical
                </span>
              </h3>
              <p className="text-rose-50/90 text-sm mt-1 font-medium">
                You have <span className="font-bold text-white underline underline-offset-4">{totalTasks} priority tasks</span> for 
                <span className="text-white font-bold ml-1">
                  {topCustomers.join(", ")}
                  {totalTasks > 3 && ` + ${totalTasks - 3} others`}
                </span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <Button 
              onClick={handleFixNow}
              className="flex-1 md:flex-none bg-white text-rose-600 hover:bg-rose-50 font-bold px-10 h-14 rounded-2xl shadow-xl shadow-black/10 transition-transform active:scale-95"
            >
              Take Action
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <button 
              onClick={() => {
                setIsVisible(false)
                onDismiss()
              }}
              className="p-3 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}