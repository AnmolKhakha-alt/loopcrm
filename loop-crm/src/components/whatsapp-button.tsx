"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, ChevronDown, Sparkles, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { MESSAGE_TEMPLATES, generateWhatsAppLink, fillTemplate, generateAIMessage } from "@/lib/whatsapp"
import { useToast } from "@/lib/hooks/use-toast"
import { trackEvent } from "@/lib/events"

interface WhatsAppButtonProps {
  phone: string
  customerName: string
  product?: string
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function WhatsAppButton({ phone, customerName, product, size = "sm", showLabel = false }: WhatsAppButtonProps) {
  const [showComposer, setShowComposer] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { addToast } = useToast()

  const sizeClasses = {
    sm: "px-3 py-2",
    md: "px-4 py-2.5",
    lg: "px-5 py-3",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-4 w-5",
    lg: "h-5 w-5",
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = MESSAGE_TEMPLATES.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setMessage(fillTemplate(template, customerName, product || undefined))
    }
  }

  const handleGenerateAI = () => {
    setIsGenerating(true)
    // Simulate AI generation delay
    setTimeout(() => {
      const intents: Array<"followup" | "reminder" | "promotional" | "checkin"> = ["followup", "reminder", "checkin", "promotional"]
      const randomIntent = intents[Math.floor(Math.random() * intents.length)]
      const generatedMessage = generateAIMessage(customerName, product || undefined, randomIntent)
      setMessage(generatedMessage)
      setSelectedTemplate(null)
      setIsGenerating(false)
      addToast({ title: "AI message generated!", variant: "success" })
    }, 800)
  }

  const handleSend = () => {
    const link = generateWhatsAppLink(phone, message)
    window.open(link, "_blank")
    
    // Log event
    trackEvent('send_whatsapp_message', {
      customer_name: customerName,
      has_product: !!product,
      message_length: message.length,
      used_template: !!selectedTemplate
    })

    setShowComposer(false)
    setMessage("")
    setSelectedTemplate(null)
    addToast({ title: "Opening WhatsApp...", variant: "success" })
  }

  const templateCategories = [
    { key: "followup", label: "Follow-up" },
    { key: "payment", label: "Payment" },
    { key: "service", label: "Service" },
    { key: "promotional", label: "Promo" },
    { key: "thankyou", label: "Thank You" },
  ]

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowComposer(true)}
        className={`bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500/50 touch-manipulation ${sizeClasses[size]}`}
      >
        <MessageSquare className={iconSizes[size]} />
        {showLabel && <span className="ml-2">WhatsApp</span>}
      </Button>

      <Dialog open={showComposer} onOpenChange={setShowComposer}>
        <DialogContent className="w-[95vw] max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-400" />
              Send WhatsApp Message
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Quick Templates */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Quick Templates</label>
              <div className="flex flex-wrap gap-2">
                {templateCategories.map((cat) => (
                  <Button
                    key={cat.key}
                    variant={selectedTemplate?.startsWith(cat.key) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const template = MESSAGE_TEMPLATES.find(t => t.category === cat.key)
                      if (template) handleTemplateSelect(template.id)
                    }}
                    className="text-xs"
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* AI Generator */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-white/70 flex-1">Generate AI-powered message</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="text-blue-400 hover:text-blue-300"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </Button>
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message or select a template..."
                className="w-full h-32 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white placeholder-white/30 resize-none focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-white/40">
                Message will open WhatsApp with this text
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowComposer(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              className="bg-green-500 hover:bg-green-600"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Send via WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}