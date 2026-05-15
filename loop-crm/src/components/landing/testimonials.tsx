"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Rajesh Kumar",
    business: "Mobile Repairs Hub",
    location: "Delhi",
    avatar: "RK",
    rating: 5,
    quote: "LoopCRM transformed how I follow up with customers. My repeat business increased by 40% in just 3 months. The WhatsApp automation is a game-changer!",
  },
  {
    name: "Priya Sharma",
    business: "Fitness First Gym",
    location: "Mumbai",
    avatar: "PS",
    rating: 5,
    quote: "I used to forget to follow up with members. Now LoopCRM reminds me automatically. My member retention improved significantly. Highly recommended!",
  },
  {
    name: "Amit Patel",
    business: "Tech Solutions",
    location: "Ahmedabad",
    avatar: "AP",
    rating: 5,
    quote: "The AI message generator saves me so much time. It creates professional follow-ups that actually get responses. Best investment for my business.",
  },
  {
    name: "Sneha Gupta",
    business: "Glamour Salon",
    location: "Bangalore",
    avatar: "SG",
    rating: 5,
    quote: "Simple yet powerful. My customers love getting personalized follow-ups. It feels like I have a dedicated assistant managing all my appointments.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-slate-950/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-amber-400 font-medium mb-4 block">TESTIMONIALS</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Loved by{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              local businesses
            </span>
          </h2>
          <p className="text-xl text-white/60">
            Join hundreds of business owners who have transformed their customer relationships.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative p-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-all"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-white/10" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-white/70 mb-6 leading-relaxed">"{testimonial.quote}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-white font-medium">{testimonial.name}</p>
                  <p className="text-white/40 text-sm">{testimonial.business}, {testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}