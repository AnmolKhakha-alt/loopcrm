import { supabase } from "./supabase"

export type EventName = 
  | 'user_signup'
  | 'user_login'
  | 'add_customer'
  | 'create_reminder'
  | 'send_whatsapp_message'

/**
 * Tracks an application event to the console and Supabase
 * @param name The name of the event
 * @param metadata Additional data to store with the event
 */
export async function trackEvent(name: EventName, metadata: any = {}) {
  const timestamp = new Date().toISOString()
  
  // 1. Console Log (always)
  console.log(`[EVENT] ${name} at ${timestamp}`, metadata)

  // 2. Supabase Log (if authenticated)
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id

    const { error } = await supabase.from('events').insert({
      user_id: userId || null,
      event_name: name,
      metadata: {
        ...metadata,
        client_timestamp: timestamp
      }
    })

    if (error) {
      console.warn('Supabase event tracking error:', error.message)
    }
  } catch (err) {
    // Fail silently to not disrupt user experience
    console.error('Failed to track event:', err)
  }
}
