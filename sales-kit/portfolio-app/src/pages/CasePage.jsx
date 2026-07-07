import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase, WHATSAPP_URL } from '../lib/supabase'
import { trackVisit } from '../lib/track'
import LeadModal from '../components/LeadModal'

function Paragraphs({ text }) {
  return text.split(/\n\n+/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)
}

export default function CasePage() {
  const { slug } = useParams()
  const [c, setC] = useState(undefined) // undefined = грузим, null = не найден
  const [leadOpen, setLeadOpen] = useState(false)

  useEffect(() => {
    trackVisit(slug)
    supabase.from('pf_cases').select('*').eq('slug', slug).maybeSingle()
      .then(({ data }) => setC(data))
    window.scrollTo(0, 0)
  }, [slug])

  if (c === undefined) return <div className="wrap"><div className="loading">Загружаю кейс…</div></div>
  if (c === null) return (
    <div className="wrap">
      <Link className="back" to="/">← Все кейсы</Link>
      <div className="loading">Кейс не найден</div>
    </div>
  )

  return (
    <div className="wrap">
      <Link className="back" to="/">← Все кейсы</Link>
      <div className="case-head">
        <div className="ptype">{c.niche}</div>
        <h1>{c.title}</h1>
        <p className="sub" style={{ margin: 0 }}>{c.short_desc}</p>
        {c.is_concept && <span className="concept-note">Концепт под нишу — показываем механику, не результаты клиента</span>}
      </div>

      {c.task_md && (
        <div className="case-sec"><h3>Задача</h3><Paragraphs text={c.task_md} /></div>
      )}
      {c.solution_md && (
        <div className="case-sec"><h3>Решение</h3><Paragraphs text={c.solution_md} /></div>
      )}
      {c.result_md && (
        <div className="case-sec"><h3>Результат</h3><Paragraphs text={c.result_md} /></div>
      )}

      {c.screens?.length > 0 && (
        <div className="screens">
          {c.screens.map(s => <img key={s} src={s} alt={c.title} loading="lazy" />)}
        </div>
      )}

      <div className="case-actions">
        <button className="btn" onClick={() => setLeadOpen(true)}>Хочу так же →</button>
        {c.live_url && <a className="btn-secondary" href={c.live_url} target="_blank" rel="noreferrer">Открыть живой проект</a>}
      </div>

      <p className="sign">Сделано в KARINA Media · <a href={WHATSAPP_URL}>wa.me/77066567765</a></p>

      <LeadModal open={leadOpen} onClose={() => setLeadOpen(false)} caseSlug={c.slug} caseTitle={c.title} />
    </div>
  )
}
