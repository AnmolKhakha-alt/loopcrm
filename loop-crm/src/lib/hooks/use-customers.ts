"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "../supabase"
import { useAuth } from "../auth-context"

export interface Customer {
  id: string
  user_id: string
  full_name: string
  phone: string
  product_service: string | null
  notes: string | null
  last_contacted: string | null
  next_followup: string | null
  status: "active" | "pending" | "inactive"
  created_at: string
}

export function useCustomers() {
  const { user } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = useCallback(async () => {
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setCustomers(data || [])
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const addCustomer = async (customer: Omit<Customer, "id" | "user_id" | "created_at">) => {
    if (!user) return { error: new Error("Not authenticated") }

    const { data, error } = await supabase
      .from("customers")
      .insert({ ...customer, user_id: user.id })
      .select()
      .single()

    if (error) return { error }
    if (data) {
      setCustomers((prev) => [data, ...prev])
      // Log activity
      await supabase.from("activities").insert({
        user_id: user.id,
        customer_id: data.id,
        activity_type: "created",
        message: `Added new customer: ${data.full_name}`,
      })
    }
    return { error: null }
  }

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    const { error } = await supabase
      .from("customers")
      .update(updates)
      .eq("id", id)

    if (!error) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
      )
    }
    return { error }
  }

  const deleteCustomer = async (id: string) => {
    const { error } = await supabase.from("customers").delete().eq("id", id)

    if (!error) {
      setCustomers((prev) => prev.filter((c) => c.id !== id))
    }
    return { error }
  }

  const searchCustomers = (query: string) => {
    const q = query.toLowerCase()
    return customers.filter(
      (c) =>
        c.full_name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.product_service?.toLowerCase().includes(q)
    )
  }

  return {
    customers,
    loading,
    error,
    refresh: fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
  }
}