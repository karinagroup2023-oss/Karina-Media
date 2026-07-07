import { useState } from 'react'
import { supabase, NOTIFY_URL, WHATSAPP_URL } from '../lib/supabase'
import { getRef } from '../lib/track'

export default function LeadModal({ open, onClose, caseSlug = '', caseTitle = '' }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+7 ')
  const [message, setMessage] = useState('')
  const [company, setCompany] = useState('') // honeypot
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')

  if (!open) return null

  async function submit(e) {
    e.preventDefault()
    const cleanPhone = phone.replace(/[^\d+]/g, '')
    if (!name.trim() || cleanPhone.length < 11) {
      setErr('Укажите имя и номер телефона')
      return
    }
    setErr('')
    setSending(true)
    const lead = {
      name: name.trim(), phone: cleanPhone, message: message.trim(),
      case_slug: caseSlug, ref_code: getRef(),
    }
    const { error } = await supabase.from('pf_leads').insert(lead)
    if (error) {
      setSending(false)
      setErr('Не получилось отправить, попробуйте ещё раз или напишите в WhatsApp')
      return
    }
    // уведомление в TG-группу — не блокирует успех заявки
    fetch(NOTIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...lead, case_title: caseTitle || caseSlug, company }),
    }).catch(() => {})
    setSending(false)
    setDone(true)
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {done ? (
          <div className="ok-box">
            <div className="big">✅</div>
            <h3>Заявка принята!</h3>
            <p className="mdesc">Свяжемся с вами в ближайшее время. Хотите быстрее — напишите сразу в WhatsApp.</p>
            <div className="mrow">
              <a className="btn" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Открыть WhatsApp</a>
              <button className="ghost" onClick={onClose}>Закрыть</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h3>Хочу так же</h3>
            <p className="mdesc">{caseTitle ? `Обсудим проект как «${caseTitle}» под ваш бизнес.` : 'Оставьте контакт — обсудим ваш проект.'}</p>
            {err && <div className="err">{err}</div>}
            <div className="field">
              <label>Ваше имя</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Имя" />
            </div>
            <div className="field">
              <label>Телефон (WhatsApp)</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} inputMode="tel" placeholder="+7 ___ ___ __ __" />
            </div>
            <div className="field">
              <label>Что нужно? (не обязательно)</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Пара слов о вашем бизнесе и задаче" />
            </div>
            <div className="hp">
              <label>Компания</label>
              <input value={company} onChange={e => setCompany(e.target.value)} tabIndex="-1" autoComplete="off" />
            </div>
            <div className="mrow">
              <button className="btn" type="submit" disabled={sending}>{sending ? 'Отправляю…' : 'Отправить заявку'}</button>
              <button className="ghost" type="button" onClick={onClose}>Отмена</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
