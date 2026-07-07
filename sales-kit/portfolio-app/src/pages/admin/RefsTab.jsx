import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const SITE = window.location.origin // реф-ссылки всегда от текущего домена

export default function RefsTab() {
  const [refs, setRefs] = useState(null)
  const [counts, setCounts] = useState({})
  const [code, setCode] = useState('')
  const [label, setLabel] = useState('')
  const [err, setErr] = useState('')
  const [copied, setCopied] = useState('')

  async function load() {
    const [{ data: refRows }, { data: visits }, { data: leads }] = await Promise.all([
      supabase.from('pf_ref_links').select('*').order('created_at'),
      supabase.from('pf_visits').select('ref_code').neq('ref_code', '').limit(10000),
      supabase.from('pf_leads').select('ref_code').neq('ref_code', ''),
    ])
    const c = {}
    for (const v of visits || []) { c[v.ref_code] = c[v.ref_code] || { v: 0, l: 0 }; c[v.ref_code].v++ }
    for (const l of leads || []) { c[l.ref_code] = c[l.ref_code] || { v: 0, l: 0 }; c[l.ref_code].l++ }
    setRefs(refRows || [])
    setCounts(c)
  }
  useEffect(() => { load() }, [])

  async function add(e) {
    e.preventDefault()
    const clean = code.trim().toLowerCase().replace(/[^\w-]/g, '')
    if (!clean) { setErr('Код — латиницей, без пробелов'); return }
    setErr('')
    const { error } = await supabase.from('pf_ref_links').insert({ code: clean, label: label.trim() })
    if (error) { setErr(error.message); return }
    setCode(''); setLabel('')
    load()
  }

  async function remove(r) {
    if (!window.confirm(`Удалить ссылку «${r.code}»? Статистика по коду останется в визитах.`)) return
    await supabase.from('pf_ref_links').delete().eq('id', r.id)
    load()
  }

  function copy(url, codeKey) {
    navigator.clipboard?.writeText(url)
    setCopied(codeKey)
    setTimeout(() => setCopied(''), 1500)
  }

  if (!refs) return <div className="loading">Загружаю…</div>

  return (
    <>
      <div className="panel">
        <h3>Новая реф-ссылка</h3>
        {err && <div className="err">{err}</div>}
        <form className="form-grid" onSubmit={add}>
          <div className="field"><label>Код (латиницей: chat1, insta…)</label>
            <input value={code} onChange={e => setCode(e.target.value)} /></div>
          <div className="field"><label>Подпись (для себя)</label>
            <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Чат предпринимателей Астана" /></div>
          <div className="field full"><button className="btn">Создать</button></div>
        </form>
      </div>
      <div className="panel">
        <h3>Ссылки по каналам</h3>
        {refs.length === 0 && <p className="note">Пока нет ссылок. Создайте код под каждый канал — чат, Instagram, бот — и раздавайте разные ссылки, чтобы видеть, откуда приходят.</p>}
        {refs.map(r => {
          const url = SITE + '/?ref=' + r.code
          const c = counts[r.code] || { v: 0, l: 0 }
          return (
            <div className="row" key={r.id}>
              <div className="rmain">
                <div className="rname">{r.code} {r.label && <span className="rmeta">— {r.label}</span>}</div>
                <div className="copy-link">{url}</div>
              </div>
              <div className="ract">
                <span className="badge">{c.v} переходов</span>
                <span className="badge new">{c.l} заявок</span>
                <button className="sm" onClick={() => copy(url, r.code)}>{copied === r.code ? '✓ Скопировано' : 'Копировать'}</button>
                <button className="sm warn" onClick={() => remove(r)}>Удалить</button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
