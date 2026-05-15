"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Sparkles, Send, Zap, Search, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MESSAGE_TEMPLATES, generateWhatsAppLink, fillTemplate, generateAIMessage } from "@/lib/whatsapp"
import { useCustomers, Customer } from "@/lib/hooks/use-customers"
import { useActivities } from "@/lib/hooks/use-activities"

export default function MessagesPage() {
  const { customers, loading: customersLoading } = useCustomers()
  const { activities } = useActivities()
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [message, setMessage] = useState("")
  const [aiGenerating, setAiGenerating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCustomers = customers.filter(c =>
    c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  )

  const handleTemplateSelect = (templateId: string) => {
    const template = MESSAGE_TEMPLATES.find(t => t.id === templateId)
    if (template && selectedCustomer) {
      setMessage(fillTemplate(template, selectedCustomer.full_name, selectedCustomer.product_service || undefined))
    }
  }

  const handleGenerateAI = () => {
    if (!selectedCustomer) return
    setAiGenerating(true)
    setTimeout(() => {
      const intents: Array<"followup" | "reminder" | "checkin"> = ["followup", "reminder", "checkin"]
      const randomIntent = intents[Math.floor(Math.random() * intents.length)]
      setMessage(generateAIMessage(selectedCustomer.full_name, selectedCustomer.product_service || undefined, randomIntent))
      setAiGenerating(false)
    }, 1000)
  }

  const handleSend = () => {
    if (!selectedCustomer || !message) return
    const link = generateWhatsAppLink(selectedCustomer.phone, message)
    window.open(link, "_blank")
  }

  // Calculate stats from activities
  const thisMonthActivities = activities.filter(a => {
    const activityDate = new Date(a.created_at)
    const now = new Date()
    return activityDate.getMonth() === now.getMonth() && activityDate.getFullYear() === now.getFullYear()
  })

  const messagesSentThisMonth = thisMonthActivities.filter(a => a.activity_type === "whatsapp").length

  if (customersLoading) {
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
      >
        <h1 className="text-3xl font-bold text-white">Messages</h1>
        <p className="text-white/50 mt-1">Compose and send WhatsApp messages to customers</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Composer */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Compose Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Recipient</label>
                {selectedCustomer ? (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-500/20 text-blue-400">
                        {selectedCustomer.full_name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-white font-medium">{selectedCustomer.full_name}</p>
                      <p className="text-sm text-white/50">{selectedCustomer.phone}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(null)}>
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <Input
                        placeholder="Search customers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {searchQuery && (
                      <div className="max-h-48 overflow-y-auto space-y-1 p-1">
                        {filteredCustomers.length === 0 ? (
                          <p className="text-sm text-white/40 p-2">No customers found</p>
                        ) : (
                          filteredCustomers.slice(0, 5).map(customer => (
                            <button
                              key={customer.id}
                              onClick={() => { setSelectedCustomer(customer); setSearchQuery("") }}
                              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-left"
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-blue-500/20 text-blue-400 text-xs">
                                  {customer.full_name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-white text-sm">{customer.full_name}</p>
                                <p className="text-white/40 text-xs">{customer.phone}</p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white/70">Message</label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateAI}
                    disabled={aiGenerating || !selectedCustomer}
                    className="gap-2"
                  >
                    {aiGenerating ? (
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-amber-400" />
                    )}
                    AI Generate
                  </Button>
                </div>
                <textarea
                  className="w-full h-40 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder={selectedCustomer ? "Type your message or use templates..." : "Select a customer first"}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={!selectedCustomer}
                />
              </div>

              <div className="flex justify-between items-center">
                <p className="text-xs text-white/40">
                  Characters: {message.length}
                </p>
                <Button
                  className="gap-2 bg-green-500 hover:bg-green-600"
                  onClick={handleSend}
                  disabled={!selectedCustomer || !message.trim()}
                >
                  <Send className="h-4 w-4" />
                  Send via WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-400" />
                Quick Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MESSAGE_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    disabled={!selectedCustomer}
                    className="text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    <p className="text-sm font-medium text-white">{template.title}</p>
                    <p className="text-xs text-white/50 line-clamp-2">{template.content}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Messages Sent</span>
                <span className="text-white font-bold">{messagesSentThisMonth}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Total Customers</span>
                <span className="text-white font-bold">{customers.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Active Follow-ups</span>
                <span className="text-green-400 font-bold">{customers.filter(c => c.status === "active").length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-white/60">• Personalize messages with customer name</p>
              <p className="text-sm text-white/60">• Keep messages short and clear</p>
              <p className="text-sm text-white/60">• Include a call-to-action</p>
              <p className="text-sm text-white/60">• Follow up within 24-48 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {thisMonthActivities.slice(0, 5).map(activity => (
                <div key={activity.id} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-white/70">{activity.customer?.full_name || "Unknown"}</span>
                  <span className="text-white/40 text-xs truncate">{activity.message}</span>
                </div>
              ))}
              {thisMonthActivities.length === 0 && (
                <p className="text-sm text-white/40">No messages sent yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}