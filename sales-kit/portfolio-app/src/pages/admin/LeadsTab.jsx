import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const STATUSES = { new: 'новая', work: 'в работе', closed: 'закрыта' }

export default function LeadsTab() {
  const [leads, setLeads] = useState(null)

  const load = () => supabase.from('pf_leads').select('*').order('created_at', { ascending: false }).limit(200)
    .then(({ data }) => setLeads(data || []))
  useEffect(() => { load() }, [])

  async function setStatus(l, status) {
    await supabase.from('pf_leads').update({ status }).eq('id', l.id)
    load()
  }

  if (!leads) return <div className="loading">Загружаю…</div>

  return (
    <div className="panel">
      <h3>Заявки ({leads.length})</h3>
      {leads.length === 0 && <p className="note">Заявок пока нет.</p>}
      {leads.map(l => (
        <div className="row" key={l.id}>
          <div className="rmain">
            <div className="rname">{l.name} · <a href={'https://wa.me/' + l.phone.replace(/\D/g, '')} target="_blank" rel="noreferrer">{l.phone}</a></div>
            <div className="rmeta">
              {new Date(l.created_at).toLocaleString('ru-RU')}
              {l.case_slug && ' · кейс: ' + l.case_slug}
              {l.ref_code && ' · источник: ' + l.ref_code}
              {l.message && <><br />💬 {l.message}</>}
            </div>
          </div>
          <div className="ract">
            <select className="sm" value={l.status} onChange={e => setStatus(l, e.target.value)}>
              {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>
      ))}
    </div>
  )
}
