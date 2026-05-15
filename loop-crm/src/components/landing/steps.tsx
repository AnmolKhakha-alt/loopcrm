"use client"

import { motion } from "framer-motion"
import { Users, Calendar, TrendingUp, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const steps = [
  {
    number: "01",
    icon: Users,
    title: "Add Your Customers",
    description: "Import your customer list or add new customers manually. Store their contact details, purchase history, and preferences.",
    color: "blue",
  },
  {
    number: "02",
    icon: Calendar,
    title: "Schedule Follow-Ups",
    description: "Set up automated reminders and follow-up schedules. Choose when and how you want to reach out to each customer.",
    color: "purple",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Watch Your Business Grow",
    description: "See increased customer retention, more repeat purchases, and growth in your revenue through automated follow-ups.",
    color: "green",
  },
]

const colorClasses: Record<string, string> = {
  blue: "from-blue-500 to-blue-600",
  purple: "from-purple-500 to-purple-600",
  green: "from-green-500 to-green-600",
}

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-slate-950/50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-purple-400 font-medium mb-4 block">HOW IT WORKS</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Three simple steps to{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              more repeat customers
            </span>
          </h2>
          <p className="text-xl text-white/60">
            Get started in minutes and start building lasting customer relationships.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-32 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-green-500/50" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              {/* Step Card */}
              <div className="relative p-8 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl text-center group hover:border-white/20 transition-all">
                {/* Number Badge */}
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br ${colorClasses[step.color]} flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform`}>
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-slate-800/50 border border-white/10 flex items-center justify-center mx-auto mb-6 group-hover:border-white/20 transition-colors">
                  <step.icon className="h-8 w-8 text-white/80" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-white/50">{step.description}</p>
              </div>

              {/* Arrow Between Steps */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-white/40" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
            <Link href="/auth/signup">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="text-white/40 text-sm mt-4">No credit card required • 14-day free trial</p>
        </motion.div>
      </div>
    </section>
  )
}