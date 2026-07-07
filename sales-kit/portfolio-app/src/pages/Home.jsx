import { useEffect, useState } from 'react'
import { supabase, WHATSAPP_URL } from '../lib/supabase'
import { trackVisit } from '../lib/track'
import CaseCard from '../components/CaseCard'
import LeadModal from '../components/LeadModal'

const FILTERS = [
  { key: 'all', label: 'Все работы' },
  { key: 'miniapp', label: 'Мини-аппы' },
  { key: 'site', label: 'Сайты' },
  { key: 'quiz', label: 'Квизы' },
]

export default function Home() {
  const [cases, setCases] = useState(null)
  const [filter, setFilter] = useState('all')
  const [leadOpen, setLeadOpen] = useState(false)

  useEffect(() => {
    trackVisit('')
    supabase.from('pf_cases').select('*').eq('published', true).order('sort_order')
      .then(({ data }) => setCases(data || []))
  }, [])

  const shown = cases ? (filter === 'all' ? cases : cases.filter(c => c.type === filter)) : []

  return (
    <div className="wrap">
      <div className="head">
        <div className="brand">KARINA Media</div>
        <h1>Портфолио</h1>
        <p className="sub">Сайты и приложения, которые принимают заявки и записи за вас — круглосуточно, без переписок. Клиент выбирает и бронирует сам, вам остаётся подтвердить.</p>
      </div>

      <div className="stats">
        <div className="stat"><b>5 дней</b><span>средний срок мини-аппа</span></div>
        <div className="stat"><b>13+</b><span>запущенных проектов</span></div>
        <div className="stat"><b>RU / KZ</b><span>двуязычные решения</span></div>
      </div>

      <div className="explain">
        <div className="lead">За пару минут — как перестать терять заявки:</div>
        <video src="/leads-capture.mp4" poster="/video-poster.jpg" controls preload="metadata" playsInline />
      </div>

      <div className="explain">
        <div className="lead">А если коротко — на одной картинке:</div>
        <img src="/before-after.png" alt="Как было и как стало: клиент записывается сам, вам приходит заявка" />
      </div>

      <div className="sec" style={{ textAlign: 'center' }}>Реальные проекты по нишам</div>
      <div className="filters">
        {FILTERS.map(f => (
          <button key={f.key} className={'fbtn' + (filter === f.key ? ' on' : '')} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {cases === null
        ? <div className="loading">Загружаю кейсы…</div>
        : <div className="grid">{shown.map(c => <CaseCard key={c.slug} c={c} />)}</div>}

      <div className="cta">
        <h2>Хотите так же для своего бизнеса?</h2>
        <p>Сайт или мини-апп под ключ. Покажем черновик на вашем контенте за 2–3 дня.</p>
        <button className="btn" onClick={() => setLeadOpen(true)}>Хочу так же →</button>
        <a className="btn-secondary" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Или написать в WhatsApp</a>
      </div>

      <p className="sign">Сделано в KARINA Media · ТОО, договор · <a href={WHATSAPP_URL}>wa.me/77066567765</a></p>

      <LeadModal open={leadOpen} onClose={() => setLeadOpen(false)} />
    </div>
  )
}
