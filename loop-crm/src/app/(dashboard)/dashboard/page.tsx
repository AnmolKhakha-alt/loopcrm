"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Users,
  Bell,
  MessageSquare,
  Phone,
  Clock,
  CheckCircle2,
  Plus,
  ArrowRight,
  Loader2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCustomers } from "@/lib/hooks/use-customers"
import { useReminders } from "@/lib/hooks/use-reminders"
import { useActivities } from "@/lib/hooks/use-activities"
import { formatRelativeDate } from "@/lib/utils"

export default function DashboardPage() {
  const [showAll, setShowAll] = useState(false)
  const { customers, loading: customersLoading } = useCustomers()
  const { reminders, loading: remindersLoading, getUpcomingReminders, getOverdueReminders } = useReminders()
  const { activities, loading: activitiesLoading } = useActivities(10)

  const upcomingReminders = useMemo(() => getUpcomingReminders().slice(0, 3), [getUpcomingReminders])
  const overdueReminders = useMemo(() => getOverdueReminders(), [getOverdueReminders])

  const stats = useMemo(() => {
    const contactedToday = activities.filter(a => {
      const today = new Date().toDateString()
      return new Date(a.created_at).toDateString() === today
    }).length

    return [
      { title: "Customers", value: customers.length, icon: Users, color: "blue" },
      { title: "Pending", value: reminders.filter(r => r.status === "pending").length, icon: Bell, color: "amber" },
      { title: "Today", value: contactedToday, icon: Phone, color: "green" },
    ]
  }, [customers.length, reminders, activities])

  if (customersLoading || remindersLoading || activitiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-4 -mt-2">
      {/* Compact Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
            <p className="text-xs text-white/50">Welcome back</p>
          </div>
        </div>

        {/* Quick Add - Full Width on Mobile */}
        <div className="grid grid-cols-3 gap-2">
          <Link href="/customers?new=true" className="col-span-1">
            <Button size="sm" className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Customer
            </Button>
          </Link>
          <Link href="/reminders?new=true" className="col-span-1">
            <Button size="sm" variant="outline" className="w-full h-10 text-xs border-white/20 text-white/80">
              <Bell className="h-3.5 w-3.5 mr-1" />
              Reminder
            </Button>
          </Link>
          <Link href="/messages?new=true" className="col-span-1">
            <Button size="sm" variant="outline" className="w-full h-10 text-xs border-white/20 text-white/80">
              <MessageSquare className="h-3.5 w-3.5 mr-1" />
              Message
            </Button>
          </Link>
        </div>
      </div>

      {/* Compact Stats - Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="shrink-0 w-24"
          >
            <Card className="bg-slate-900/50 border-white/5">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className={`h-3.5 w-3.5 text-${stat.color}-400`} />
                </div>
                <p className="text-xl font-bold text-white leading-none">{stat.value}</p>
                <p className="text-xs text-white/40 mt-1 truncate">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {/* Overdue Alert Card */}
        {overdueReminders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="shrink-0 w-24"
          >
            <Card className="bg-red-500/10 border-red-500/20">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-3.5 w-3.5 text-red-400" />
                </div>
                <p className="text-xl font-bold text-red-400 leading-none">{overdueReminders.length}</p>
                <p className="text-xs text-red-400/70 mt-1">Overdue</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Upcoming Reminders - Priority Content */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/80">Upcoming</h2>
          <Link href="/reminders" className="text-xs text-blue-400 flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {upcomingReminders.length === 0 ? (
          <Card className="bg-slate-900/50 border-white/5">
            <CardContent className="p-4 text-center">
              <Bell className="h-6 w-6 text-white/20 mx-auto mb-2" />
              <p className="text-sm text-white/40">No upcoming reminders</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {upcomingReminders.map((reminder, index) => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href="/reminders">
                  <Card className="bg-slate-900/50 border-white/5 hover:bg-white/5 transition-colors">
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        new Date(reminder.reminder_date) < new Date()
                          ? "bg-red-500/20 text-red-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}>
                        <Bell className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{reminder.title}</p>
                        <p className="text-xs text-white/40 truncate">
                          {reminder.customer?.full_name || "Unknown"} • {
                            new Date(reminder.reminder_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          }
                        </p>
                      </div>
                      <Button size="sm" variant="ghost" className="h-8 px-2 text-green-400 hover:text-green-300">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity - Compact */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/80">Recent</h2>
          <button onClick={() => setShowAll(!showAll)} className="text-xs text-blue-400">
            {showAll ? "Less" : "More"}
          </button>
        </div>

        {activities.length === 0 ? (
          <Card className="bg-slate-900/50 border-white/5">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-white/20 mx-auto mb-2" />
              <p className="text-sm text-white/40">No recent activity</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-1.5">
            {(showAll ? activities : activities.slice(0, 4)).map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900/30"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  activity.activity_type === "whatsapp" ? "bg-green-500/20 text-green-400" :
                  activity.activity_type === "call" ? "bg-blue-500/20 text-blue-400" :
                  activity.activity_type === "created" ? "bg-purple-500/20 text-purple-400" :
                  "bg-slate-700 text-white/60"
                }`}>
                  {activity.activity_type === "whatsapp" ? <MessageSquare className="h-3.5 w-3.5" /> :
                   activity.activity_type === "call" ? <Phone className="h-3.5 w-3.5" /> :
                   activity.activity_type === "created" ? <Users className="h-3.5 w-3.5" /> :
                   <Clock className="h-3.5 w-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{activity.customer?.full_name || "System"}</p>
                  <p className="text-xs text-white/40 truncate">{activity.message}</p>
                </div>
                <span className="text-xs text-white/30 shrink-0">{formatRelativeDate(activity.created_at)}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Customers Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/80">Customers</h2>
          <Link href="/customers" className="text-xs text-blue-400 flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {customers.slice(0, 4).map((customer, index) => (
            <Link key={customer.id} href="/customers">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-xl bg-slate-900/50 border border-white/5 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-medium">
                    {customer.full_name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{customer.full_name}</p>
                    <p className="text-xs text-white/40 truncate">{customer.phone}</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}