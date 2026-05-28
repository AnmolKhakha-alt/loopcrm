"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, X, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface OnboardingBannerProps {
  progress: number
  totalSteps: number
  onDismiss: () => void
}

export function OnboardingBanner({ progress, totalSteps, onDismiss }: OnboardingBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-600 to-indigo-600 p-6 shadow-2xl shadow-blue-500/10 mb-8"
      >
        {/* Background Sparkles */}
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="h-32 w-32 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h2 className="text-xl font-bold text-white flex items-center gap-3 justify-center md:justify-start">
              <div className="p-2 rounded-xl bg-white/10">
                <Sparkles className="h-5 w-5 text-blue-200" />
              </div>
              Ready to grow your business?
            </h2>
            <p className="text-blue-50/80 text-sm font-medium">
              Complete your initial setup to begin automating customer follow-ups.
            </p>
            
            {/* Progress Bar Inline */}
            <div className="mt-4 flex items-center gap-4">
              <div className="h-2 w-40 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress / totalSteps) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-black text-white uppercase tracking-[0.1em]">
                {progress}/{totalSteps} Completed
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              asChild
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 h-14 rounded-2xl shadow-xl shadow-black/5"
            >
              <Link href={progress === 0 ? "/customers?new=true" : progress === 1 ? "/reminders?new=true" : "/messages?new=true"}>
                {progress === 0 ? "Add First Customer" : progress === 1 ? "Create First Reminder" : "Send First Message"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
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