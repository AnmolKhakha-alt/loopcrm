"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "../supabase"
import { useAuth } from "../auth-context"

export interface Reminder {
  id: string
  user_id: string
  customer_id: string
  title: string
  reminder_date: string
  status: "pending" | "completed" | "cancelled"
  created_at: string
  customer?: {
    full_name: string
    phone: string
  }
}

export function useReminders() {
  const { user } = useAuth()
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReminders = useCallback(async () => {
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase
      .from("reminders")
      .select("*, customer:customers(full_name, phone)")
      .eq("user_id", user.id)
      .order("reminder_date", { ascending: true })

    if (error) {
      setError(error.message)
    } else {
      setReminders(data || [])
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchReminders()
  }, [fetchReminders])

  const addReminder = async (reminder: Omit<Reminder, "id" | "user_id" | "created_at" | "customer">) => {
    if (!user) return { error: new Error("Not authenticated") }

    const { data, error } = await supabase
      .from("reminders")
      .insert({ ...reminder, user_id: user.id })
      .select("*, customer:customers(full_name, phone)")
      .single()

    if (error) return { error }
    if (data) {
      setReminders((prev) => [...prev, data].sort((a, b) =>
        new Date(a.reminder_date).getTime() - new Date(b.reminder_date).getTime()
      ))
    }
    return { error: null }
  }

  const updateReminder = async (id: string, updates: Partial<Reminder>) => {
    const { error } = await supabase
      .from("reminders")
      .update(updates)
      .eq("id", id)

    if (!error) {
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
      )
      // Log activity if completing reminder
      if (updates.status === "completed") {
        const reminder = reminders.find(r => r.id === id)
        if (reminder?.customer) {
          await supabase.from("activities").insert({
            user_id: user!.id,
            customer_id: reminder.customer_id,
            activity_type: "reminder_completed",
            message: `Completed reminder: ${reminder.title}`,
          })
        }
      }
    }
    return { error }
  }

  const deleteReminder = async (id: string) => {
    const { error } = await supabase.from("reminders").delete().eq("id", id)
    if (!error) {
      setReminders((prev) => prev.filter((r) => r.id !== id))
    }
    return { error }
  }

  const getUpcomingReminders = () => {
    const now = new Date()
    const threeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    return reminders.filter((r) => {
      const date = new Date(r.reminder_date)
      return r.status === "pending" && date >= now && date <= threeDays
    })
  }

  const getOverdueReminders = () => {
    const now = new Date()
    return reminders.filter((r) => {
      return r.status === "pending" && new Date(r.reminder_date) < now
    })
  }

  return {
    reminders,
    loading,
    error,
    refresh: fetchReminders,
    addReminder,
    updateReminder,
    deleteReminder,
    getUpcomingReminders,
    getOverdueReminders,
  }
}