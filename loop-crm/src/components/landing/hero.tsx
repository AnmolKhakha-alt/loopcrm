"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 150])
  const y2 = useTransform(scrollY, [0, 500], [0, -100])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px]" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-sm text-white/80">Trusted by 500+ local businesses</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              Turn One-Time Customers{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
                Into Repeat Customers
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-white/60 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              LoopCRM helps local businesses manage customers, automate follow-ups, and grow repeat sales using WhatsApp.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8">
                <Link href="/auth/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8">
                <Link href="/auth/login">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </Link>
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex items-center gap-8 justify-center lg:justify-start"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-slate-900" />
                ))}
              </div>
              <div className="text-left">
                <p className="text-white font-medium">4.9/5 rating</p>
                <p className="text-white/50 text-sm">from 200+ reviews</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Dashboard Preview */}
          <motion.div
            style={{ y: y1 }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Main Dashboard Mockup */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-amber-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {/* Mock Browser Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <div className="ml-4 px-3 py-1 rounded-full bg-slate-700/50 text-xs text-white/50">loopcrm.app/dashboard</div>
                </div>

                {/* Dashboard Content Preview */}
                <div className="p-4 space-y-4">
                  {/* Stats Row */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: "Customers", value: "247", color: "blue" },
                      { label: "Follow-ups", value: "38", color: "yellow" },
                      { label: "Messages", value: "523", color: "green" },
                      { label: "Revenue", value: "$4.2k", color: "purple" },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="p-3 rounded-xl bg-slate-800/50 border border-white/5"
                      >
                        <p className="text-lg font-bold text-white">{stat.value}</p>
                        <p className="text-xs text-white/40">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Activity Preview */}
                  <div className="space-y-2">
                    {[
                      { name: "Rajesh Kumar", action: "Sent follow-up", time: "2m ago", type: "whatsapp" },
                      { name: "Priya Sharma", action: "Added note", time: "15m ago", type: "note" },
                      { name: "Amit Patel", action: "Completed reminder", time: "1h ago", type: "reminder" },
                    ].map((activity, i) => (
                      <motion.div
                        key={activity.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/30"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === "whatsapp" ? "bg-green-500/20 text-green-400" :
                          activity.type === "note" ? "bg-blue-500/20 text-blue-400" :
                          "bg-purple-500/20 text-purple-400"
                        }`}>
                          {activity.type === "whatsapp" ? "W" : activity.type === "note" ? "N" : "R"}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white">{activity.name}</p>
                          <p className="text-xs text-white/40">{activity.action}</p>
                        </div>
                        <span className="text-xs text-white/30">{activity.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <motion.div
              style={{ y: y2 }}
              className="absolute -right-16 top-20"
            >
              <div className="p-4 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-400 text-lg">✓</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Reminder Sent</p>
                    <p className="text-white/50 text-sm">Rahul Verma → WhatsApp</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{ y: y2 }}
              className="absolute -left-8 bottom-20"
            >
              <div className="p-4 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 text-lg">+</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">New Customer</p>
                    <p className="text-white/50 text-sm">Sneha Gupta added</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-white/50"
          />
        </div>
      </motion.div>
    </section>
  )
}