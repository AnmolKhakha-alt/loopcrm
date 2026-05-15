"use client"

import { motion } from "framer-motion"
import { Users, TrendingUp, MessageSquare, Heart } from "lucide-react"

const stats = [
  { icon: Users, label: "Active Businesses", value: "2,500+", description: "Local shops trust LoopCRM" },
  { icon: TrendingUp, label: "Retention Rate", value: "89%", description: "Average customer retention" },
  { icon: MessageSquare, label: "Messages Sent", value: "1.2M+", description: "Follow-ups delivered" },
  { icon: Heart, label: "Satisfaction", value: "98%", description: "Customer satisfaction" },
]

const logos = [
  "Mobile Shop", "Gym Pro", "Salon Elite", "ServiceHub", "RetailCo", "HealthPlus"
]

export function SocialProofSection() {
  return (
    <section className="py-20 bg-slate-950/50 border-y border-white/5">
      <div className="container mx-auto px-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 mb-4">
                <stat.icon className="h-6 w-6 text-blue-400" />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-white/70 font-medium">{stat.label}</p>
              <p className="text-white/40 text-sm mt-1">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Logos */}
        <div className="text-center">
          <p className="text-white/40 text-sm mb-8">Trusted by businesses across India</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
            {logos.map((logo) => (
              <span key={logo} className="text-xl font-semibold text-white/60">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}