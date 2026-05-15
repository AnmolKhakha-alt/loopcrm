"use client"

import { motion } from "framer-motion"
import {
  Users,
  MessageSquare,
  Bell,
  Sparkles,
  BarChart3,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Users,
    title: "Customer Management",
    description: "Store all customer details, purchase history, and interaction notes in one place.",
    color: "blue",
    benefits: ["Contact management", "Purchase tracking", "Notes & tags", "Search & filter"],
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Follow-Ups",
    description: "Send automated follow-up messages via WhatsApp to keep customers engaged.",
    color: "green",
    benefits: ["One-click messaging", "Message templates", "AI-generated messages", "Delivery tracking"],
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Schedule automated reminders for follow-ups, appointments, and renewals.",
    color: "amber",
    benefits: ["Automated scheduling", "Due date alerts", "Overdue highlights", "Snooze options"],
  },
  {
    icon: Sparkles,
    title: "AI Message Assistant",
    description: "Generate professional follow-up messages with AI assistance.",
    color: "purple",
    benefits: ["Smart suggestions", "Personalized copy", "Multiple tones", "One-click generation"],
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track customer growth, follow-up rates, and business performance.",
    color: "cyan",
    benefits: ["Real-time metrics", "Growth trends", "Activity log", "Export reports"],
  },
  {
    icon: Zap,
    title: "Workflow Automation",
    description: "Automate repetitive tasks and save time with smart workflows.",
    color: "pink",
    benefits: ["Auto-follow-ups", "Birthday messages", "Payment reminders", "Custom triggers"],
  },
]

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  green: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20" },
}

export function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-blue-400 font-medium mb-4 block">FEATURES</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              grow your business
            </span>
          </h2>
          <p className="text-xl text-white/60">
            Powerful tools designed specifically for local businesses to increase customer retention.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-all duration-300"
            >
              {/* Hover Glow */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${
                feature.color === "blue" ? "from-blue-500/5" :
                feature.color === "green" ? "from-green-500/5" :
                feature.color === "amber" ? "from-amber-500/5" :
                feature.color === "purple" ? "from-purple-500/5" :
                feature.color === "cyan" ? "from-cyan-500/5" : "from-pink-500/5"
              } to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className="relative">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${colorClasses[feature.color].bg} border ${colorClasses[feature.color].border} flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${colorClasses[feature.color].text}`} />
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/50 mb-4">{feature.description}</p>

                {/* Benefits */}
                <ul className="space-y-2">
                  {feature.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm text-white/40">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600">
            <Link href="/auth/signup">
              Explore All Features
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}