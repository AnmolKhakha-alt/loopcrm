"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  Bell,
  MessageSquare,
  Plus,
  ArrowRight,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Zap,
  TrendingUp,
  History,
  LayoutGrid
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCustomers } from "@/lib/hooks/use-customers"
import { useReminders } from "@/lib/hooks/use-reminders"
import { useActivities } from "@/lib/hooks/use-activities"
import { formatRelativeDate, getWhatsAppLink, cn } from "@/lib/utils"
import { OnboardingBanner } from "@/components/dashboard/onboarding-banner"
import { FollowupAlert } from "@/components/dashboard/followup-alert"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"

export default function DashboardPage() {
  const { profile, refreshProfile } = useAuth()
  const { customers, loading: customersLoading } = useCustomers()
  const { 
    reminders, 
    loading: remindersLoading, 
    getOverdueReminders, 
    updateReminder 
  } = useReminders()
  const { activities, loading: activitiesLoading } = useActivities(10)

  const [completingId, setCompletingId] = useState<string | null>(null)
  const [showOnboardingBanner, setShowOnboardingBanner] = useState(true)
  const [showFollowupAlert, setShowFollowupAlert] = useState(true)

  // Onboarding Progress
  const setupProgress = useMemo(() => {
    let steps = 0
    if (customers.length > 0) steps++
    if (reminders.length > 0) steps++
    if (activities.some(a => a.activity_type === "whatsapp")) steps++
    return steps
  }, [customers.length, reminders.length, activities])

  useEffect(() => {
    if (setupProgress === 3 && profile && !profile.onboarding_completed) {
      supabase.from("profiles").update({ onboarding_completed: true }).eq("id", profile.id)
        .then(() => refreshProfile())
    }
  }, [setupProgress, profile, refreshProfile])

  const overdueReminders = useMemo(() => getOverdueReminders(), [getOverdueReminders])
  const todayTasks = useMemo(() => {
    const today = new Date().toDateString()
    return reminders.filter(r => r.status === "pending" && new Date(r.reminder_date).toDateString() === today)
  }, [reminders])

  const handleComplete = async (id: string) => {
    setCompletingId(id)
    await updateReminder(id, { status: "completed" })
    setCompletingId(null)
  }

  if (customersLoading || remindersLoading || activitiesLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="relative">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse" />
        </div>
        <p className="text-sm font-medium text-slate-500 tracking-wide">Syncing your workspace...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 md:pb-16 px-4 md:px-8">
      {/* 1. GUIDED ONBOARDING (Banners) */}
      <AnimatePresence>
        {profile && !profile.onboarding_completed && showOnboardingBanner && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <OnboardingBanner progress={setupProgress} totalSteps={3} onDismiss={() => setShowOnboardingBanner(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CRITICAL ALERTS */}
      <AnimatePresence>
        {showFollowupAlert && (overdueReminders.length > 0 || todayTasks.length > 0) && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
            <FollowupAlert overdueReminders={overdueReminders} todayReminders={todayTasks} onDismiss={() => setShowFollowupAlert(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. HERO & QUICK ACTIONS */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-4">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-50 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-400 font-medium">Welcome back. Here is what needs your attention.</p>
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <Link href="/customers?new=true">
            <Button className="h-12 px-6 gap-2 bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-lg shadow-blue-600/10 whitespace-nowrap">
              <Plus className="h-4 w-4" />
              Add Customer
            </Button>
          </Link>
          <Link href="/reminders?new=true">
            <Button variant="outline" className="h-12 px-6 gap-2 border-white/5 bg-slate-900/50 hover:bg-slate-800 rounded-2xl text-slate-300 whitespace-nowrap">
              <Bell className="h-4 w-4 text-amber-400" />
              Set Reminder
            </Button>
          </Link>
          <Link href="/messages?new=true">
            <Button variant="outline" className="h-12 px-6 gap-2 border-white/5 bg-slate-900/50 hover:bg-slate-800 rounded-2xl text-slate-300 whitespace-nowrap">
              <MessageSquare className="h-4 w-4 text-green-400" />
              New Message
            </Button>
          </Link>
        </div>
      </section>

      {/* 4. MAIN DASHBOARD CONTENT */}
      <div className="grid lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: ACTIVE WORK (Col-8) */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Section: Urgent Actions */}
          <section id="overdue-section" className="space-y-6 scroll-mt-24">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-50">Urgent Follow-ups</h2>
              </div>
              <span className="text-xs font-bold text-red-400 uppercase tracking-widest">{overdueReminders.length} Overdue</span>
            </div>

            <div className="space-y-4">
              {overdueReminders.length === 0 ? (
                <Card className="bg-slate-900/40 border-dashed border-white/5 rounded-[2rem]">
                  <CardContent className="py-16 text-center space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-green-500/5 flex items-center justify-center mx-auto ring-1 ring-green-500/20">
                      <CheckCircle2 className="h-8 w-8 text-green-500/40" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-100 font-semibold text-lg">Inbox Zero</p>
                      <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">No overdue reminders. Your customer relationships are healthy!</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {overdueReminders.map((reminder) => (
                    <motion.div key={reminder.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                      <Card className="group bg-slate-900/80 border-white/5 rounded-3xl hover:bg-slate-900 transition-all hover:border-red-500/20 hover:shadow-2xl hover:shadow-red-500/5">
                        <CardContent className="p-6 space-y-5">
                          <div className="flex items-start justify-between">
                            <div className="min-w-0">
                              <h3 className="text-base font-bold text-slate-50 truncate group-hover:text-red-400 transition-colors">
                                {reminder.customer?.full_name}
                              </h3>
                              <p className="text-sm text-slate-400 line-clamp-1 mt-0.5">{reminder.title}</p>
                            </div>
                            <div className="px-2 py-1 rounded-md bg-red-500/10 text-[10px] font-black text-red-400 uppercase tracking-tighter shrink-0">
                              Overdue
                            </div>
                          </div>
                          <Button className="w-full bg-green-600 hover:bg-green-500 rounded-xl font-bold py-5 shadow-lg shadow-green-600/10" asChild>
                            <a href={getWhatsAppLink(reminder.customer?.phone || "", `Hi ${reminder.customer?.full_name}, just following up regarding ${reminder.title}.`)} target="_blank">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Contact via WhatsApp
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Section: Today's Tasks */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-50">Today&apos;s Focus</h2>
            </div>

            <div className="space-y-3">
              {todayTasks.length === 0 ? (
                <div className="p-12 text-center rounded-[2rem] bg-slate-900/40 border border-white/5 border-dashed space-y-4">
                  <Clock className="h-8 w-8 text-slate-600 mx-auto opacity-50" />
                  <p className="text-slate-500 text-sm font-medium">Nothing scheduled for today yet.</p>
                  <Link href="/reminders?new=true">
                    <Button variant="outline" size="sm" className="border-white/10 text-xs rounded-xl font-bold hover:bg-white/[0.03]">
                      Plan your day
                    </Button>
                  </Link>
                </div>
              ) : (
                todayTasks.map((reminder) => (
                  <Card key={reminder.id} className="bg-slate-900/50 border-white/5 rounded-2xl hover:bg-slate-900 transition-colors">
                    <CardContent className="p-5 flex items-center justify-between gap-6">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                          <Clock className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-slate-50 truncate">{reminder.customer?.full_name}</h3>
                          <p className="text-sm text-slate-400 truncate leading-relaxed">{reminder.title}</p>
                        </div>
                      </div>
                      <Button variant="ghost" className="text-slate-400 hover:text-green-400 hover:bg-green-500/5 font-bold rounded-xl" disabled={completingId === reminder.id} onClick={() => handleComplete(reminder.id)}>
                        {completingId === reminder.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mark Done"}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: ANALYTICS & RECENT (Col-4) */}
        <div className="lg:col-span-4 space-y-12">
          
          {/* Analytics Block */}
          <section className="space-y-6">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Overview</h2>
            <div className="grid gap-4">
              <Card className="bg-blue-600 border-none rounded-[2rem] overflow-hidden group">
                <CardContent className="p-8">
                  <Zap className="absolute -top-4 -right-4 h-24 w-24 text-white/10 -rotate-12 transition-transform group-hover:rotate-0" />
                  <div className="relative z-10 space-y-1">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-100/60">Registered Customers</p>
                    <p className="text-5xl font-bold text-white tracking-tighter">{customers.length}</p>
                    <div className="flex items-center gap-1.5 pt-4">
                      <TrendingUp className="h-3 w-3 text-blue-200" />
                      <span className="text-[10px] font-bold text-blue-100">Growing database</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-white/5 rounded-[2rem] p-8 space-y-1">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Success Rate</p>
                <p className="text-3xl font-bold text-slate-100">94.2%</p>
                <div className="h-1.5 w-full bg-white/5 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-blue-500 w-[94%]" />
                </div>
              </Card>
            </div>
          </section>

          {/* Activity Feed */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-1">
              <History className="h-4 w-4 text-slate-500" />
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Recent Events</h2>
            </div>

            <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
              {activities.length === 0 ? (
                <p className="text-sm text-slate-500 font-medium px-4">No activity logged yet.</p>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="flex gap-4 relative">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 shadow-xl",
                      activity.activity_type === "whatsapp" ? "bg-green-600 text-white" :
                      activity.activity_type === "created" ? "bg-blue-600 text-white" :
                      "bg-slate-800 text-slate-400"
                    )}>
                      {activity.activity_type === "whatsapp" ? <MessageSquare className="h-4 w-4" /> :
                       activity.activity_type === "created" ? <Users className="h-4 w-4" /> :
                       <History className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0 flex-1 py-1">
                      <p className="text-sm text-slate-300 leading-tight">
                        <span className="font-bold text-slate-100">{activity.customer?.full_name || "System"}</span>
                        {" "}{activity.message}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase">{formatRelativeDate(activity.created_at)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Minimal Empty State Help */}
          {customers.length === 0 && (
            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 shadow-2xl space-y-6">
              <div className="space-y-2">
                <h4 className="text-slate-100 font-bold">Quick Start Guide</h4>
                <p className="text-xs text-slate-500 leading-relaxed">LoopCRM is most effective when your database is active. Register your first customer to begin tracking.</p>
              </div>
              <Link href="/customers?new=true" className="block group">
                <Button className="w-full bg-slate-100 text-slate-950 hover:bg-white rounded-xl font-bold group-hover:scale-[1.02] transition-transform">
                  Register Now
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}