import { createClient } from '@supabase/supabase-js'

// anon-ключ публичный по определению (он в любом случае попадает в клиентский бандл)
const url = import.meta.env.VITE_SUPABASE_URL || 'https://kvhzixsmbqaoxdkofdbi.supabase.co'
const key = import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2aHppeHNtYnFhb3hka29mZGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NTg2OTYsImV4cCI6MjA5NTQzNDY5Nn0.2UZ3Qem1jDc4SEt-Eipea9L6ZjBjlkSeE8yBdPGt5cI'

export const supabase = createClient(url, key)

export const NOTIFY_URL = 'https://bot-vercel-five.vercel.app/api/portfolio-lead'
export const WHATSAPP_URL = 'https://wa.me/77066567765'
