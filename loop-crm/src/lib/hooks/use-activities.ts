"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "../supabase"
import { useAuth } from "../auth-context"

export interface Activity {
  id: string
  user_id: string
  customer_id: string | null
  activity_type: "whatsapp" | "call" | "note" | "visit" | "created" | "reminder_completed"
  message: string
  created_at: string
  customer?: {
    full_name: string
  }
}

export function useActivities(limit = 20) {
  const { user } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = useCallback(async () => {
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase
      .from("activities")
      .select("*, customer:customers(full_name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      setError(error.message)
    } else {
      setActivities(data || [])
    }
    setLoading(false)
  }, [user, limit])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  const logActivity = async (
    customerId: string | null,
    type: Activity["activity_type"],
    message: string
  ) => {
    if (!user) return { error: new Error("Not authenticated") }

    const { error } = await supabase.from("activities").insert({
      user_id: user.id,
      customer_id: customerId,
      activity_type: type,
      message,
    })

    if (!error) {
      fetchActivities()
    }
    return { error }
  }

  return {
    activities,
    loading,
    error,
    refresh: fetchActivities,
    logActivity,
  }
}