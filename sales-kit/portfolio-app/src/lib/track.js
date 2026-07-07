import { supabase } from './supabase'

export function captureRef() {
  const ref = new URLSearchParams(window.location.search).get('ref')
  if (ref) localStorage.setItem('pf_ref', ref)
  return localStorage.getItem('pf_ref') || ''
}

export function getRef() {
  return localStorage.getItem('pf_ref') || ''
}

// один визит на страницу за сессию, чтобы не накручивать счётчик
export function trackVisit(caseSlug = '') {
  const key = 'pf_v_' + (caseSlug || 'home')
  if (sessionStorage.getItem(key)) return
  sessionStorage.setItem(key, '1')
  supabase.from('pf_visits').insert({ ref_code: getRef(), case_slug: caseSlug }).then(() => {})
}
