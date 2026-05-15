"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Building, Bell, MessageSquare, Save, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "business", label: "Business", icon: Building },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    name: "Demo User",
    email: "demo@loopcrm.com",
    phone: "+91 98765 43210",
    avatar: "",
  })
  const [business, setBusiness] = useState({
    name: "My Business",
    address: "123 Main Street, City",
    timezone: "Asia/Kolkata",
    currency: "INR",
  })
  const [notifications, setNotifications] = useState({
    emailReminders: true,
    pushNotifications: true,
    dailyDigest: false,
    weeklyReport: true,
  })
  const [whatsapp, setWhatsapp] = useState({
    defaultMessage: "Hi {name}, just checking in regarding your recent {product} purchase.",
    businessPhone: "+91 98765 43210",
    quickReplies: [
      "Thanks for reaching out!",
      "I'll call you shortly.",
      "Yes, I'm interested!",
      "Let me think about it.",
    ],
  })

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-white/50 mt-1">Manage your account and preferences</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabs */}
        <div className="md:w-64 shrink-0">
          <Card>
            <CardContent className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-20 w-20 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-2xl font-bold">
                      {profile.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70">Full Name</label>
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70">Email</label>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-white/70">Phone</label>
                      <Input
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "business" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Business Settings</CardTitle>
                  <CardDescription>Configure your business details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Business Name</label>
                    <Input
                      value={business.name}
                      onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Address</label>
                    <Input
                      value={business.address}
                      onChange={(e) => setBusiness({ ...business, address: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70">Timezone</label>
                      <Input
                        value={business.timezone}
                        onChange={(e) => setBusiness({ ...business, timezone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70">Currency</label>
                      <Input
                        value={business.currency}
                        onChange={(e) => setBusiness({ ...business, currency: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: "emailReminders", label: "Email Reminders", desc: "Receive follow-up reminders via email" },
                    { key: "pushNotifications", label: "Push Notifications", desc: "Get browser notifications for urgent tasks" },
                    { key: "dailyDigest", label: "Daily Digest", desc: "Summary of daily activities" },
                    { key: "weeklyReport", label: "Weekly Report", desc: "Performance report every week" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                      <div>
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-sm text-white/50">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications[item.key as keyof typeof notifications] ? "bg-blue-500" : "bg-slate-700"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          notifications[item.key as keyof typeof notifications] ? "translate-x-6" : "translate-x-0.5"
                        }`} />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "whatsapp" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>WhatsApp Settings</CardTitle>
                  <CardDescription>Configure WhatsApp integration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Business Phone</label>
                    <Input
                      value={whatsapp.businessPhone}
                      onChange={(e) => setWhatsapp({ ...whatsapp, businessPhone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Default Message Template</label>
                    <textarea
                      className="w-full h-24 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={whatsapp.defaultMessage}
                      onChange={(e) => setWhatsapp({ ...whatsapp, defaultMessage: e.target.value })}
                      placeholder="Hi {name}, ..."
                    />
                    <p className="text-xs text-white/40">Use {'{name}'} and {'{product}'} for personalization</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Quick Replies</label>
                    <div className="space-y-2">
                      {whatsapp.quickReplies.map((reply, index) => (
                        <Input
                          key={index}
                          value={reply}
                          onChange={(e) => {
                            const newReplies = [...whatsapp.quickReplies]
                            newReplies[index] = e.target.value
                            setWhatsapp({ ...whatsapp, quickReplies: newReplies })
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}