"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
  Plus,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn, formatDate } from "@/lib/utils"
import { useReminders, Reminder } from "@/lib/hooks/use-reminders"
import { useCustomers } from "@/lib/hooks/use-customers"
import { useToast } from "@/lib/hooks/use-toast"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function RemindersPage() {
  const { reminders, loading, addReminder, updateReminder, deleteReminder } = useReminders()
  const { customers } = useCustomers()
  const { addToast } = useToast()
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [newReminder, setNewReminder] = useState({
    customer_id: "",
    title: "",
    reminder_date: "",
  })

  const { groupedReminders, overdueCount, todayCount, upcomingCount } = useMemo(() => {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)

    const pending = reminders.filter(r => r.status === "pending")
    const completed = reminders.filter(r => r.status === "completed")

    const overdue = pending.filter(r => new Date(r.reminder_date) < now)
    const todayReminders = pending.filter(r => {
      const d = new Date(r.reminder_date)
      return d >= now && d < tomorrowStart
    })
    const upcoming = pending.filter(r => new Date(r.reminder_date) >= tomorrowStart)

    return {
      groupedReminders: {
        overdue,
        today: todayReminders,
        upcoming,
        completed,
      },
      overdueCount: overdue.length,
      todayCount: todayReminders.length,
      upcomingCount: upcoming.length,
    }
  }, [reminders])

  const filteredReminders = useMemo(() => {
    if (filter === "pending") return reminders.filter(r => r.status === "pending")
    if (filter === "completed") return reminders.filter(r => r.status === "completed")
    return reminders
  }, [reminders, filter])

  const handleComplete = async (id: string) => {
    const { error } = await updateReminder(id, { status: "completed" })
    if (error) {
      addToast({ title: "Failed to complete reminder", variant: "error" })
    } else {
      addToast({ title: "Reminder completed!", variant: "success" })
    }
  }

  const handleAddReminder = async () => {
    if (!newReminder.customer_id || !newReminder.title || !newReminder.reminder_date) {
      addToast({ title: "Please fill all required fields", variant: "error" })
      return
    }

    const { error } = await addReminder({
      customer_id: newReminder.customer_id,
      title: newReminder.title,
      reminder_date: new Date(newReminder.reminder_date).toISOString(),
      status: "pending",
    })

    if (error) {
      addToast({ title: "Failed to add reminder", description: error.message, variant: "error" })
    } else {
      addToast({ title: "Reminder added!", variant: "success" })
      setShowAddModal(false)
      setNewReminder({ customer_id: "", title: "", reminder_date: "" })
    }
  }

  const getStatusIcon = (reminder: Reminder) => {
    const date = new Date(reminder.reminder_date)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

    if (reminder.status === "completed") return <CheckCircle2 className="h-5 w-5 text-green-400" />
    if (date < now) return <AlertTriangle className="h-5 w-5 text-red-400" />
    if (date >= now && date < tomorrow) return <Clock className="h-5 w-5 text-yellow-400" />
    return <Bell className="h-5 w-5 text-blue-400" />
  }

  const getStatusColor = (reminder: Reminder) => {
    const date = new Date(reminder.reminder_date)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

    if (reminder.status === "completed") return "border-green-500/30 bg-green-500/10"
    if (date < now) return "border-red-500/30 bg-red-500/10"
    if (date >= now && date < tomorrow) return "border-yellow-500/30 bg-yellow-500/10"
    return "border-blue-500/30 bg-blue-500/10"
  }

  const getStatusBadge = (reminder: Reminder) => {
    const date = new Date(reminder.reminder_date)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

    if (reminder.status === "completed") return <Badge className="bg-green-500/20 text-green-400">Completed</Badge>
    if (date < now) return <Badge variant="destructive">Overdue</Badge>
    if (date >= now && date < tomorrow) return <Badge variant="warning">Today</Badge>
    return <Badge>Upcoming</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Reminders</h1>
          <p className="text-white/50 mt-1">Track and manage follow-up reminders</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{overdueCount}</p>
            <p className="text-sm text-white/50">Overdue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">{todayCount}</p>
            <p className="text-sm text-white/50">Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{upcomingCount}</p>
            <p className="text-sm text-white/50">Upcoming</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "pending", "completed"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredReminders.map((reminder, index) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={cn("border-l-4", getStatusColor(reminder))}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-white/5">
                        {getStatusIcon(reminder)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{reminder.title}</h3>
                        <p className="text-sm text-white/50">{reminder.customer?.full_name || "Unknown"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        {getStatusBadge(reminder)}
                        <p className="text-sm text-white/40 mt-1">
                          {new Date(reminder.reminder_date).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {reminder.status === "pending" && (
                        <div className="flex gap-2">
                          {reminder.customer && (
                            <WhatsAppButton
                              phone={reminder.customer.phone}
                              customerName={reminder.customer.full_name}
                              product={undefined}
                              showLabel
                            />
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleComplete(reminder.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Done
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredReminders.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">No reminders found</p>
            {filter !== "all" && (
              <Button variant="link" onClick={() => setFilter("all")}>
                Show all reminders
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add Reminder Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Reminder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Customer *</label>
              <select
                className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-white/10 text-white"
                value={newReminder.customer_id}
                onChange={(e) => setNewReminder({ ...newReminder, customer_id: e.target.value })}
              >
                <option value="">Select customer</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.full_name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Title *</label>
              <Input
                placeholder="Follow-up, payment, etc."
                value={newReminder.title}
                onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Date & Time *</label>
              <Input
                type="datetime-local"
                value={newReminder.reminder_date}
                onChange={(e) => setNewReminder({ ...newReminder, reminder_date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddReminder}>Add Reminder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}