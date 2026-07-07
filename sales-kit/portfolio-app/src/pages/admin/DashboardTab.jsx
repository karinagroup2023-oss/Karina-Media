import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function DashboardTab() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    async function load() {
      const monthAgo = new Date(Date.now() - 30 * 864e5).toISOString()
      const [visits, leads, recentVisits, recentLeads] = await Promise.all([
        supabase.from('pf_visits').select('*', { count: 'exact', head: true }),
        supabase.from('pf_leads').select('*', { count: 'exact', head: true }),
        supabase.from('pf_visits').select('case_slug, ref_code').gte('created_at', monthAgo).limit(5000),
        supabase.from('pf_leads').select('name, phone, case_slug, ref_code, created_at, status').order('created_at', { ascending: false }).limit(5),
      ])
      const byCase = {}
      for (const v of recentVisits.data || []) {
        if (v.case_slug) byCase[v.case_slug] = (byCase[v.case_slug] || 0) + 1
      }
      const top = Object.entries(byCase).sort((a, b) => b[1] - a[1]).slice(0, 6)
      setStats({
        visitsTotal: visits.count || 0,
        leadsTotal: leads.count || 0,
        visits30: (recentVisits.data || []).length,
        top,
        recentLeads: recentLeads.data || [],
      })
    }
    load()
  }, [])

  if (!stats) return <div className="loading">Считаю…</div>

  return (
    <>
      <div className="panel">
        <h3>Цифры</h3>
        <div className="kpis">
          <div className="kpi"><b>{stats.visits30}</b><span>просмотров за 30 дней</span></div>
          <div className="kpi"><b>{stats.visitsTotal}</b><span>просмотров всего</span></div>
          <div className="kpi"><b>{stats.leadsTotal}</b><span>заявок всего</span></div>
        </div>
      </div>
      <div className="panel">
        <h3>Топ кейсов за 30 дней</h3>
        {stats.top.length === 0 && <p className="note">Пока нет просмотров кейсов.</p>}
        {stats.top.map(([slug, n]) => (
          <div className="row" key={slug}>
            <div className="rmain"><div className="rname">{slug}</div></div>
            <div className="ract"><span className="badge">{n} просм.</span></div>
          </div>
        ))}
      </div>
      <div className="panel">
        <h3>Последние заявки</h3>
        {stats.recentLeads.length === 0 && <p className="note">Заявок пока нет.</p>}
        {stats.recentLeads.map(l => (
          <div className="row" key={l.created_at + l.phone}>
            <div className="rmain">
              <div className="rname">{l.name} · {l.phone}</div>
              <div className="rmeta">{new Date(l.created_at).toLocaleString('ru-RU')} {l.case_slug && ' · кейс: ' + l.case_slug} {l.ref_code && ' · реф: ' + l.ref_code}</div>
            </div>
            <div className="ract"><span className={'badge' + (l.status === 'new' ? ' new' : '')}>{l.status}</span></div>
          </div>
        ))}
      </div>
    </>
  )
}
