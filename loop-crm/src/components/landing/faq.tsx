"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Plus } from "lucide-react"

const faqs = [
  {
    question: "What is LoopCRM and who is it for?",
    answer: "LoopCRM is a customer relationship management tool designed specifically for local businesses like mobile shops, gyms, salons, repair centers, and coaching institutes. It helps you manage customers and automate follow-ups via WhatsApp.",
  },
  {
    question: "How does the WhatsApp integration work?",
    answer: "LoopCRM uses WhatsApp's official API to send messages. When you click send, it opens WhatsApp with the pre-filled message, so you can review and send it yourself. This ensures compliance and reliability.",
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required. You can cancel anytime with no questions asked.",
  },
  {
    question: "Can I import my existing customer data?",
    answer: "Absolutely. You can import customers via CSV file or manually add them. We also support bulk import for businesses with large customer databases.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take data security seriously. All data is encrypted in transit and at rest. We use industry-standard security practices and never share your customer data with third parties.",
  },
  {
    question: "What happens after the free trial?",
    answer: "After the trial, you can choose a plan that fits your needs. The Starter plan is free forever for small businesses with up to 100 customers. No credit card required to start.",
  },
  {
    question: "Do you offer customer support?",
    answer: "Yes! Professional and Business plan users get priority email support. We're also working on live chat support for all users. Our average response time is under 4 hours.",
  },
  {
    question: "Can I use LoopCRM on mobile?",
    answer: "Yes, LoopCRM works perfectly on mobile devices. The dashboard is fully responsive, and WhatsApp integration is optimized for mobile so you can manage follow-ups on the go.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-cyan-400 font-medium mb-4 block">FAQ</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Frequently asked{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              questions
            </span>
          </h2>
          <p className="text-xl text-white/60">
            Everything you need to know about LoopCRM.
          </p>
        </motion.div>

        {/* FAQ Grid */}
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl bg-slate-900/50 border border-white/5 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-white font-medium pr-8">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-white/40 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 text-white/60 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}