// WhatsApp deep link utilities

export interface MessageTemplate {
  id: string
  title: string
  category: "followup" | "payment" | "service" | "promotional" | "thankyou"
  content: string
}

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: "product-followup",
    title: "Product Follow-up",
    category: "followup",
    content: "Hi {name}! Just checking in about your {product}. How's everything going? Let me know if you need any help!",
  },
  {
    id: "payment-reminder",
    title: "Payment Reminder",
    category: "payment",
    content: "Hi {name}! This is a friendly reminder about the payment for {product}. Please let me know if you have any questions.",
  },
  {
    id: "service-reminder",
    title: "Service Reminder",
    category: "service",
    content: "Hi {name}! Just a reminder that your {product} service is due soon. Would you like to schedule an appointment?",
  },
  {
    id: "promotional-offer",
    title: "Promotional Offer",
    category: "promotional",
    content: "Hi {name}! We have an exciting offer for you on {product}. Limited time only! Would you like to know more?",
  },
  {
    id: "thankyou-message",
    title: "Thank You",
    category: "thankyou",
    content: "Hi {name}! Thank you for choosing us for {product}. We really appreciate your business!",
  },
]

export function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-digit characters except leading +
  return phone.replace(/[^\d+]/g, "")
}

export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = formatPhoneForWhatsApp(phone)
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

export function fillTemplate(template: MessageTemplate, customerName: string, product?: string): string {
  let message = template.content
    .replace(/{name}/g, customerName)
    .replace(/{product}/g, product || "your purchase")
  return message
}

// Mock AI-generated messages (simulated locally)
export function generateAIMessage(
  customerName: string,
  product: string | undefined,
  intent: "followup" | "reminder" | "promotional" | "checkin"
): string {
  const aiMessages: Record<string, string[]> = {
    followup: [
      `Hi ${customerName}! Just wanted to follow up on your recent ${product || "purchase"}. Hope everything is going well! Let me know if you need any assistance.`,
      `Hello ${customerName}! Checking in to see how you're doing with your ${product || "order"}. We're here if you have any questions!`,
      `Hey ${customerName}! Just a quick follow-up on your ${product || "purchase"}. Would love to hear your feedback!`,
    ],
    reminder: [
      `Hi ${customerName}! Friendly reminder about your upcoming ${product || "appointment"}. Looking forward to seeing you!`,
      `Hello ${customerName}! This is a gentle reminder about your ${product || "service"}. Please let us know if you need to reschedule.`,
      `Hey ${customerName}! Just reminding you about your ${product || "upcoming visit"}. See you soon!`,
    ],
    promotional: [
      `Hi ${customerName}! We have something special for you regarding ${product || "our services"}! Don't miss out on this exclusive offer.`,
      `Hello ${customerName}! Great news - we have a new offer on ${product || "our products"} that you might love!`,
      `Hey ${customerName}! Special discount just for you on ${product || "our services"}. Limited time only!`,
    ],
    checkin: [
      `Hi ${customerName}! Just checking in to see how everything is going. Hope you're doing great!`,
      `Hello ${customerName}! Wanted to check in and see if there's anything we can help you with.`,
      `Hey ${customerName}! How's everything going? We're here if you need anything!`,
    ],
  }

  const messages = aiMessages[intent] || aiMessages.checkin
  return messages[Math.floor(Math.random() * messages.length)]
}