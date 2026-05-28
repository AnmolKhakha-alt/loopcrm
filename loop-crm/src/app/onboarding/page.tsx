"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  UserPlus, 
  Bell, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight, 
  Loader2,
  ChevronRight,
  ChevronLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/lib/hooks/use-toast"

export default function OnboardingPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading, refreshProfile } = useAuth()
  const { addToast } = useToast()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Form State
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [reminderTitle, setReminderTitle] = useState("Follow-up call")
  const [reminderDate, setReminderDate] = useState("")
  
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/auth/login")
      } else if (profile?.onboarding_completed) {
        router.push("/dashboard")
      }
    }
  }, [user, profile, authLoading, router])

  const nextStep = () => setStep(s => Math.min(s + 1, 4))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const handleComplete = async () => {
    if (!user) return
    setLoading(true)

    try {
      // 1. Insert Customer
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .insert({
          user_id: user.id,
          full_name: customerName,
          phone: customerPhone,
          status: "active"
        })
        .select()
        .single()

      if (customerError) throw customerError

      // 2. Insert Reminder
      const { error: reminderError } = await supabase
        .from("reminders")
        .insert({
          user_id: user.id,
          customer_id: customer.id,
          title: reminderTitle,
          reminder_date: new Date(reminderDate).toISOString(),
          status: "pending"
        })

      if (reminderError) throw reminderError

      // 3. Log Activity
      await supabase.from("activities").insert({
        user_id: user.id,
        customer_id: customer.id,
        activity_type: "created",
        message: "Completed onboarding and added first customer"
      })

      // 4. Update Profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("id", user.id)

      if (profileError) throw profileError

      addToast({
        title: "Onboarding complete!",
        description: "Welcome to LoopCRM",
        variant: "success"
      })

      await refreshProfile()
      router.push("/dashboard")
    } catch (error: any) {
      addToast({
        title: "Something went wrong",
        description: error.message,
        variant: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  const openWhatsApp = () => {
    const message = encodeURIComponent(`Hi ${customerName}, just following up with you.`)
    const phone = customerPhone.replace(/\D/g, '')
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
    handleComplete()
  }

  if (authLoading || !user) return null

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Step {step} of 4</span>
            <span className="text-xs font-medium text-blue-400">{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-3">Welcome to LoopCRM!</h1>
                  <p className="text-white/60 mb-8">
                    Let&apos;s get you started with 3 quick steps to set up your first customer and automated reminder.
                  </p>
                  <Button onClick={nextStep} className="w-full bg-blue-500 hover:bg-blue-600 h-12">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <UserPlus className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Add a Customer</h2>
                      <p className="text-sm text-white/50">Who are we following up with?</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70">Full Name</label>
                      <Input 
                        placeholder="e.g. John Doe" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="bg-white/5 border-white/10 text-white h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70">Phone Number (with country code)</label>
                      <Input 
                        placeholder="e.g. +91 98765 43210" 
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="bg-white/5 border-white/10 text-white h-12"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <Button variant="ghost" onClick={prevStep} className="text-white/50 hover:text-white">
                      Back
                    </Button>
                    <Button 
                      onClick={nextStep} 
                      disabled={!customerName || !customerPhone}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 h-12"
                    >
                      Next Step
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <Bell className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Set a Reminder</h2>
                      <p className="text-sm text-white/50">When should we follow up?</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70">Reminder For</label>
                      <Input 
                        value={reminderTitle}
                        onChange={(e) => setReminderTitle(e.target.value)}
                        className="bg-white/5 border-white/10 text-white h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70">Date & Time</label>
                      <Input 
                        type="datetime-local"
                        value={reminderDate}
                        onChange={(e) => setReminderDate(e.target.value)}
                        className="bg-white/5 border-white/10 text-white h-12 [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <Button variant="ghost" onClick={prevStep} className="text-white/50 hover:text-white">
                      Back
                    </Button>
                    <Button 
                      onClick={nextStep} 
                      disabled={!reminderTitle || !reminderDate}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 h-12"
                    >
                      Next Step
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">WhatsApp Preview</h2>
                      <p className="text-sm text-white/50">Ready to send the first message?</p>
                    </div>
                  </div>

                  <div className="bg-slate-950/50 rounded-2xl p-6 border border-white/5 mb-8 relative">
                    <div className="absolute top-0 left-6 -translate-y-1/2 bg-blue-500 text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded text-white">
                      Preview
                    </div>
                    <p className="text-white/80 italic text-sm">
                      &quot;Hi {customerName || 'Customer'}, just following up with you.&quot;
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={openWhatsApp} 
                      disabled={loading}
                      className="w-full bg-green-600 hover:bg-green-700 h-12 text-white font-bold"
                    >
                      {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                        <>
                          Send on WhatsApp
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={handleComplete}
                      disabled={loading}
                      className="text-white/40 hover:text-white"
                    >
                      Skip and finish
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}