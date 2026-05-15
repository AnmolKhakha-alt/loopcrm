"use client"

import { motion } from "framer-motion"
import { Check, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    description: "Perfect for small businesses getting started",
    price: "₹0",
    period: "/month",
    features: [
      { text: "Up to 100 customers", included: true },
      { text: "Basic follow-up reminders", included: true },
      { text: "WhatsApp messaging", included: true },
      { text: "5 message templates", included: true },
      { text: "Basic analytics", included: true },
      { text: "AI message assistant", included: false },
      { text: "Custom workflows", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Professional",
    description: "For growing businesses that need more power",
    price: "₹499",
    period: "/month",
    features: [
      { text: "Up to 1,000 customers", included: true },
      { text: "Advanced reminders", included: true },
      { text: "WhatsApp messaging", included: true },
      { text: "Unlimited templates", included: true },
      { text: "Advanced analytics", included: true },
      { text: "AI message assistant", included: true },
      { text: "Custom workflows", included: true },
      { text: "Priority email support", included: true },
    ],
    cta: "Start Trial",
    popular: true,
  },
  {
    name: "Business",
    description: "For established businesses with large customer bases",
    price: "₹1,499",
    period: "/month",
    features: [
      { text: "Unlimited customers", included: true },
      { text: "Advanced reminders", included: true },
      { text: "WhatsApp messaging", included: true },
      { text: "Unlimited templates", included: true },
      { text: "Advanced analytics", included: true },
      { text: "AI message assistant", included: true },
      { text: "Custom workflows", included: true },
      { text: "24/7 priority support", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-blue-500/10 to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-green-400 font-medium mb-4 block">PRICING</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple, transparent{" "}
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              pricing
            </span>
          </h2>
          <p className="text-xl text-white/60">
            Start free and scale as your business grows. No hidden fees.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl ${
                plan.popular
                  ? "bg-slate-800/80 border-2 border-blue-500/50 shadow-2xl shadow-blue-500/10"
                  : "bg-slate-900/50 border border-white/10"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-blue-500 text-white text-sm font-medium">
                    <Sparkles className="h-4 w-4" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Info */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <p className="text-white/50 text-sm mb-6">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/40 ml-1">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature.text}
                    className={`flex items-center gap-3 text-sm ${
                      feature.included ? "text-white/80" : "text-white/30"
                    }`}
                  >
                    {feature.included ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <X className="h-4 w-4 text-white/20" />
                    )}
                    {feature.text}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                asChild
                className={`w-full ${
                  plan.popular
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                <Link href="/auth/signup">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-white/40">
            🔒 30-day money-back guarantee • Cancel anytime • No questions asked
          </p>
        </motion.div>
      </div>
    </section>
  )
}